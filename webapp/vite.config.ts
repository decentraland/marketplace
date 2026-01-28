import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import react from '@vitejs/plugin-react-swc'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { defineConfig, UserConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
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
    resolve: {
      alias: {
        // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
        // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
        // process and buffer are excluded because already managed
        // by node-globals-polyfill
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        assert: 'rollup-plugin-node-polyfills/polyfills/assert'
      }
    },
    server: {
      open: true,
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/auth': {
          target: 'https://decentraland.org',
          // target: 'http://localhost:5174',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: false,
            process: false
          }),
          NodeModulesPolyfillPlugin()
        ]
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
        output: {
          manualChunks: (id: string) => {
            // Split large vendors into individual chunks to reduce memory usage
            if (id.includes('node_modules')) {
              if (id.includes('thirdweb')) return 'vendor-thirdweb'
              if (id.includes('@walletconnect')) return 'vendor-walletconnect'
              if (id.includes('ethers') || id.includes('viem')) return 'vendor-ethereum'
              if (id.includes('decentraland-ui')) return 'vendor-dcl-ui'
              if (id.includes('decentraland-dapps')) return 'vendor-dcl-dapps'
              if (id.includes('react')) return 'vendor-react'
              if (id.includes('lottie')) return 'vendor-lottie'
              if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui'
              if (id.includes('recharts')) return 'vendor-recharts'
              // Group remaining vendors together
              return 'vendor'
            }
          }
        }
      },
      // Disable sourcemaps in CI to reduce memory usage
      sourcemap: !process.env.CI
    },
    ...(command === 'build' ? { base: envVariables.VITE_BASE_URL } : undefined)
  } as unknown as UserConfig
})
