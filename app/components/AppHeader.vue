<script setup lang="ts">
import type { NavItem } from '@nuxt/content';

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
            <div class="inline-flex items-center gap-2">
                <img src="/favicon.png" class="size-9" />

                Galexrt

                <UBadge label="Sysadmin Garden of Eden" variant="subtle" class="hidden sm:block" />
            </div>
        </template>

        <template #panel>
            <UNavigationTree :links="mapContentNavigation(navigation)" default-open />
        </template>
    </UHeader>
</template>
