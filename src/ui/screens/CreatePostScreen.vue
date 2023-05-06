<script setup lang="ts">
    import OutlinedTextButton from "../components/OutlinedTextButton.vue";
    import TextButton from "../components/TextButton.vue";
    import TextField from "../components/TextField.vue";
    import { reactive, computed } from "vue";
    import { usePostsStore } from "../../stores/posts";
    import { useRouter } from "vue-router";
    import { useToast } from "vue-toastification";

    const toast = useToast();
    const router = useRouter();
    const postStore = usePostsStore();

    const post: {
        title: string;
        body: string;
        image: File | null;
        location: string | null;
    } = reactive({
        title: "",
        body: "",
        image: null,
        location: null,
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
        });

        if (isSuccess) {
            await router.replace({ name: "Home" });
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
        router.replace({ name: "Home" });
    }
</script>

<template>
    <main id="create">
        <h1>Create a new post</h1>

        <form action="#" @submit.prevent="createPost()">
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
                    maxlength="400"
                ></textarea>
                <div id="post-image-location-bar">
                    <section v-if="imgURL !== null">
                        <img id="post-image" :src="`${imgURL}`" />
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
                    >Cancel</OutlinedTextButton
                >
                <TextButton>Post</TextButton>
            </section>
        </form>
    </main>
</template>

<style scoped lang="scss">
    h1 {
        padding: 0 1rem;
        font-size: 1.5rem;
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
</style>
