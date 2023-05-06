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
            <div class="post-body">
                <p>{{ post.body }}</p>
            </div>
            <div v-if="post.imageURL !== null" class="post-image">
                <img :src="`${post.imageURL}`" />
            </div>
            <div class="post-actions">
                <span style="margin-bottom: 2px; margin-right: 3px">{{
                    post.likeAmount
                }}</span>
                <span class="material-icons" @click="likePost(post)">{{
                    post.didUserLike ? "favorite" : "favorite_outlined"
                }}</span>
                <div style="flex-grow: 1"></div>
                <span class="post-author-username">{{
                    post.author.displayName
                }}</span>
                <img
                    class="post-author-photo"
                    :src="post.author.photoURL"
                    alt=""
                />
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
    a {
        background-color: $surfaceVariant;
        color: rgba($onSurfaceVariant, 0.7);
        border: none;
        border-radius: 24px;
        padding: 1rem;
        text-decoration: none;
        font-size: 0.8rem;

        &:hover {
            cursor: pointer;
        }
    }

    #posts {
        padding: 1rem 0.5rem 2rem 0.5rem;
        margin-top: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .post {
        border-radius: 8px;
        box-shadow: 0 0 10px 5px rgba(black, 0.1);
        background-color: $surfaceVariant;
        padding: 0.5rem 0.7rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        > span {
            font-size: 1.1rem;
            font-weight: 500;
            line-height: 1.4;
        }

        > time {
            font-size: 0.7rem;
            line-height: 1.2;
            opacity: 0.75;
            text-align: end;
            font-style: italic;
        }
    }

    .location-header {
        display: flex;
        align-items: center;
        gap: 0.1rem;

        > span {
            font-size: 0.6rem;
            font-weight: 500;
            align-content: center;
        }
    }

    .post-image {
        display: flex;
        width: fit-content;
        object-fit: cover;
    }
    .post-actions {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        .material-icons {
            font-size: 20px;
        }

        .post-author-username {
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .post-author-photo {
            min-width: 24px;
            max-width: 24px;
            min-height: 24px;
            max-height: 24px;
            border-radius: 50%;
        }
    }
</style>
