<script setup lang="ts">
import {getAuth} from "firebase/auth";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {usePostsStore} from "../../stores/posts";
import {useRouter} from "vue-router";

const router = useRouter();
const postsStore = usePostsStore();
const auth = getAuth();
const user = auth.currentUser;

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
</script>

<template>
    <div class="jan">
        <header class="post-header" @click="$emit('onPostClick')">
            <div>
                <span style="word-break: break-all;">{{ post.title }}</span> <br/>
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
        <hr>
        <div class="post-body"
             style="display: -webkit-box; overflow: hidden; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">
            <p>{{ post.body }}</p>
        </div>
        <div v-if="post.imageURL !== null" class="post-image">
            <img alt="Post image" :src="`${post.imageURL}`"/>
        </div>
        <div class="post-actions">
          <span v-if="post.author.displayName == user?.displayName" class="material-icons delete-post-button"
                @click="deletePostHandler(post)">
            delete 
          </span>
            <span style="margin-bottom: 2px; margin-right: 3px">{{
                post.likeAmount
                }}</span>
            <span class="material-icons like-button" :class="{liked:post.didUserLike}" @click="likePost(post)">
                        favorite
                        </span>
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
    </div>
</template>

<style scoped lang="scss">

select {
  font-weight: bold;

  > option {
    font-weight: bold;
  }
}

a {
  padding: 0;

  &:hover {
    cursor: pointer;
  }
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

.post-title {
  text-overflow: ellipsis;
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
  padding-top: 0.5rem;

}

.liked {
  color: lighten($surface,30%);
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

.delete-post-button {
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
}

button.delete-post-button {
  align-items: center;
}

img {
  max-height: 50vh;
}
</style>