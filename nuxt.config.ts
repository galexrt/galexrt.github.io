import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const customElements = ['Center'];

const contentRoot = join(process.cwd(), 'content');

function markdownFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            return markdownFiles(path);
        }

        return entry.name.endsWith('.md') ? [path] : [];
    });
}

function routeFromContentFile(file: string, root: string, prefix = ''): string {
    const path = relative(root, file).replace(/\\/g, '/').replace(/\.md$/, '');
    const route = path === 'index' ? '' : `/${path}`;

    return `${prefix}${route}` || '/';
}

const staticContentRoutes = [
    '/',
    '/blog',
    '/docs',
    ...readdirSync(join(contentRoot, '3.blog'), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/blog/${entry.name}`),
    ...markdownFiles(join(contentRoot, '1.docs')).map((file) =>
        routeFromContentFile(file, join(contentRoot, '1.docs'), '/docs'),
    ),
    ...markdownFiles(join(contentRoot, '3.blog')).map((file) =>
        routeFromContentFile(file, join(contentRoot, '3.blog'), '/blog'),
    ),
    ...markdownFiles(contentRoot)
        .filter((file) => relative(contentRoot, file).split(/[\\/]/).length === 1)
        .map((file) => routeFromContentFile(file, contentRoot).replace(/^\/\d+\./, '/')),
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    telemetry: false,
    ssr: true,

    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui',
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
        collections: ['lucide', 'mdi', 'ph', 'simple-icons', 'vscode-icons', 'twemoji'],
        clientBundle: {
            scan: true,
        },
        serverBundle: 'local',
        provider: 'iconify',
    },

    image: {
        provider: 'none',
    },

    ui: {
        theme: {
            colors: [
                'primary',
                'secondary',
                'success',
                'info',
                'warning',
                'error',
                // Custom colors
                'azureradiance',
                'blueviolet',
            ],
        }
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
                'proto',
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
        '/': { prerender: true },
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

    compatibilityDate: '2025-12-20',

    future: {
        compatibilityVersion: 4,
    },

    nitro: {
        preset: "github_pages",
        prerender: {
            routes: staticContentRoutes,
        },
    },
});
