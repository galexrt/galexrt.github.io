<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first());
if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

const title = post.value.title;
const description = post.value.description;

useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
});
</script>

<template>
    <UContainer v-if="post" :ui="{ padding: '!px-4', constrained: 'max-w-8xl' }">
        <UPageHeader :title="post.title" :description="post.description">
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
        </UPageHeader>

        <UPage>
            <UPageBody prose>
                <ContentRenderer v-if="post && post.body" :value="post" />
            </UPageBody>

            <template v-if="post.body && post.body.toc.links.length" #right>
                <UContentToc v-if="post.body && post.body.toc" :links="post.body.toc.links" highlight />
            </template>
        </UPage>
    </UContainer>
</template>
