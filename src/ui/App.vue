<script setup lang="ts">
    import BottomNavigation from "./components/BottomNavigation.vue";
    import { useRouter } from "vue-router";
    import { useUserStore } from "../stores/user";
    import { watch } from "vue";

    const router = useRouter();
    const userStore = useUserStore();

    watch(
        () => userStore.isUserSignedIn,
        isSignedIn => {
            if (!isSignedIn) {
                router.replace({ name: "SignIn" });
            }
        }
    );
</script>

<template>
    <div id="app-container" v-if="userStore.isUserSignedIn !== null">
        <header>
            <img src="/favicon.ico" alt="" />
            <span>ReadThat</span>
        </header>
        <div id="screen">
            <router-view />
        </div>
        <BottomNavigation v-if="userStore.isUserSignedIn === true" />
    </div>
</template>

<style lang="scss">
    #app {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        height: 100vh;
        background-color: $surface;
    }

    * {
        color: $onSurface;
    }

    #app-container {
        height: 100%;
        display: flex;
        flex-direction: column;

        > header {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem 1rem;

            > span {
                font-size: 1rem;
                letter-spacing: 2px;
                font-weight: 500;
                color: #aaaaaa;
            }

            > img {
                width: 25px;
            }
        }

        > #screen {
            flex-grow: 1;
            overflow: hidden;
            padding: 1rem;
            display: flex;
            flex-direction: column;
        }
    }
</style>
