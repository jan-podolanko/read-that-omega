<script setup lang="ts">

import {usePostsStore} from "../../stores/posts";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";


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

defineProps(["post"])

defineEmits(["onPostClick"])

const postsStore = usePostsStore();
</script>

<template>
    <div class="post selected-post">
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