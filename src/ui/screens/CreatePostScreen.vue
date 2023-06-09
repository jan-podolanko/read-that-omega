<script setup lang="ts">
import OutlinedTextButton from "../components/OutlinedTextButton.vue";
import TextButton from "../components/TextButton.vue";
import TextField from "../components/TextField.vue";
import {reactive, computed, onBeforeMount} from "vue";
import {usePostsStore} from "../../stores/posts";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {useUserStore} from "../../stores/user";

const toast = useToast();
const router = useRouter();
const postStore = usePostsStore();
const userStore = useUserStore();

const post: {
    subject: string;
    title: string;
    body: string;
    image: File | null;
    location: string | null;
} = reactive({
    title: "",
    body: "",
    image: null,
    location: null,
    subject: ""
});

const state: { subjects: Array<any> | null } = reactive({
    subjects: [],
});

onBeforeMount(() => {
    userStore.getSubjects().then(subjects => {
        console.log(subjects);
        state.subjects = subjects;
    });
});

const imgURL = computed(() => {
    return post.image === null ? null : URL.createObjectURL(post.image);
});

function errorHandler(message: String, duration: number = 200) {
    toast.error(message);
    navigator.vibrate(duration);
}

async function createPost() {
    const title = post.title.trim();
    const body = post.body.trim();
    if (title.length == 0) {
        errorHandler("Title cannot be empty");
        return;
    }
    if (body.length == 0) {
        errorHandler("Body cannot be empty");
        return;
    }
    const isSuccess = await postStore.createPost({
        title,
        body,
        image: post.image,
        location: post.location,
        subject: post.subject
    });

    if (isSuccess) {
        await router.replace({name: "Home"});
    }
}

function addPhoto() {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.accept = "image/jpeg";
    input.oninput = () => {
        post.image = input.files!![0];
    };
    input.click();
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function addLocation() {
    navigator.geolocation.getCurrentPosition(showPosition, error);
}

async function showPosition() {
    const api_url =
        "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${{coords.latitude}}&longitude=${{coords.longitude}}&localityLanguage=en";
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data.city + ", " + data.countryCode);
    post.location = data.city + ", " + data.countryCode;
}

function error(err: any) {
    console.log(`(${err.code}): ${err.message}`);
}

function deletePhoto() {
    post.image = null;
}

function deleteLocation() {
    post.location = null;
}

function onCancel() {
    router.replace({name: "Home"});
}
</script>

<template>
    <main id="create">
        <div id="input-section">
            <h1>Create a new post</h1>

            <form action="#" @submit.prevent="createPost()">
                <select v-model="post.subject" id="subject-filter">
                    <option v-for="subject in state.subjects">{{ subject.subject }}</option>
                </select>
                <TextField
                        type="text"
                        placeholder="Title"
                        maxlength="100"
                        v-model:value="post.title"
                />
                <section id="post-body-container">
                <textarea
                        placeholder="Type what you are thinking about…"
                        v-model.trim="post.body"
                        maxlength="1200"
                ></textarea>
                    <div id="post-image-location-bar">
                        <section v-if="imgURL !== null">
                            <img id="post-image" :src="`${imgURL}`"/>
                            <span class="material-icons" @click="deletePhoto()"
                            >delete</span
                            >
                        </section>
                        <section v-if="post.location !== null">
                            <p>{{ post.location }}</p>
                            <span class="material-icons" @click="deleteLocation()"
                            >delete</span
                            >
                        </section>
                    </div>
                    <div id="post-body-actions">
                        <input
                                type="hidden"
                                accept="image/jpeg;image/png;image/x-png"
                        />
                        <span class="material-icons" @click="addPhoto()"
                        >photo_camera</span
                        >
                        <span class="material-icons" @click="addLocation()"
                        >map</span
                        >
                    </div>
                </section>
                <section id="button-row">
                    <div style="flex-grow: 1"></div>
                    <OutlinedTextButton @click="onCancel"
                    >Cancel
                    </OutlinedTextButton
                    >
                    <TextButton>Post</TextButton>
                </section>
            </form>
        </div>
        <div id="two-thirds-nothing">
            <h1 style="font-size: 2.5rem;">Read That Omega</h1>
            <div style="text-align: center;">Your place in virtual space</div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@media only screen and (max-width: 1000px) {
    #two-thirds-nothing {
        display: none;
    }
}


main {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  height: 100vh;

  > #input-section {
    flex: 1;
    border-right: white solid;
      height: 100%;
  }

  > #two-thirds-nothing {
    flex: 2;
  }
}

#input-section {
  padding: 0 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

}

h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 400;
  text-align: center;
}

#create {
  overflow-y: auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem 1rem;
}

textarea {
  background-color: transparent;
  border: none;
  width: 100%;
  height: 15rem;
  resize: none;
  padding: 0.7rem;

  &:focus {
    outline: none;
  }
}

#post-body-container {
  background-color: $surfaceVariant;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.9rem;
}

#post-image {
  max-height: 80px;
  max-width: 100%;
  border: solid 2px black;
}

#post-image-location-bar {
  display: flex;
  padding: 1rem;
  align-items: center;
  gap: 1rem;

  > section {
    display: flex;
  }
}

#post-body-actions {
  box-shadow: 0 0 5px 5px rgba(black, 0.1);
  border-radius: inherit;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem 1rem;
}

#button-row {
  display: flex;
  width: 100%;
  padding: 0 1rem;
  gap: 0.5rem;
  align-items: center;
}

#save-draft-button {
  color: #9ec6eb;
}

#subject-filter {
  background-color: $surfaceVariant;
  border-radius: 6px;
  margin-top: 10px;
}

span:hover {
  cursor: pointer;
}
</style>
