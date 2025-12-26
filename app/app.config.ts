export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blueviolet',
        },

        icons: {
            arrowLeft: 'mdi-arrow-left',
            arrowRight: 'mdi-arrow-right',
            check: 'mdi-check',
            chevronDoubleLeft: 'mdi-chevron-double-left',
            chevronDoubleRight: 'mdi-chevron-double-right',
            chevronDown: 'mdi-chevron-down',
            chevronLeft: 'mdi-chevron-left',
            chevronRight: 'mdi-chevron-right',
            chevronUp: 'mdi-chevron-up',
            close: 'mdi-close',
            ellipsis: 'mdi-dots-horizontal',
            external: 'mdi-arrow-top-right',
            file: 'mdi-file-document',
            folder: 'mdi-folder',
            folderOpen: 'mdi-folder-open',
            loading: 'mdi-loading',
            minus: 'mdi-minus',
            plus: 'mdi-plus',
            search: 'mdi-magnify',
            upload: 'mdi-upload',
            arrowUp: 'mdi-arrow-up',
            arrowDown: 'mdi-arrow-down',
            caution: 'mdi-alert-circle',
            copy: 'mdi-content-copy',
            copyCheck: 'mdi-check-circle-outline',
            dark: 'mdi-moon-waning-crescent',
            error: 'mdi-close-circle',
            eye: 'mdi-eye',
            eyeOff: 'mdi-eye-off',
            hash: 'mdi-pound',
            info: 'mdi-information',
            light: 'mdi-white-balance-sunny',
            menu: 'mdi-menu',
            panelClose: 'mdi-menu-close',
            panelOpen: 'mdi-menu-open',
            reload: 'mdi-reload',
            stop: 'mdi-stop',
            success: 'mdi-check-circle',
            system: 'mdi-monitor',
            tip: 'mdi-lightbulb-variant',
            warning: 'mdi-alert',
        },

        button: {
            slots: {
                base: 'rounded-full'
            },
            defaultVariants: {
                size: 'md',
            },
        },

        input: {
            defaultVariants: {
                size: 'md',
            },
        },

        card: {
            slots: {
                root: 'rounded-xl',
            },
        },

        footer: {
            slots: {

                top:  'border-t border-gray-200 dark:border-gray-800 py-8 lg:py-16',
                bottom: 'border-t border-gray-200 dark:border-gray-800',
            },
        },

        pageHero: {
            slots: {
                wrapper: 'lg:py-24',
            }
        },
    },
});
