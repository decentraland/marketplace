import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [react(), basicSsl(), splitVendorChunkPlugin()],
    // Required because the CatalystClient tries to access it
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'process.env': {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VITE_REACT_APP_DCL_DEFAULT_ENV:
          envVariables.VITE_REACT_APP_DCL_DEFAULT_ENV,
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
      https: true,
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
            process: true
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
        plugins: [rollupNodePolyFill()]
      },
      sourcemap: true
    },
    ...(command === 'build' ? { base: envVariables.VITE_BASE_URL } : undefined)
  } as any
})
