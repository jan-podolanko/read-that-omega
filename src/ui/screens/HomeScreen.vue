<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref} from "vue";
import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useUserStore} from "../../stores/user";
import {getAuth} from "firebase/auth";

const postsStore = usePostsStore();
const userStore = useUserStore();
const state: { posts: Post[], subjects: Array<any> | null } = reactive({
    posts: [],
    subjects: [],
});
const filter = ref('');
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
}

const filteredPosts = computed(() => {
    return state.posts?.filter((post: { subject: String; }) => post.subject == filter.value)
})
</script>

<template>
    <main id="homescreen">
        <div id="posts">
            <header class="mainHeader">
                <h2> ReadThat</h2>
                <div id="icons">
                    <router-link to="settings">
                        <span class="material-icons">settings</span>
                    </router-link>
                    <router-link to="search">
                        <span class="material-icons">search</span>
                    </router-link>
                    <span class="material-icons" @click="signOutHandler">logout</span>
                    <router-link to="createpost">
                        <span class="material-icons">add_circle</span>
                    </router-link>
                </div>
            </header>
            <select v-model="filter" id="subject-filter">
                <option value="">Select a subject</option>
                <option v-for="subject in state.subjects">{{ subject.subject }}</option>
            </select>
            <section class="post" v-for="post in filteredPosts">
                <router-link :to="{ name: 'postid', params: { id: post.id } }">
                    <header class="post-header">
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
                    <div class="post-body">
                        <p>{{ post.body }}</p>
                    </div>
                    <div v-if="post.imageURL !== null" class="post-image">
                        <img alt="Post image" :src="`${post.imageURL}`"/>
                    </div>
                </router-link>
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
        </div>
        <div id="post">

        </div>
        <div id="comments">
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: row;

  > div {
    flex: 1 1 30%;
    height: 100vh;
    overflow-y: hidden;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    border-right: white solid;

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

    }
  }
    #comments {
        border-right: none;
    }

  ::-webkit-scrollbar {
    display: none;
  }
}

select{
    font-weight: bold;
    >option {
        font-weight: bold;
    }
}

.mainHeader {
  padding: 1rem 0.5rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;

  > div > span {
    overflow: auto;
  }
}

a {
  padding: 0.5rem;

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

#subject-filter {
  background-color: $surfaceVariant;
  border-radius: 6px;
  margin-top: 10px;
}
</style>
