<script setup lang="ts">
import type { NavItem } from '@nuxt/content';

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]));

const links = computed(() => navigation.value.find((item) => item._path === '/blog')?.children ?? []);

const sortedLinks = computed(() => mapContentNavigation(links.value).reverse());
</script>

<template>
    <UContainer :ui="{ padding: '!px-4', constrained: 'max-w-8xl' }">
        <UPage>
            <template #left>
                <UAside>
                    <template #top>
                        <UContentSearchButton class="rounded-md" size="sm" />
                    </template>

                    <UNavigationTree :links="sortedLinks" />
                </UAside>
            </template>

            <NuxtPage />
        </UPage>
    </UContainer>
</template>
