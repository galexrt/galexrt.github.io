<script setup lang="ts">
import type { BlogPost } from '~/types';

const { data: page } = await useAsyncData('blog', () => queryContent('/blog').findOne());
if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const route = useRoute();

const { data: posts } = await useAsyncData(`posts-${route.params.year}`, () =>
    queryContent<BlogPost>(`/blog/${route.params.year}/`).where({ _extension: 'md' }).sort({ date: -1 }).find(),
);

useSeoMeta({
    title: page.value.title,
    ogTitle: page.value.title,
    description: page.value.description,
    ogDescription: page.value.description,
});
</script>

<template>
    <UPage>
        <UPageHeader v-bind="page" :title="`${page.title} - ${route.params.year}`"
            :links="[{ label: 'Back', color: 'white', to: '/blog', icon: 'i-ph-arrow-left', target: '_self' }]" class="py-[50px]" />

        <UPageBody>
            <UBlogList>
                <UBlogPost v-for="(post, index) in posts" :key="index" :to="post._path" :title="post.title"
                    :description="post.description" :image="post.image"
                    :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
                    :authors="post.authors" :badge="post.badge" :orientation="index === 0 ? 'horizontal' : 'vertical'"
                    :class="[index === 0 && 'col-span-full']" :ui="{
                        description: 'line-clamp-2',
                    }" />
            </UBlogList>
        </UPageBody>
    </UPage>
</template>
