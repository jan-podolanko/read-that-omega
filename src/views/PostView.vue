
<script setup lang="ts">
import Post from '../components/Post.vue';

        const posts = [{
          title:"Vite + Vue",
          body:"bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          date:"04 07 60",
          likeAmount:10,
          didUserLike: true,
          authorUsername: "username",
          authorPhotoURL: "user photo",
          imageURL:"image url",
        },
        {
          title:"Vite + Vue",
          body:"bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          date:"04 07 60",
          likeAmount:10,
          didUserLike: true,
          authorUsername: "username",
          authorPhotoURL: "user photo",
          imageURL:"image url",
        }]
      
</script>

<template>
    <div v-for="post in posts">
        <Post v-bind="post" />
    </div>
 
</template>

<style scoped lang="scss">

</style>