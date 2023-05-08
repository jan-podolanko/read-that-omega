<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref} from "vue";
import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useUserStore} from "../../stores/user";
import {getAuth} from "firebase/auth";
import TextField from "../components/TextField.vue";
import {Comment} from "../../model/Comment";
import {useToast} from "vue-toastification";
import TextButton from "../components/TextButton.vue";

const postsStore = usePostsStore();
const userStore = useUserStore();
const toast = useToast();

const state: { posts: Post[], subjects: Array<any> | null, comments: Comment[] } = reactive({
    posts: [],
    subjects: [],
    comments: [],
});
const filter = ref('');
const search = ref(false);
const searchTerm = ref('');
let currentPost: Post = ref(null);

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
    userStore.getSubjects().then(subjects => {
        console.log(subjects);
        state.subjects = subjects;
    });
});


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
        }) => post.subject == filter.value).filter((post) => post.title.toLowerCase().includes(searchTerm.value))
    } else {
        return state.posts.filter((post) => post.title.toLowerCase().includes(searchTerm.value))
    }
});

function getComments(post: Post) {
    currentPost = post;
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

    /* if (isSuccess) {
        router.go(0);
    } */

}

function errorHandler(message: String, duration: number = 200) {
    toast.error(message);
    navigator.vibrate(duration);
}

</script>

<template>
    <main id="homescreen">
        <div id="posts">
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
                <header class="post-header" @click="getComments(post)">
                    <div>
                        <span>{{ post.title }}</span> <br/>
                        <div v-if="post.location !== null" class="location-header">
                            <span class="material-icons"> pin_drop </span>
                            <span>{{ post.location }}</span>
                        </div>
                    </div>
                    <time :datetime="post.date.toISOString()"
                    >{{ useDateFormat(post.date, "D.MM.YY").value }}<br/>
                        {{ useDateFormat(post.date, "HH:mm").value }}
                    </time>
                </header>
                <div class="post-body"
                     style="display: -webkit-box; overflow: hidden; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">
                    <p>{{ post.body }}</p>
                </div>
                <div v-if="post.imageURL !== null" class="post-image">
                    <img alt="Post image" :src="`${post.imageURL}`"/>
                </div>
                <div class="post-actions">
                <span style="margin-bottom: 2px; margin-right: 3px">{{
                    post.likeAmount
                    }}</span>
                    <span class="material-icons like-button" @click="likePost(post)">{{
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
        </div>

        <div id="post">
            <h2 style="text-align: center; margin-top: 10px;" v-if="!currentPost">Choose a post</h2>
            <div v-else>
                <div class="post selected-post">
                    <header class="post-header">
                        <div>
                            <span>{{ currentPost.title }}</span> <br/>
                            <div v-if="currentPost.location !== null" class="location-header">
                                <span class="material-icons"> pin_drop </span>
                                <span>{{ currentPost.location }}</span>
                            </div>
                        </div>
                        <time :datetime="currentPost.date.toISOString()"
                        >{{ useDateFormat(currentPost.date, "D.MM.YY").value }}<br/>
                            {{ useDateFormat(currentPost.date, "HH:mm").value }}
                        </time>
                    </header>
                    <div class="post-body">
                        <p>{{ currentPost.body }}</p>
                    </div>
                    <div v-if="currentPost.imageURL !== null" class="post-image">
                        <img alt="Post image" :src="`${currentPost.imageURL}`"/>
                    </div>
                    <div class="post-actions">
                <span style="margin-bottom: 2px; margin-right: 3px">{{
                    currentPost.likeAmount
                    }}</span>
                        <span class="material-icons like-button" @click="likePost(currentPost)">{{
                            currentPost.didUserLike ? "favorite" : "favorite_outlined"
                            }}</span>
                        <div style="flex-grow: 1"></div>
                        <span class="post-author-username">{{
                            currentPost.author.displayName
                            }}</span>
                        <img
                                class="post-author-photo"
                                :src="currentPost.author.photoURL"
                                alt=""
                        />
                    </div>
                </div>
            </div>
        </div>

        <div id="comments">
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
                    <span class="material-icons like-button" @click="likeComment(comment)">{{
                        comment.didUserLike ? "favorite" : "favorite_outlined"
                        }}</span>
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
        </div>
    </main>
</template>

<style scoped lang="scss">
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

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
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

  &:hover {
    cursor: pointer;
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
}

.selected-post {
  margin: 10px;
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
  display: flex;
}
</style>
