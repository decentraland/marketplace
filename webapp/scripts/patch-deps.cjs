/**
 * Workaround for two Rolldown CJS interop issues in Vite 8 pre-bundled deps:
 *
 * 1. __toESM isNodeMode: Rolldown passes isNodeMode=1 to __toESM which skips
 *    the __esModule check, double-wrapping .default on CJS modules that already
 *    set __esModule: true.
 *
 * 2. Missing named exports: Rolldown wraps CJS barrel exports (like decentraland-ui)
 *    as a single default export without generating individual ESM named exports.
 *    This breaks `import { Foo } from 'cjs-package'` patterns.
 *
 * Run after `vite optimize` and before `vite` to fix the cached deps.
 */
const fs = require('fs')
const path = require('path')

const depsDir = path.join(__dirname, '..', 'node_modules', '.vite', 'deps')

/**
 * Patch 1: Fix __toESM isNodeMode to always respect __esModule flag.
 */
function patchToESM(files) {
  let count = 0
  for (const file of files) {
    const filePath = path.join(depsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    if (!content.includes('var __toESM')) continue
    const patched = content.replace(
      /var __toESM = \(mod, isNodeMode, target\) => \(target = mod != null \? __create\(__getProtoOf\(mod\)\) : \{\}, __copyProps\(isNodeMode \|\| !mod \|\| !mod\.__esModule/,
      'var __toESM = (mod, _isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(!mod || !mod.__esModule'
    )
    if (patched !== content) {
      fs.writeFileSync(filePath, patched)
      count++
      console.log(`  Patched __toESM in ${file}`)
    }
  }
  return count
}

/**
 * Extract named export keys from bundled CJS code when we can't require() the package.
 * Looks for patterns like `exports.Foo = ...` and `exports["Foo"] = ...` inside
 * __commonJSMin wrappers. Also follows `__exportStar(require_xxx(), exports)` calls
 * to find re-exported names from sub-modules within the same chunk.
 */
function extractExportNames(content) {
  const names = new Set()
  // Match: exports.Name = ... (but not exports.__esModule)
  const dotPattern = /exports\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g
  let m
  while ((m = dotPattern.exec(content)) !== null) {
    const name = m[1]
    if (name !== '__esModule' && name !== 'default') {
      names.add(name)
    }
  }
  // Match: exports["Name"] = ...
  const bracketPattern = /exports\["([a-zA-Z_$][a-zA-Z0-9_$]*)"\]\s*=/g
  while ((m = bracketPattern.exec(content)) !== null) {
    const name = m[1]
    if (name !== '__esModule' && name !== 'default') {
      names.add(name)
    }
  }

  // Follow __exportStar references: __exportStar(require_xxx(), exports)
  // These copy all properties from a sub-module. Find the sub-module's exports
  // by looking at the referenced require_xxx function's body.
  const exportStarPattern = /__exportStar\((require_\w+)\(\)/g
  while ((m = exportStarPattern.exec(content)) !== null) {
    const fnName = m[1]
    // Find the function body: var require_xxx = __commonJSMin(((exports) => { ... }))
    const fnDefRe = new RegExp(`var ${fnName.replace(/\$/g, '\\$')} = /\\* @__PURE__ \\*/ __commonJSMin\\(\\(\\(exports\\) => \\{([\\s\\S]*?)\\}\\)\\);`)
    const fnMatch = content.match(fnDefRe)
    if (fnMatch) {
      const body = fnMatch[1]
      // Extract exports.X from this function body
      const innerDot = /exports\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g
      let im
      while ((im = innerDot.exec(body)) !== null) {
        if (im[1] !== '__esModule' && im[1] !== 'default') names.add(im[1])
      }
    }
  }

  return Array.from(names)
}

/**
 * Patch 2: Add named ESM re-exports for CJS barrel modules.
 *
 * Rolldown bundles CJS modules with only `export default require_xxx()` which
 * means `import { Foo } from 'package'` gets undefined. We detect these and
 * add explicit named re-exports by inspecting the actual CJS module at runtime.
 */
function patchNamedExports(files) {
  let count = 0
  // Match files that have `export default require_xxx()` as their main export
  const defaultExportPattern = /export default (require_\w+)\(\);/

  for (const file of files) {
    const filePath = path.join(depsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(defaultExportPattern)
    if (!match) continue

    const requireFn = match[0] // e.g. "export default require_dist();"

    // Try to get export names by requiring the actual CJS package.
    // Also try with browser globals shimmed to handle packages that use `self`, `window`, etc.
    const pkgName = file.replace(/\.js$/, '').replace(/_/g, '/')
    let exportKeys = []
    try {
      const cjsModule = require(pkgName)
      exportKeys = Object.keys(cjsModule).filter(
        k => k !== 'default' && k !== '__esModule' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
      )
    } catch {
      // Package can't be loaded in Node (uses browser globals etc).
      // Try again with basic browser global shims.
      try {
        global.self = global
        global.window = global
        global.document = global.document || { createElement: () => ({}), addEventListener: () => {} }
        global.navigator = global.navigator || { userAgent: '' }
        // Clear require cache to retry with shims
        delete require.cache[require.resolve(pkgName)]
        const cjsModule = require(pkgName)
        exportKeys = Object.keys(cjsModule).filter(
          k => k !== 'default' && k !== '__esModule' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
        )
      } catch {
        // Still can't load — fall back to static analysis plus
        // extracting exports from packages referenced via __exportStar
        exportKeys = extractExportNames(content)

        // Also include exports from referenced ESM chunk files.
        // CJS barrels use `import { ... } from "./chunk.js"` then
        // `__exportStar(require_xxx(), exports)` to re-export sub-packages.
        // Scan all imported chunk files for their ESM exports.
        const chunkImportRe = /from "(\.\/([\w-]+)\.js)"/g
        let cim
        while ((cim = chunkImportRe.exec(content)) !== null) {
          const chunkPath = path.join(depsDir, cim[2] + '.js')
          if (!fs.existsSync(chunkPath)) continue
          const chunkContent = fs.readFileSync(chunkPath, 'utf-8')
          // Extract ESM export names from `export { A, B, C }`
          const esmExportRe = /export \{([^}]+)\}/g
          let em
          while ((em = esmExportRe.exec(chunkContent)) !== null) {
            for (const binding of em[1].split(',')) {
              const name = binding.trim().split(/\s+as\s+/).pop().trim()
              if (name && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) &&
                  name !== 'default' && name !== '__esModule') {
                exportKeys.push(name)
              }
            }
          }
          // Also extract from `export var ...` patterns
          extractExportNames(chunkContent).forEach(k => exportKeys.push(k))
        }
        // Deduplicate
        exportKeys = [...new Set(exportKeys)]
      }
    }

    // Filter out names that conflict with existing ESM-level declarations.
    // Only check import bindings and top-level var statements that are NOT
    // inside __commonJSMin wrappers (i.e., the few lines at the module boundary).
    const existingDecls = new Set()
    // Collect import bindings
    const importRe = /import\s*\{([^}]+)\}/g
    let dm
    while ((dm = importRe.exec(content)) !== null) {
      for (const binding of dm[1].split(',')) {
        const asMatch = binding.trim().match(/(?:\w+\s+as\s+)?(\w+)/)
        if (asMatch) existingDecls.add(asMatch[1])
      }
    }
    // Collect top-level var/function declarations outside CJS wrappers.
    // These are lines starting with "var " or "function " at column 0.
    const topDeclRe = /^(?:var|function)\s+([a-zA-Z_$]\w*)/gm
    while ((dm = topDeclRe.exec(content)) !== null) existingDecls.add(dm[1])
    // Also collect names already exported via `export { ... }` statements
    const existingExportRe = /export \{([^}]+)\}/g
    while ((dm = existingExportRe.exec(content)) !== null) {
      for (const binding of dm[1].split(',')) {
        // "require_Foo as bar" -> bar is the exported name
        const parts = binding.trim().split(/\s+as\s+/)
        const exportedName = parts[parts.length - 1].trim()
        if (exportedName) existingDecls.add(exportedName)
      }
    }

    // Filter out JS reserved words and existing declarations
    const reserved = new Set([
      'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete',
      'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof',
      'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
      'void', 'while', 'with', 'class', 'const', 'enum', 'export', 'extends',
      'import', 'super', 'implements', 'interface', 'let', 'package', 'private',
      'protected', 'public', 'static', 'yield', 'await', 'async', 'of'
    ])
    exportKeys = exportKeys.filter(k => !existingDecls.has(k) && !reserved.has(k))

    if (exportKeys.length === 0) continue

    // Replace `export default require_xxx();` with destructured named exports.
    // If CJS sets __esModule + exports.default, use .default as ESM default (esbuild compat).
    const fnName = match[1]
    const hasEsModuleDefault = (content.includes('exports.__esModule') || content.includes('"__esModule"')) &&
      !exportKeys.includes('default') && content.includes('exports.default')
    const defaultExpr = hasEsModuleDefault
      ? `__cjs_mod__.__esModule ? __cjs_mod__.default : __cjs_mod__`
      : `__cjs_mod__`
    const replacement = [
      `var __cjs_mod__ = ${fnName}();`,
      `export default ${defaultExpr};`,
      `export var ${exportKeys.map(k => `${k} = __cjs_mod__["${k}"]`).join(',\n  ')};`
    ].join('\n')

    const patched = content.replace(requireFn, replacement)
    if (patched !== content) {
      fs.writeFileSync(filePath, patched)
      count++
      console.log(`  Added ${exportKeys.length} named exports to ${file}`)
    }
  }
  return count
}

try {
  const files = fs.readdirSync(depsDir).filter(f => f.endsWith('.js'))

  const toesmCount = patchToESM(files)
  const namedCount = patchNamedExports(files)

  if (toesmCount + namedCount > 0) {
    console.log(`Patched ${toesmCount} chunk(s) for __toESM, ${namedCount} chunk(s) for named exports.`)

    // Update _metadata.json file hashes so Vite doesn't detect stale deps
    // and re-optimize on next start (which would overwrite our patches).
    const metadataPath = path.join(depsDir, '_metadata.json')
    try {
      const crypto = require('crypto')
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      const optimized = metadata.optimized || {}
      for (const [, entry] of Object.entries(optimized)) {
        if (entry.file) {
          const filePath = path.join(depsDir, '..', '..', entry.file)
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath)
            entry.fileHash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 8)
          }
        }
      }
      // Also update the chunks section if present
      const chunks = metadata.chunks || {}
      for (const [, entry] of Object.entries(chunks)) {
        if (entry.file) {
          const filePath = path.join(depsDir, '..', '..', entry.file)
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath)
            entry.fileHash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 8)
          }
        }
      }
      // Also update the browserHash so the v= query param changes,
      // busting the browser's HTTP cache for the patched dep files.
      const newBrowserHash = crypto.randomBytes(4).toString('hex')
      metadata.browserHash = newBrowserHash
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
      console.log(`Updated _metadata.json (browserHash: ${newBrowserHash}).`)
    } catch (e) {
      console.warn('Warning: could not update _metadata.json:', e.message)
    }
  } else {
    console.log('No dep chunks needed patching.')
  }
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('No .vite/deps directory found — deps will be optimized on first request.')
  } else {
    throw e
  }
}
