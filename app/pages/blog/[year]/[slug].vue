<script setup lang="ts">
import { withoutTrailingSlash, joinURL } from 'ufo';
import type { BlogPost } from '~/types';

const route = useRoute();

const { data: post } = await useAsyncData(route.path, () => queryContent<BlogPost>(route.path).findOne());
if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

const { data: surround } = await useAsyncData(
    `${route.path}-surround`,
    () =>
        queryContent('/blog')
            .where({ _extension: 'md' })
            .without(['body', 'excerpt'])
            .sort({ date: -1 })
            .findSurround(withoutTrailingSlash(route.path)),
    { default: () => [] },
);

const title = post.value.head?.title || post.value.title;
const description = post.value.head?.description || post.value.description;

useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
});

if (post.value.image?.src) {
    const site = useSiteConfig();

    useSeoMeta({
        ogImage: joinURL(site.url, post.value.image.src),
        twitterImage: joinURL(site.url, post.value.image.src),
    });
}
</script>

<template>
    <UPage v-if="post">
        <UPageHeader :title="post.title" :description="post.description">
            <template #headline>
                <div class="flex flex-col gap-2">
                    <NuxtImg v-if="post.image?.src"
                        v-bind="typeof post.image === 'string' ? { src: post.image, alt: post.title } : { alt: post.title, ...post.image }" />

                    <div class="flex gap-1">
                        <UBadge v-if="post.badge" v-bind="post.badge" variant="subtle" />
                        <span v-if="post.badge" class="text-gray-500 dark:text-gray-400">&middot;</span>
                        <ULink :to="`/blog/${route.params.year ?? 2001}`">
                            <time class="text-gray-500 dark:text-gray-400">
                                {{
                                    new Date(post.date).toLocaleDateString('en', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                }}
                            </time>
                        </ULink>
                    </div>
                </div>
            </template>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <UButton v-for="(author, index) in post.authors" :key="index" :to="author.to" color="white"
                    target="_blank" size="sm">
                    <UAvatar v-bind="author.avatar" :alt="author.name" size="2xs" />

                    {{ author.name }}
                </UButton>
            </div>
        </UPageHeader>

        <UPageBody prose>
            <ContentRenderer v-if="post && post.body" :value="post" />

            <hr v-if="surround?.length" />

            <UContentSurround :surround="surround" class="print:hidden" />
        </UPageBody>

        <template #right>
            <UContentToc v-if="post.body && post.body.toc" :links="post.body.toc.links" class="print:hidden" />
        </template>
    </UPage>
</template>
