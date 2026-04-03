import nodePolyfills from '@rolldown/plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import { defineConfig, Plugin, UserConfig, loadEnv } from 'vite'

// Workaround for Rolldown not generating ESM named exports from CJS barrels.
// Rewrites named imports to lazy property access on the default export,
// avoiding both the missing-named-exports issue and circular dependency TDZ errors.
function cjsNamedImportsFix(packages: string[]): Plugin {
  const pkgPattern = packages.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const importRe = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"](?:${pkgPattern})['"]`,
    'g'
  )
  return {
    name: 'cjs-named-imports-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('.vite/deps/')) return
      if (!importRe.test(code)) return
      importRe.lastIndex = 0
      let counter = 0
      return code.replace(importRe, (match, bindings) => {
        const pkgMatch = match.match(/from\s*['"]([^'"]+)['"]/)
        if (!pkgMatch) return match
        const pkg = pkgMatch[1]
        const alias = `__cjs_${pkg.replace(/[^a-zA-Z0-9]/g, '_')}_${counter++}`
        const names = bindings.split(',').map((b: string) => b.trim()).filter(Boolean)
        const lines = [`import ${alias} from '${pkg}';`]
        for (const n of names) {
          const parts = n.split(/\s+as\s+/)
          const imported = parts[0].trim()
          const local = (parts[1] || parts[0]).trim()
          lines.push(`const ${local} = ${alias}["${imported}"];`)
        }
        return lines.join('\n')
      })
    }
  }
}

// Workaround for CJS packages with `exports.default = Component` where
// `import Foo from 'pkg'` gets the wrapper object instead of the .default value.
// Rewrites to `import __cjs from 'pkg'; const Foo = __cjs.default || __cjs;`
function cjsDefaultImportFix(packages: string[]): Plugin {
  const pkgPattern = packages.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const defaultImportRe = new RegExp(
    `import\\s+([a-zA-Z_$][\\w$]*)\\s+from\\s*['"](?:${pkgPattern})['"]`,
    'g'
  )
  return {
    name: 'cjs-default-import-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('.vite/deps/')) return
      if (!defaultImportRe.test(code)) return
      defaultImportRe.lastIndex = 0
      return code.replace(defaultImportRe, (match, name) => {
        const pkgMatch = match.match(/from\s*['"]([^'"]+)['"]/)
        if (!pkgMatch) return match
        const pkg = pkgMatch[1]
        const alias = `__cjs_default_${pkg.replace(/[^a-zA-Z0-9]/g, '_')}`
        return `import ${alias} from '${pkg}';\nconst ${name} = ${alias}.default || ${alias}`
      })
    }
  }
}

// Fix TDZ in decentraland-transactions: contracts/index.js uses ContractName
// as computed property keys at the top level (`[ContractName.Bid]: bid`).
// If Rolldown evaluates this module before types.js, ContractName is still
// in TDZ. Fix by deferring the `contracts` object to a lazy initializer so
// ContractName is only read at call time, not at module evaluation time.
function fixDecentralandTransactionsTDZ(): Plugin {
  return {
    name: 'fix-decentraland-transactions-tdz',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('decentraland-transactions/esm/contracts/index')) return
      if (!code.includes('const contracts = {')) return
      // Replace eager `const contracts = { [ContractName.X]: ... }` with a
      // lazy initializer that builds the object on first access.
      return code.replace(
        /const contracts = \{/,
        'let _contracts;\nfunction _getContracts() { if (!_contracts) _contracts = {'
      ).replace(
        /\};\nexport function getContract/,
        '}; return _contracts; }\nexport function getContract'
      ).replace(
        /contracts\[contractName\]/g,
        '_getContracts()[contractName]'
      ).replace(
        /for \(const contractName in contracts\)/,
        'for (const contractName in _getContracts())'
      ).replace(
        /contracts\[contractName\]/g,
        '_getContracts()[contractName]'
      )
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [
      fixDecentralandTransactionsTDZ(),
      cjsNamedImportsFix([
        'dcl-catalyst-client/dist/client/LambdasClient',
        'dcl-catalyst-client/dist/client/ContentClient',
        'dcl-catalyst-client/dist/client/types',
        'dcl-catalyst-client/dist/client/utils/DeploymentBuilder',
        'ethers/lib/utils'
      ]),
      cjsDefaultImportFix(['react-countup']),
      react(),
      nodePolyfills(),
      // Fix Rolldown's __toESM isNodeMode=1 that skips __esModule check.
      // The transform hook intercepts dep chunks when Vite serves them.
      {
        name: 'cjs-toesm-fix',
        transform(code, id) {
          if (!id.includes('.vite/deps/') || !code.includes('var __toESM')) return
          return code.replace(
            /var __toESM = \(mod, isNodeMode, target\) => \(target = mod != null \? __create\(__getProtoOf\(mod\)\) : \{\}, __copyProps\(isNodeMode \|\| !mod \|\| !mod\.__esModule/,
            'var __toESM = (mod, _isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(!mod || !mod.__esModule'
          )
        }
      }
    ],
    // Required because the CatalystClient tries to access it
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'process.env': {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VITE_DCL_DEFAULT_ENV: envVariables.VITE_DCL_DEFAULT_ENV,
        VITE_BASE_URL: envVariables.VITE_BASE_URL
      },
      global: {}
    },
    server: {
      open: true,
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/auth': {
          target: 'https://decentraland.zone',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      // Use esbuild for CSS minification instead of Lightning CSS to avoid
      // errors with invalid pseudo-element selectors in Semantic UI CSS.
      cssMinify: 'esbuild',
      // Disable sourcemaps in CI/Vercel to reduce memory usage (avoids OOM on 8GB build)
      sourcemap: !process.env.CI && !process.env.VERCEL
    },
    ...(command === 'build' ? { base: envVariables.VITE_BASE_URL } : undefined)
  } as unknown as UserConfig
})
