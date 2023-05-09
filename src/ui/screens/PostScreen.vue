<script setup lang="ts">
import {onBeforeMount, reactive, computed} from "vue";
import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useRouter} from "vue-router";
import TextButton from "../components/TextButton.vue";
import {useToast} from "vue-toastification";
import {Comment} from "../../model/Comment";
import PostSingular from "../components/PostSingular.vue";
import PostMiddleScreen from "../components/PostMiddleScreen.vue";

const postsStore = usePostsStore();
const toast = useToast();
const router = useRouter();

const state: { posts: Post[], comments: Comment[] } = reactive({
    posts: [],
    comments: [],
});

const comment: {
    body: string;
    id: string;
} = reactive({
    body: "",
    id: ""
});

onBeforeMount(() => {
    postsStore.getPosts().then(posts => {
        console.log(posts);
        state.posts = posts;
    });
    postsStore.getPostComments(props.id).then(comments => {
        console.log(comments);
        state.comments = comments;
    })
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

async function likeComment(comment: Comment) {
    if (comment.didUserLike) {
        if (await postsStore.dislikeComment(comment.id)) {
            comment.likeAmount--;
            comment.didUserLike = false;
        }
    } else {
        if (await postsStore.likeComment(comment.id)) {
            comment.likeAmount++;
            comment.didUserLike = true;
        }
    }
}


function errorHandler(message: String, duration: number = 200) {
    toast.error(message);
    navigator.vibrate(duration);
}

async function createComment() {
    const body = comment.body.trim();
    const postid = props.id
    if (body.length == 0) {
        errorHandler("Comment cannot be empty");
        return;
    }
    const isSuccess = await postsStore.createComment({
        postid,
        body,
    });

    if (isSuccess) {
        router.go(0);
    }

}

const props = defineProps(['id'])

const filteredPosts = computed(() => {
    return state.posts.filter(post => post.id === props.id);
});
</script>


<template>
    <main id="posts">
        <router-link to="/Home">
            <h2>ReadThat</h2>
        </router-link>
        <section class="post" v-for="post in filteredPosts" :key="post.id">
            <PostMiddleScreen :post="post"></PostMiddleScreen>
        </section>
        <form action="#" @submit.prevent="createComment()">
        <textarea
                placeholder="Add comment..."
                maxlength="400"
                v-model.trim="comment.body"
        ></textarea>
            <section class="button-row">
                <TextButton>Post</TextButton>
            </section>

        </form>
        <p>Comments:</p>

        <section class="post" v-for="comment in state.comments" :key="comment.id">
            <time :datetime="comment.date.toISOString()"
            >{{ useDateFormat(comment.date, "D.MM.YY").value }}<br/>
                {{ useDateFormat(comment.date, "HH:mm").value }}
            </time>


            <div class="post-body">
                <p>{{ comment.body }}</p>
            </div>


            <div class="post-actions">
                <span style="margin-bottom: 2px; margin-right: 3px">{{
                    comment.likeAmount
                    }}</span>
                <span class="material-icons like-button" :class="{liked:comment.didUserLike}" @click="likeComment(comment)">
                        favorite
                        </span>
                <div style="flex-grow: 1"></div>
                <span class="post-author-username">{{
                    comment.author.displayName
                    }}</span>
                <img
                        class="post-author-photo"
                        :src="comment.author.photoURL"
                        alt=""
                />
            </div>
        </section>

    </main>
</template>


<style scoped lang="scss">
textarea {
  background-color: $surfaceVariant;
  border: none;
  width: 100%;
  height: 10rem;
  resize: none;
  padding: 0.7rem;
  border: none;
  border-radius: 24px;

  &:focus {
    outline: none;
  }
}

#posts {
  padding: 0 0.5rem 2rem 1rem;
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

.liked {
    color: lighten($surface,30%);
}

.post-title {
  font-weight: bold;
  word-break: break-all;
}

.post-body {
  word-break: break-all;
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

.button-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

form {
  border-radius: 8px;
  box-shadow: 0 0 10px 5px rgba(black, 0.1);
  background-color: $surfaceVariant;
  padding: 0.5rem 0.7rem;
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  display: flex;
}


</style>
