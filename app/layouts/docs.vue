<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
import AppHeader from '~/components/AppHeader.vue';

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');
</script>

<template>
    <div>
        <AppHeader />

        <UMain>
            <UContainer class="max-w-[1800px]">
                <UPage :ui="{ root: 'lg:grid-cols-13', left: 'lg:col-span-4', center: 'lg:col-span-9', right: 'lg:col-span-3 order-first lg:order-last' }">
                    <template #left>
                        <UPageAside>
                            <template #top>
                                <UContentSearchButton label="Search..." variant="outline" class="w-full">
                                    <template #trailing>
                                        <div class="ms-auto flex items-center gap-0.5">
                                            <UKbd value="meta" />
                                            <UKbd value="k" />
                                        </div>
                                    </template>
                                </UContentSearchButton>
                            </template>

                            <UContentNavigation :navigation="navigation" highlight />
                        </UPageAside>
                    </template>

                    <slot />
                </UPage>
            </UContainer>
        </UMain>

        <AppFooter />
    </div>
</template>
