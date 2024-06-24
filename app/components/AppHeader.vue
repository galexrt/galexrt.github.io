<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types';

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]));

const links = [
    {
        label: 'Home',
        to: '/',
        icon: 'i-ph-house'
    },
    {
        label: 'Docs',
        to: '/docs',
        icon: 'i-ph-files',
    },
    {
        label: 'Blog',
        to: '/blog',
        icon: 'i-ph-article-medium',
    },
];
</script>

<template>
    <UHeader :links="links">
        <template #logo>
            Galexrt
            <UBadge label="Sysadmin Garden of Eden" variant="subtle" class="mb-0.5" />
        </template>

        <template #panel>
            <UNavigationTree :links="mapContentNavigation(navigation)" default-open />
        </template>
    </UHeader>
</template>
