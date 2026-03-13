import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        // '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/icon',
        '@vueuse/nuxt',
        'shadcn-nuxt',
    ],

    ssr: false,
    devtools: {
        enabled: true,
    },

    app: {
        baseURL: './',
        head: {
            viewport: 'width=device-width,initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            ],
            title: 'Oxidation Compiler Config Inspector',
        },
    },

    css: [
        '~/assets/css/main.css',
    ],
    compatibilityDate: '2026-03-09',

    vite: {
        plugins: [
            tailwindcss() as never,
        ],
    },

    nitro: {
        preset: 'static',
        output: {
            dir: './dist',
        },
        routeRules: {
            '/': {
                prerender: true,
            },
            '/200.html': {
                prerender: true,
            },
            '/404.html': {
                prerender: true,
            },
            '/*': {
                prerender: false,
            },
        },
        sourceMap: false,
    },

    shadcn: {
        prefix: '',
        componentDir: './app/components/ui',
    },
})
