import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        electron({
            // Main process entry point
            entry: 'src/background.ts',
            onstart(options) {
                options.startup();
            },
            vite: {
                build: {
                    outDir: 'dist-electron',
                    rollupOptions: {
                        external: [
                            'electron',
                            '@electron/remote',
                            '@electron/remote/main',
                            'electron-updater',
                            '@trodi/electron-splashscreen',
                        ],
                    },
                },
            },
        }),
        // Enable Node.js modules in renderer process (for nodeIntegration: true)
        renderer({
            // Keep these as native Node.js requires (not bundled)
            // etcd3 needs to load .proto files from disk at runtime
            resolve: {
                'etcd3': { type: 'cjs' },
                '@grpc/grpc-js': { type: 'cjs' },
                '@grpc/proto-loader': { type: 'cjs' },
                'protobufjs': { type: 'cjs' },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    optimizeDeps: {
        include: ['vuetify', 'vue', 'vue-router', 'vuex', 'vue-i18n'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },
    server: {
        port: 3000,
    },
});
