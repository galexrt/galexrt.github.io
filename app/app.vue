<script setup lang="ts">
const colorMode = useColorMode();

const color = computed(() => (colorMode.value === 'dark' ? '#111827' : 'white'));

useHead({
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'theme-color', name: 'theme-color', content: color },
    ],
    link: [{ rel: 'icon', href: '/favicon.png' }],
    htmlAttrs: {
        lang: 'en',
    },
});

useSeoMeta({
    titleTemplate: '%s - Galexrt',
    ogImage: '/social-card.png',
    twitterImage: '/social-card.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <div>
        <NuxtLoadingIndicator color="linear-gradient(90deg, rgba(55,53,158,1) 0%, rgba(77,74,199,1) 35%, rgba(201,214,252,1) 100%)" />

        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>

        <UNotifications />
        <UModals />
    </div>
</template>
