<script setup lang="ts">
    const emit = defineEmits<{
        (e: "click"): void;
    }>();
</script>

<template>
    <button type="submit" @click.prevent="emit('click')">
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
    button {
        font-size: 0.875rem;
        background-color: transparent;
        color: $primaryContainer;
        border: 1px solid $primaryContainer;
        width: fit-content;
        border-radius: 24px;
        font-weight: 500;
        padding: calc(0.35rem - 1px) calc(1.3rem - 1px);

        &:hover {
            cursor: pointer;
        }
    }
</style>
