const customElements = ['Center'];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    telemetry: false,
    extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
    compatibilityDate: '2024-07-05',

    modules: [
        '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui',
        '@nuxt/fonts',
        '@nuxtjs/fontaine',
        '@nuxthq/studio',
        '@vueuse/nuxt',
        'nuxt-site-config',
    ],

    hooks: {
        // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
        'components:extend': (components) => {
            const globals = components.filter((c) => ['UButton', 'ImageGallery', 'ImageItem'].includes(c.pascalName));

            globals.forEach((c) => (c.global = true));
        },
    },

    ui: {
        icons: ['ph', 'simple-icons', 'mdi'],
        safelistColors: ['blue-violet'],
    },

    fonts: {
        families: [{ name: 'DM Sans', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], global: true }],
    },

    mdc: {
        highlight: {
            langs: [
                'bash',
                'c',
                'console',
                'csv',
                'dockerfile',
                'go',
                'html',
                'ini',
                'json',
                'mermaid',
                'php',
                'python',
                'shell',
                'sql',
                'xml',
                'yaml',
            ],
        },
    },

    vue: {
        compilerOptions: {
            isCustomElement: (tag) => customElements.includes(tag),
        },
    },

    colorMode: {
        disableTransition: true,
    },

    routeRules: {
        '/api/search.json': { prerender: true },
        '/post/**': { redirect: '/blog/**' },
        '/discord': { redirect: 'https://discord.gg/zFYb3KHg24' },
        '/youtube': { redirect: 'https://youtube.com/@galexrt' },
    },

    devtools: {
        enabled: true,
    },

    typescript: {
        strict: false,
    },

    future: {
        compatibilityVersion: 4,
    },

    nitro: {
        preset: 'cloudflare-pages-static',
    },
});
