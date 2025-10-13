<script setup lang="ts">
import { joinURL } from 'ufo';

const route = useRoute();

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first());
if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
    return queryCollectionItemSurroundings('posts', route.path, {
        fields: ['description'],
    });
});

const title = post.value.title;
const description = post.value.description;

useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
});

if (post.value.image) {
    const site = useSiteConfig();

    useSeoMeta({
        ogImage: joinURL(site.url, typeof post.value.image === 'string' ? post.value.image : post.value.image.src),
        twitterImage: joinURL(site.url, typeof post.value.image === 'string' ? post.value.image : post.value.image.src),
    });
}
</script>

<template>
    <div v-if="post">
        <UPageHero
            :title="post.title"
            :description="post.description"
            :ui="{ title: 'text-shadow-sm', description: 'text-shadow-sm text-gray-900 dark:text-white' }"
        >
            <template #top>
                <div
                    class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"
                />
            </template>

            <div
                class="absolute inset-0 z-[-1] overflow-hidden [mask-image:radial-gradient(ellipse_at_center,#fff_0_65%,rgba(255,255,255,0.9)_78%,transparent_85%)]"
            >
                <NuxtImg
                    v-if="post.image"
                    class="w-full h-full object-cover object-center"
                    v-bind="
                        typeof post.image === 'string'
                            ? { src: post.image, alt: post.title }
                            : { alt: post.title, ...post.image }
                    "
                />

                <div class="absolute inset-0 bg-black/60 mix-blend-multiply" />
            </div>

            <template #headline>
                <div class="inline-flex gap-1">
                    <UBadge v-if="post.badge" v-bind="post.badge" variant="subtle" />
                    <span v-if="post.badge">&middot;</span>
                    <ULink :to="`/blog/${route.params.year ?? 2001}`">
                        <UBadge>
                            <time>
                                {{
                                    new Date(post.date).toLocaleDateString('en', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                }}
                            </time>
                        </UBadge>
                    </ULink>
                </div>
            </template>

            <template #links>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <UButton
                        v-for="(author, index) in post.authors"
                        :key="index"
                        :to="author.to"
                        color="neutral"
                        target="_blank"
                        size="sm"
                    >
                        <UAvatar v-bind="author.avatar" :alt="author.name" size="2xs" />

                        {{ author.name }}
                    </UButton>
                </div>
            </template>
        </UPageHero>

        <UContainer>
            <UPage>
                <UPageBody>
                    <ContentRenderer v-if="post && post.body" :value="post" />

                    <USeparator v-if="surround?.length" />

                    <UContentSurround :surround="surround" class="print:hidden" />
                </UPageBody>

                <template #right>
                    <UContentToc
                        v-if="post.body && post.body.toc"
                        :links="post.body.toc.links"
                        highlight
                        class="print:hidden"
                    />
                </template>
            </UPage>
        </UContainer>
    </div>
</template>
