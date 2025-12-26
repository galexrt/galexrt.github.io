<script setup lang="ts">
const { data: page } = await useAsyncData('home', () => queryCollection('index').first());
if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

useSeoMeta({
    titleTemplate: '',
    title: page.value.title,
    ogTitle: page.value.title,
    description: page.value.description,
    ogDescription: page.value.description,
});
</script>

<template>
    <div v-if="page" class="relative">
        <UPageHero
            :title="page.hero.title"
            :description="page.hero.description"
            :links="page.hero.links"
            :ui="{ title: 'text-shadow-sm', description: 'text-shadow-sm text-gray-900 dark:text-white' }"
        >
            <template #top>
                <div
                    class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"
                />
            </template>

            <div
                class="landing-grid absolute inset-0 z-[-1] [mask-image:radial-gradient(80%_80%_at_top,#000_0_60%,rgba(0,0,0,0.9)_75%,transparent_95%)]"
            >
                <div class="absolute inset-0 bg-black/60 mix-blend-multiply" />
            </div>
        </UPageHero>

        <UPageSection
            v-for="(section, index) in page.sections"
            :key="index"
            :title="section.title"
            :description="section.description"
            :features="section.features"
        >
            <ImagePlaceholder />
        </UPageSection>

        <UPageSection v-if="page.features" :title="page.features.title" :description="page.features.description">
            <UPageGrid>
                <UPageCard v-for="(item, index) in page.features.items" :key="index" v-bind="item" spotlight />
            </UPageGrid>
        </UPageSection>


        <UPageSection :ui="{ container: 'py-8 sm:py-12 lg:py-12' }">
            <UPageCTA v-bind="page.cta" class="bg-gray-100/50 dark:bg-gray-800/50 overflow-hidden @container" variant="naked" />
        </UPageSection>
    </div>
</template>
