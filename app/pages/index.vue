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
    <div v-if="page">
        <UPageHero :title="page.hero.title" :description="page.hero.description" :links="page.hero.links">
            <template #top>
                <div
                    class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"
                />
            </template>

            <div
                class="landing-grid absolute inset-0 z-[-1] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]"
            />
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

        <UPageCTA v-bind="page.cta" class="bg-gray-100/50 dark:bg-gray-800/50" />
    </div>
</template>

<style scoped>
.landing-grid {
    background-image: url('/images/grey-prism.svg');
    background-repeat: repeat;
    background-attachment: fixed;
}
</style>
