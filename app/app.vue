<script setup lang="ts">
useHead({
    htmlAttrs: {
        lang: 'en',
    },
});

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'));

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
    server: false,
});

useSeoMeta({
    titleTemplate: '%s - Galexrt',
    ogImage: '/social-card.png',
    twitterImage: '/social-card.png',
    twitterCard: 'summary_large_image',
});

const links = [
    {
        label: 'Docs',
        icon: 'i-lucide-book',
        to: '/docs/getting-started',
    },
    {
        label: 'Pricing',
        icon: 'i-lucide-credit-card',
        to: '/pricing',
    },
    {
        label: 'Blog',
        icon: 'i-lucide-pencil',
        to: '/blog',
    },
];

provide('navigation', navigation);
</script>

<template>
    <UApp>
        <NuxtLoadingIndicator
            color="linear-gradient(90deg, rgba(55,53,158,1) 0%, rgba(77,74,199,1) 35%, rgba(201,214,252,1) 100%)"
        />

        <UMain>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </UMain>

        <ClientOnly>
            <LazyUContentSearch
                :files="files"
                shortcut="meta_k"
                :navigation="navigation"
                :links="links"
                :fuse="{ resultLimit: 42 }"
            />
        </ClientOnly>
    </UApp>
</template>
