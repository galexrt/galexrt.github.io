<script lang="ts" setup>
defineProps<{
    src: string;
    alt?: string;
}>();

defineEmits<{ close: [boolean] }>();
</script>

<template>
    <UModal
        fullscreen
        :title="alt ?? 'Image Preview'"
        :close="{ onClick: () => $emit('close', false) }"
        :ui="{ body: 'flex items-center', content: 'bg-(--ui-bg)/5' }"
    >
        <template #body>
            <img :src="src" :alt="alt" class="min-w-full max-w-full" />
        </template>
    </UModal>
</template>
