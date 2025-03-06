const customElements = ['Center'];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    telemetry: false,

    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui-pro',
        '@nuxt/content',
        '@nuxt/fonts',
        '@vueuse/nuxt',
        'nuxt-site-config',
    ],

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' },
            ],
            meta: [{ name: 'darkreader-lock', content: '' }],
        },
    },

    css: ['~/assets/css/main.css'],

    icon: {
        collections: ['ph', 'lucide', 'mdi', 'simple-icons'

        ],
        serverBundle: 'local',
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

    compatibilityDate: '2024-07-11',

    future: {
        compatibilityVersion: 4,
    },

    nitro: {
        preset: 'cloudflare-pages-static',
    },

    content: {
        preview: {
            api: 'https://api.nuxt.studio',
        },
    },
});
