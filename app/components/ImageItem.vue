<script lang="ts" setup>
import ImageFull from './ImageFull.vue';

const props = defineProps<{
    src: string;
    alt?: string;
}>();

const overlay = useOverlay();

async function openImage(): Promise<void> {
    const modal = overlay.create(ImageFull, {});
    await modal.open({
        src: props.src,
        alt: props.alt,
    });
}
</script>

<template>
    <li class="relative w-full group inline-block">
        <img
            :src="src"
            :alt="alt"
            width="527"
            height="430"
            class="h-auto w-full max-h-[430px] rounded-md transition-all duration-200 border-image brightness-[.8] hover:brightness-100 will-change-[filter] object-cover"
            @click="openImage()"
        />
    </li>
</template>
