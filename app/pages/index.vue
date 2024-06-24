<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne());
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
        <ULandingHero :title="page.hero.title" :description="page.hero.description" :links="page.hero.links">
            <div
                class="landing-grid absolute inset-0 z-[-1] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" />
        </ULandingHero>

        <ULandingSection v-if="page.placeholder" class="!pt-0">
            <ImagePlaceholder />
        </ULandingSection>

        <template v-if="page.sections && page.sections.length">
            <ULandingSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
                :description="section.description" :align="section.align" :features="section.features">
                <ImagePlaceholder />
            </ULandingSection>
        </template>

        <ULandingSection v-if="page.features" :title="page.features.title" :description="page.features.description">
            <UPageGrid>
                <ULandingCard v-for="(item, index) in page.features.items" :key="index" v-bind="item" />
            </UPageGrid>
        </ULandingSection>

        <ULandingSection v-if="page.testimonials" :headline="page.testimonials.headline"
            :title="page.testimonials.title" :description="page.testimonials.description">
            <UPageColumns class="xl:columns-4">
                <div v-for="(testimonial, index) in page.testimonials.items" :key="index" class="break-inside-avoid">
                    <ULandingTestimonial v-bind="testimonial" class="bg-gray-100/50 dark:bg-gray-800/50" />
                </div>
            </UPageColumns>
        </ULandingSection>

        <ULandingSection v-if="page.cta">
            <ULandingCTA v-bind="page.cta" class="bg-gray-100/50 dark:bg-gray-800/50" />
        </ULandingSection>
    </div>
</template>

<style scoped>
.landing-grid {
    background-image: url('/images/grey-prism.svg');
    background-repeat: repeat;
    background-attachment: fixed;
}
</style>
