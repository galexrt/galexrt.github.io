<template>
    <div class="masonry-container sm:p-8">
        <ul class="grid grid-cols-1 gap-4 lg:block list-none ps-0">
            <slot />
        </ul>
    </div>
</template>

<style>
@media screen and (min-width: 1024px) {
    .masonry-container {
        column-count: 3;
        column-gap: 20px;
        column-fill: balance;
        margin: 10px auto 0;
    }

    .masonry-item {
        margin: 0 0 10px;
        -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
        break-inside: avoid;
    }
}
</style>
