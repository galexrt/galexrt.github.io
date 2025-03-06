export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blueviolet',
            gray: 'slate',
        },
        icons: {
            dynamic: true,
            dark: 'i-ph-moon-fill',
            light: 'i-ph-sun-fill',
            search: 'i-ph-magnifying-glass',
            external: 'i-ph-link',
            chevron: 'i-ph-caret-down',
            hash: 'i-ph-hash',
            menu: 'i-ph-list-bold',
            close: 'i-ph-x',
            check: 'i-ph-check-circle',
        },
        button: {
            rounded: 'rounded-full',
            default: {
                size: 'md',
            },
        },
        input: {
            default: {
                size: 'md',
            },
        },
        card: {
            rounded: 'rounded-xl',
        },
        footer: {
            top: {
                wrapper: 'border-t border-gray-200 dark:border-gray-800',
                container: 'py-8 lg:py-16',
            },
            bottom: {
                wrapper: 'border-t border-gray-200 dark:border-gray-800',
            },
        },
        page: {
            hero: {
                wrapper: 'lg:py-24',
            },
        },
    },
});
