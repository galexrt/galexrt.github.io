<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
    error: NuxtError;
}>();

useHead({
    htmlAttrs: {
        lang: 'en',
    },
});

useSeoMeta({
    title: 'Page not found',
    description: 'We are sorry but this page could not be found.',
});

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'), {
    transform: (data) => data.find((item) => item.path === '/docs')?.children || [],
});
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
    server: false,
});
</script>

<template>
    <UApp>
        <AppHeader />

        <UError :error="error" />

        <AppFooter />

        <ClientOnly>
            <LazyUContentSearch :files="files" :navigation="navigation" />
        </ClientOnly>
    </UApp>
</template>
