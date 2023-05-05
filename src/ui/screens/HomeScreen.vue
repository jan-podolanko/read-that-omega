<script setup lang="ts">
    import { onBeforeMount, reactive } from "vue";
    import { usePostsStore } from "../../stores/posts";
    import { Post } from "../../model/Post";
    import { useDateFormat } from "@vueuse/core";

    const postsStore = usePostsStore();

    const state: { posts: Post[] } = reactive({
        posts: [],
    });

    onBeforeMount(() => {
        postsStore.getPosts().then(posts => {
            console.log(posts);
            state.posts = posts;
        });
    });

    async function likePost(post: Post) {
        if (post.didUserLike) {
            if (await postsStore.dislikePost(post.id)) {
                post.likeAmount--;
                post.didUserLike = false;
            }
        } else {
            if (await postsStore.likePost(post.id)) {
                post.likeAmount++;
                post.didUserLike = true;
            }
        }
    }
</script>

<template>
    <router-link :to="{ name: 'CreatePost' }"
        >Type what you are thinking about…
    </router-link>
    <main id="posts">
        <section class="post" v-for="post in state.posts">
            <header class="post-header">
                <div>
                    <span>{{ post.title }}</span> <br />
                    <div v-if="post.location !== null" class="location-header">
                        <span class="material-icons"> pin_drop </span>
                        <span>{{ post.location }}</span>
                    </div>
                </div>
                <time :datetime="post.date.toISOString()"
                    >{{ useDateFormat(post.date, "D.MM.YY").value }}<br />@
                    {{ useDateFormat(post.date, "HH:mm").value }}
                </time>
            </header>
        </section>
    </main>
</template>

<style scoped lang="scss">
</style>