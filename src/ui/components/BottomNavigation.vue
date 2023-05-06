<script setup lang="ts">
    import { computed } from "vue";
    import { useRouter } from "vue-router";

    const router = useRouter();
    type Route = "Home" | "Search" | "Profile";
    const currentScreen = computed<Route | null>(() => {
        const currentPath = router.currentRoute.value.path;
        if (currentPath.startsWith("/home")) {
            return "Home";
        } else if (currentPath.startsWith("/search")) {
            return "Search";
        } else if (currentPath.startsWith("/profile")) {
            return "Profile";
        } else {
            return null;
        }
    });
</script>

<template>
    <nav>
        <button
            :class="{ active: currentScreen === 'Home' }"
            @click="router.replace({ name: 'Home' })"
        >
            <span class="material-icons">forum</span>
            <span>Feed</span>
        </button>
        <button
            :class="{ active: currentScreen === 'Search' }"
            @click="router.replace({ name: 'Search' })"
        >
            <span class="material-icons">search</span>
            <span>Search</span>
        </button>
        <button
            :class="{ active: currentScreen === 'Profile' }"
            @click="router.replace({ name: 'Profile' })"
        >
            <span class="material-icons">account_circle</span>
            <span>Profile</span>
        </button>
    </nav>
</template>

<style scoped lang="scss">
    nav {
        width: 100%;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 1;
        box-shadow: 0 0 5px 1px rgba(black, 0.1);
    }

    button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        border: none;
        background-color: transparent;
        font-size: 0.7rem;

        &:hover {
            cursor: pointer;
        }

        .material-icons {
            font-size: 22px;
            padding: 0.13rem 0.8rem;
            border-radius: 12px;
            transition: all 300ms ease;
        }
    }

    button.active .material-icons {
        background-color: $primaryContainer;
        color: $onPrimaryContainer;
        opacity: 0.7;
    }
</style>
