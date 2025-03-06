<script lang="ts" setup>
const route = useRoute();

const { data: posts } = await useAsyncData(route.path, () => queryCollection('posts').order('date', 'DESC').all());

const cards = computed(() => {
    const result = new Map<number, number>();
    posts.value.forEach((val) => {
        const year = new Date(val.date).getFullYear();
        if (result.has(year)) {
            const count = result.get(year);
            result.set(year, count + 1);
            return;
        }

        result.set(year, 1);
    });

    return result.entries().map((r) => ({
        title: r[0].toString(),
        description: `Total Posts: ${r[1]}`,
        to: `/blog/${r[0]}`,
    }));
});
</script>

<template>
    <UDrawer>
        <UButton label="Year Selector" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-down" />

        <template #content>
            <div class="max-h-[200px] min-h-[200px] overflow-y-auto">
                <UPageGrid>
                    <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
                </UPageGrid>
            </div>
        </template>
    </UDrawer>
</template>
