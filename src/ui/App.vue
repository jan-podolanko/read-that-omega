<script setup lang="ts">
import BottomNavigation from "./components/BottomNavigation.vue";
import {useRouter} from "vue-router";
import {useUserStore} from "../stores/user";
import {watch} from "vue";

const router = useRouter();
const userStore = useUserStore();

watch(
    () => userStore.isUserSignedIn,
    isSignedIn => {
        if (!isSignedIn) {
            router.replace({name: "SignIn"});
        }
    }
);
</script>

<template>
    <div id="app-container" v-if="userStore.isUserSignedIn !== null">
        <div id="screen">
            <router-view/>
        </div>
        <!--        <BottomNavigation v-if="userStore.isUserSignedIn === true" />-->
    </div>
</template>

<style lang="scss">

a {
  text-decoration: none;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
  "Segoe UI Symbol";
  height: 100%;
  background: linear-gradient(to right, $surface, $gradientRight);
}

* {
  color: $onSurface;
}

#app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
