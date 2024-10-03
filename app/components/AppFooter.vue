<script setup lang="ts">
const links = [
    {
        label: 'Resources',
        children: [
            {
                label: 'Docs',
                to: '/docs',
            },
            {
                label: 'Blog',
                to: '/blog'
            },
            {
                label: 'About',
                to: '/about'
            },
        ],
    },
    {
        label: 'Legal',
        children: [
            {
                label: 'Site Notice/ Imprint',
                to: '/site-notice',
            },
            {
                label: 'Privacy Policy',
                to: '/privacy-policy',
            },
        ],
    },
];
</script>

<template>
    <UFooter>
        <template #top>
            <UFooterColumns :links="links" class="print:hidden" />
        </template>

        <template #left>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Copyright © {{ new Date().getFullYear() }} Alexander Trost. All rights reserved.
            </p>
        </template>

        <template #right>
            <UColorModeButton class="print:hidden" size="sm" />

            <UButton
                class="print:hidden"
                to="https://github.com/galexrt"
                target="_blank"
                icon="i-simple-icons-github"
                aria-label="GitHub"
                color="gray"
                variant="ghost"
            />
        </template>
    </UFooter>
</template>
