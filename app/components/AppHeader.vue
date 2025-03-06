<script setup lang="ts">
const items = [
    {
        label: 'Home',
        to: '/',
        icon: 'i-ph-house',
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
    <UHeader>
        <template #left>
            <ULink class="inline-flex items-center gap-2" to="/">
                <img src="/favicon.png" class="size-10" />

                <span class="text-xl font-semibold text-gray-900 dark:text-white">Galexrt</span>
                <UBadge label="Sysadmin Garden of Eden" variant="subtle" class="hidden sm:block" />
            </ULink>
        </template>

        <UNavigationMenu :items="items" variant="link" />

        <template #right>
            <UColorModeButton />
        </template>

        <template #body>
            <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
        </template>
    </UHeader>
</template>
