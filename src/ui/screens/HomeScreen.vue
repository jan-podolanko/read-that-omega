<script setup lang="ts">
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useUserStore} from "../../stores/user";
import {getAuth} from "firebase/auth";
import TextField from "../components/TextField.vue";
import {Comment} from "../../model/Comment";
import {useToast} from "vue-toastification";
import TextButton from "../components/TextButton.vue";
import PostSingular from "../components/PostSingular.vue";
import PostMiddleScreen from "../components/PostMiddleScreen.vue";
import {useRouter} from "vue-router";

const postsStore = usePostsStore();
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const state: { posts: Post[], subjects: Array<any> | null, comments: Comment[] } = reactive({
    posts: [],
    subjects: [],
    comments: [],
});
const filter = ref('');
const search = ref(false);
const searchTerm = ref('');
let currentPost: Post | any = ref(null);

const comment: {
    body: string;
    id: string;
} = reactive({
    body: "",
    id: ""
});

onBeforeMount(() => {

    postsStore.getPosts().then(posts => {
        state.posts = posts;
        if (props.id) {
            currentPost = state.posts.find(post => post.id == props.id);
        } else {
            currentPost = state.posts[0];
        }
    });
    userStore.getSubjects().then(subjects => {
        state.subjects = subjects;
    });
});

const props = defineProps({
    id: String,
})

const auth = getAuth();

function signOutHandler() {
    auth.signOut().then(() => {
    });
}


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
};

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
};

const filteredPosts = computed(() => {
    if (filter.value != "") {
        return state.posts?.filter((post: {
            subject: String;
        }) => post.subject == filter.value).filter((post) => post.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
    } else {
        return state.posts.filter((post) => post.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
    }
});

function getComments(post: Post) {
    currentPost = post;
    router.replace(post.id);
    console.log(post.id);
    postsStore.getPostComments(post.id).then((comments) => {
        state.comments = comments;
    })
};

async function createComment(post: Post) {
    const body = comment.body.trim();
    const postid = post.id
    if (body.length == 0) {
        errorHandler("Comment cannot be empty");
        return;
    }
    const isSuccess = await postsStore.createComment({
        postid,
        body,
    });

    if (isSuccess) {
        postsStore.getPostComments(post.id).then((comments) => {
            state.comments = comments;
            router.go(0)
        })
    }
}

function errorHandler(message: String, duration: number = 200) {
    toast.error(message);
    navigator.vibrate(duration);
}

</script>

<template>
    <main id="homescreen">
        <div id="posts">
            <div>
                <header class="main-header">
                    <h2>ReadThat</h2>
                    <div id="icons">
                    <span class="material-icons header-icons" id="search-button" style="flex: 2"
                          @click="()=>search = !search">search</span>
                        <router-link to="createpost" style="flex: 4">
                            <span class="material-icons header-icons">add_circle</span>
                        </router-link>
                        <router-link to="profile" style="flex: 1">
                            <span class="material-icons header-icons">manage_accounts</span>
                        </router-link>
                        <span class="material-icons header-icons" style="flex: 3" @click="signOutHandler">logout</span>
                    </div>
                </header>
                <TextField v-if="search" v-model:value="searchTerm" class="search-bar"></TextField>
                <select v-model="filter" id="subject-filter">
                    <option value="">All subjects</option>
                    <option v-for="subject in state.subjects">{{ subject.subject }}</option>
                </select>
            </div>
            <section class="post" v-for="post in filteredPosts">
                <PostSingular :post="post" @onPostClick="getComments(post)"/>
            </section>
        </div>

        <div id="post">
            <h2 style="text-align: center; margin-top: 10px;" v-if="!currentPost">Choose a post</h2>
            <div v-else>
                <PostMiddleScreen :post="currentPost" @onPostClick="getComments(currentPost)"/>
            </div>
        </div>

        <div id="comments">
            <h1 style="padding: 1rem;">Comments:</h1>
            <form v-if="currentPost" action="#" @submit.prevent="createComment(currentPost)">
                <input
                        placeholder="Add comment..."
                        maxlength="400"
                        v-model.trim="comment.body"
                >
                <section class="button-row">
                    <TextButton>Post</TextButton>
                </section>
            </form>

            <section class="post" v-for="comment in state.comments" :key="comment.id">
                <time :datetime="comment.date.toISOString()"
                >{{ useDateFormat(comment.date, "D.MM.YY").value }}<br/>@
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
        </div>
    </main>

    <main id="mobilescreen">
        <div id="postsMobile">
            <header class="main-header">
                <h2>ReadThat</h2>
                <div id="icons">
                    <span class="material-icons header-icons" id="search-button" style="flex: 2"
                          @click="()=>search = !search">search</span>
                    <router-link to="createpost" style="flex: 4">
                        <span class="material-icons header-icons">add_circle</span>
                    </router-link>
                    <router-link to="profile" style="flex: 1">
                        <span class="material-icons header-icons">manage_accounts</span>
                    </router-link>
                    <span class="material-icons header-icons" style="flex: 3" @click="signOutHandler">logout</span>
                </div>
            </header>
            <TextField v-if="search" v-model:value="searchTerm"></TextField>
            <select v-model="filter" id="subject-filter">
                <option value="">All subjects</option>
                <option v-for="subject in state.subjects">{{ subject.subject }}</option>
            </select>
            <section class="post" v-for="post in filteredPosts">
                    <PostSingular :post="post" @onPostClick="router.push('/post/'+ post.id)" />
            </section>
        </div>
    </main>


</template>

<style scoped lang="scss">

@media only screen and (max-width: 1000px) {
  #homescreen {
    display: none;
  }
}

@media only screen and (min-width: 1000px) {
  #mobilescreen {
    display: none;
  }
}

