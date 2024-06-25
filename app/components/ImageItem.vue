<script lang="ts" setup>
import ImageFull from './ImageFull.vue';

defineProps<{
    src: string;
    alt?: string;
}>();

const modal = useModal();
</script>

<template>
    <li class="relative w-full group inline-block">
        <img width="527" height="430" :src="src" :alt="alt"
            class="h-auto w-full max-h-[430px] rounded-md transition-all duration-200 border-image brightness-[.8] hover:brightness-100 will-change-[filter] object-cover" @click="modal.open(ImageFull, {
                src: src,
                alt: alt,
            })">
    </li>
</template>
