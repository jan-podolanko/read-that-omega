<script setup lang="ts">
    import TextField from './TextField.vue';
    import Button from './Button.vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter()

    import { reactive, computed } from 'vue';


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


    function addPhoto() {
        const input = document.createElement("input") as HTMLInputElement;
        input.type = "file";
        input.accept = "image/jpeg";
        input.oninput = () => {
            post.image = input.files!![0];
            console.log(input.files!![0])
        };
        input.click();
    }

    function deletePhoto() {
        post.image = null;
    }

    function onCancel() {
        router.replace({ name: "Home" });
    }
</script>


<template>
    <main id="create">
        <header>
            <h1>Add new post</h1>
            <h2 @click="onCancel">x</h2>
        </header>

        <form action="#" @submit.prevent="createPost()">
            <TextField
                type="text"
                placeholder="Post title"
                maxlength="100"
                v-model:value="post.title"
            />
            <div id="button-row">
            <div id="post-image-location-bar">
                    <section v-if="imgURL !== null">
                        <img id="post-image" :src="`${imgURL}`" />
                        <Button @click="deletePhoto()">Delete photo</Button>
                    </section>

                </div>
                <div id="post-body-actions">
                    <input
                        type="hidden"
                        accept="image/jpeg;image/png;image/x-png"
                    />
                    <Button v-if="imgURL == null" @click="addPhoto()">Add photo</Button>
                </div>
            </div>
            <section id="post-body-container">
                <textarea
                    placeholder="Type what you are thinking about…"
                    v-model.trim="post.body"
                    maxlength="400"
                ></textarea>
            </section>
            <section id="button-row">
                <div style="flex-grow: 1"></div>
                <Button>Post</Button>
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
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h1, h2 {
        font-size: 1.5rem;
        margin: 0;
    }
    h2 {
        color: red;
        padding: 0.5rem;
        cursor: pointer;
    }
    main {
                border-radius: 8px;
        box-shadow: 0 0 10px 5px rgba(black, 0.1);
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
    #post-body-actions {
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
</style>