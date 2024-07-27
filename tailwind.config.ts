import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', 'DM Sans fallback', ...fontFamily.sans],
            },
            colors: {
                // Based on #4d4ac7
                'blue-violet': {
                    50: '#eff3fe',
                    100: '#e1e9fe',
                    200: '#c9d6fc',
                    300: '#a9bbf8',
                    400: '#8696f3',
                    500: '#6973eb',
                    600: '#4e4dde',
                    700: '#4d4ac7',
                    800: '#37359e',
                    900: '#32347d',
                    950: '#1e1d49',
                },
            },
            maxWidth: {
                '8xl': '88rem',
            },
        },
    },
};
