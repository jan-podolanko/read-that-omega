<script setup lang="ts">
    defineProps<{
        value: string
    }>();

    const emit = defineEmits<{
        (e: "update:value", value: string): void
    }>();

    function onValueChange(ev: Event) {
        const el = ev.target as HTMLInputElement;
        emit("update:value", el.value);
    }
</script>

<template>
    <input :value="value" @input="onValueChange" key="value" />
</template>

<style scoped lang="scss">
    input {
        border-radius: 12px;
        border: none;
        padding: 0.8rem 1rem;
        background-color: $surfaceVariant;
        pointer-events: all;

        &:focus {
            outline: $primary 1px solid;
        }
    }
</style>
