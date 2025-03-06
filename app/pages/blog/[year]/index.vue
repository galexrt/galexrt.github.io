<script setup lang="ts">
const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first());
if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const route = useRoute();

const { data: posts } = await useAsyncData(route.path, () =>
    queryCollection('posts')
        .where('path', 'LIKE', route.path + '%')
        .order('date', 'DESC')
        .all(),
);

useSeoMeta({
    title: page.value.title,
    ogTitle: page.value.title,
    description: page.value.description,
    ogDescription: page.value.description,
});
</script>

<template>
    <UContainer>
        <UPageHeader
            v-bind="page"
            :title="`${page.title} - ${route.params.year}`"
            :links="[{ label: 'Back', color: 'neutral', to: '/blog', icon: 'i-ph-arrow-left', target: '_self' }]"
            class="py-[50px]"
        />

        <UPageBody>
            <UBlogPosts>
                <UBlogPost
                    v-for="(post, index) in posts"
                    :key="index"
                    :to="post.path"
                    :title="post.title"
                    :description="post.description"
                    :image="post.image"
                    :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
                    :authors="post.authors"
                    :badge="post.badge"
                    :orientation="index === 0 ? 'horizontal' : 'vertical'"
                    :class="[index === 0 && 'col-span-full']"
                    variant="naked"
                    :ui="{
                        description: 'line-clamp-2',
                    }"
                />
            </UBlogPosts>
        </UPageBody>
    </UContainer>
</template>
