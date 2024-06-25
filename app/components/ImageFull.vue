<script lang="ts" setup>
defineProps<{
    src: string;
    alt?: string;
}>();
</script>

<template>
    <UModal>
        <img :src="src" :alt="alt">
    </UModal>
</template>
