<template>
    <NewPost></NewPost>
</template>

<script setup lang="ts">
    import NewPost from '../components/NewPost.vue'

    const posts = [{
          title:"Vite + Vue",
          body:"bla bla bla bla bla bla bla bla bla bla bla bla bla bla ",
          date:"04 07 60",
          likeAmount:10,
          didUserLike: true,
          authorUsername: "username",
          authorPhotoURL: "user photo",
          imageURL:"image url",
        }]

        console.log(posts)
</script>

<style lang="scss">

</style>
