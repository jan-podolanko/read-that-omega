<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
          title: String,
          body: String,
          date: Date,
          likeAmount: Number,
          didUserLike: Boolean,
          authorUsername: String,
          authorPhotoURL: String,
          imageURL: String, 
      }
  })

</script>

<template>
  <div class="post">
  <header class="post-header">
      <div>
          <span>{{ title }}</span> <br />
      </div>
      <time>
<!--         {{ useDateFormat(date, "D.MM.YY").value }}<br />@
          {{ useDateFormat(date, "HH:mm").value }} -->
          {{ date }}
      </time>
  </header>
  <div class="post-body">
      <p>{{ body }}</p>
  </div>
  <div v-if="imageURL !== null" class="post-image">
      <img :src="`${imageURL}`" />
  </div>
  <div class="post-actions">
      <span style="margin-bottom: 2px; margin-right: 3px">{{
          likeAmount
      }}</span>
      <span class="material-icons" @click="">{{
          didUserLike ? "favorite" : "favorite_outlined"
      }}</span>
      <div style="flex-grow: 1"></div>
      <span class="post-author-username">{{
          authorUsername
      }}</span>
      <img
          class="post-author-photo"
          :src="authorPhotoURL"
          alt=""
      />
  </div>
</div>
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
.post {
    border-radius: 8px;
    box-shadow: 0 0 10px 5px rgba(black, 0.1);
    background-color: $surfaceVariant;
    padding: 0.5rem 0.7rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 15px;
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
