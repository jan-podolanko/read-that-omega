<script setup lang="ts">

import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useRouter} from "vue-router";
import {getAuth} from "firebase/auth";

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

const auth = getAuth();
const user = auth.currentUser;

const router = useRouter();

async function deletePostHandler(post: Post) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        if (await postsStore.deletePost(post.id)) {
            router.go(0)
        }
    }
}

defineProps(["post"])

defineEmits(["onPostClick"])

const postsStore = usePostsStore();
</script>

<template>
    <div class="post-middle-screen">
        <h2 class="post-title">{{ post.title }}</h2>
        <header class="post-header">
            <img
                    class="post-author-photo"
                    :src="post.author.photoURL"
                    alt=""
            />
            <div class="post-name-time">
                <span class="post-author-username">{{ post.author.displayName }}</span><br/>
                <div v-if="post.location !== null" class="location-header">
                    <span class="material-icons"> pin_drop </span>
                    <span>{{ post.location }}</span>
                </div>
                <time :datetime="post.date.toISOString()"
                >{{ useDateFormat(post.date, "D.MM.YY").value }}<br/>
                    {{ useDateFormat(post.date, "HH:mm").value }}
                </time>
            </div>
            <div class="post-actions">
                <span
                        v-if="post.author.displayName == user?.displayName"
                        class="material-icons delete-post-button"
                        @click="deletePostHandler(post)">delete
          </span>
                <div class="post-like">
                <span style="margin-bottom: 2px; margin-right: 3px">{{
                    post.likeAmount
                    }}</span>
                    <span class="material-icons like-button" :class="{liked:post.didUserLike}" @click="likePost(post)">
                        favorite
                        </span>
                </div>
            </div>
        </header>
        <div v-if="post.imageURL !== null" class="post-image">
            <img alt="Post image" :src="`${post.imageURL}`"/>
        </div>
        <div class="post-body">
            <p style="overflow-wrap: break-word;">{{ post.body }}</p>
        </div>
    </div>
</template>
<style scoped lang="scss">

.post-middle-screen {
  padding: 0 1rem 1rem 1rem;
}

.post-title {
  padding: 1rem 0.5rem 0;
  overflow-wrap: break-word;
}

.post-author-photo {
  border-radius: 20%;
}

.post-body {
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

  > .post-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
    align-content: flex-end;

    > .post-like {
      display: flex;
    }
  }
}

.material-icons:hover {
  cursor: pointer;
}

.liked {
  color: lighten($surface,30%);
}

.post-author-photo {
  margin: 0 0.5rem 1rem 0;
}

.post-name-time {
  align-self: self-start;
  flex: 1;
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

.delete-post-button {
  background-color: transparent;
  color: white;
  border: none;
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
}


</style>