.search-bar{
    background-color: $surfaceVariant;
    width: 100%;
}

form {
  border-radius: 8px;
  box-shadow: 0 0 10px 5px rgba(black, 0.1);
  background-color: $surfaceVariant;
  padding: 0.5rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-wrap: break-word;
  margin: 10px;
  display: flex;
}

.button-row {
  text-align: right;
}

main {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 100vh;

  > div {
    flex: 1 1 30%;
    height: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    border-right: white solid;

    > header {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      flex-direction: row;
    }
  }

  #comments {
    border-right: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
}

.header-icons {
  flex-direction: row;
  font-size: 2rem;
  letter-spacing: 2px;
  font-weight: 500;
  color: #aaaaaa;

  &:hover {
    cursor: pointer
  }
}

.liked {
    color: lighten($surface,30%);
}

select {
  font-weight: bold;

  > option {
    font-weight: bold;
  }
}

.main-header {
  padding: 1rem 0.5rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;

  > div > span {
    overflow: auto;
  }

  #search-button:hover {
    cursor: pointer;
  }
}

a {
  padding: 0;

  &:hover {
    cursor: pointer;
  }
}

#posts {
  padding: 0 0.5rem 2rem 0.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

#postsMobile {
  padding: 0 0.5rem 2rem 0.5rem;
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
  overflow-wrap: break-word;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 0.3rem;

  .material-icons {
    font-size: 20px;
  }

  .like-button:hover {
    cursor: pointer
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

#subject-filter {
  background-color: $surfaceVariant;
  border-radius: 6px;
  margin-top: 10px;
  width: 100%;
}

#comments > section {
  margin: 10px;
}

form > input {
  margin: 10px;
  border-radius: 12px;
  border: none;
  padding: 0.8rem 1rem;
  background-color: $surfaceVariant;
  pointer-events: all;
  display: flex;

  &:focus {
    outline: $primary 1px solid;
  }
}

form > section > button {
  margin: 10px;
}
</style>
