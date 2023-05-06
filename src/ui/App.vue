<script setup lang="ts">
import SignInScreen from './screens/SignInScreen.vue'
</script>

<template>
    <div id="app-container">
        <SignInScreen/>
    </div>
    <H1>Chuj do dupy</H1>
</template>

<style scoped lang="scss">
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
  background-image: linear-gradient(left, $gradientLeft, $gradientRight);
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
