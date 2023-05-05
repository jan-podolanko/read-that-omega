<script setup lang="ts">
    import BottomNavigation from "../components/BottomNavigation.vue";
    import { useRegisterSW } from "virtual:pwa-register/vue";
    import { useRouter } from "vue-router";

    useRegisterSW();
 
    const router = useRouter();

</script>

<template>
    <div id="app-container">
        <header>
            <img src="/favicon.ico" alt="" />
            <span>ReadThat</span>
        </header>
        <div id="screen">
            <router-view />
        </div>
        <BottomNavigation />
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
