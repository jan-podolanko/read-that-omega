<script setup lang="ts">
import {getAuth} from "firebase/auth";
import {computed, onBeforeMount, reactive} from "vue";
import {usePostsStore} from "../../stores/posts";
import TextField from "../components/TextField.vue";
import {Post} from "../../model/Post";
import {useDateFormat} from "@vueuse/core";
import {useUserStore} from "../../stores/user";
import TextButton from "../components/TextButton.vue";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import PostSingular from "../components/PostSingular.vue";

const userStore = useUserStore();
const toast = useToast();

onBeforeMount(() => {
    postsStore.getUserPosts(userStore.userProfile!!.uid).then(posts => {
        console.log(posts);
        state.posts = posts;
    });
    userStore.getSubjects().then(subjects => {
        state.subjects = subjects;
    });
    userStore.getAllNicknames().then(nicknames => {
        state.nicknames = nicknames;
    });
    userStore.getUser(userStore.userProfile!!.uid).then(admin => {
        state.admin = admin;
    });
});
const postsStore = usePostsStore();


let isAdmin = false;

const state: {
    posts: Post[],
    subjects: Array<any> | any,
    nicknames: Array<any> | any,
    admin: Array<any> | any
} = reactive({
    posts: [],
    subjects: [],
    nicknames: [],
    admin: []
});

const auth = getAuth();
const user = auth.currentUser;
const router = useRouter();

const subjectAddition = reactive({subject: ""});
const changeUser = reactive({
    nickname: "",
    password: "",
});

const changePassword = reactive({
    newPassword0: "",
    newPassword1: "",
});


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

async function getSubjects() {
    try {
        const subjects = await userStore.getSubjects();
        return subjects;
    } catch (e) {
        console.log(e);
        return false;
    }
}

function errorHandler(message: String, duration: number = 200) {
    toast.error(message);
    navigator.vibrate(duration);
}

async function addSubject() {
    if (subjectAddition.subject.length == 0) {
        errorHandler("Subject cannot be empty");
        return;
    }
    for (let i = 0; i < state.subjects.length; i++) {
        if (state.subjects[i].subject == subjectAddition.subject) {
            errorHandler("Subject already added");
            return;
        }
    }
    try {
        userStore.addSubject(subjectAddition.subject).then(() => router.go(0));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteSubject(id: string) {
    try {
        userStore.deleteSubject(id).then(() => router.go(0));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const userPosts = computed(() => {
    return state.posts.filter(
        post => post.author.uid === user!!.uid
    );
});

async function deletePostHandler(post: Post) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        if (await postsStore.deletePost(post.id)) {
            router.go(0)
        }
    }
}

async function changeNickname() {
    if (changeUser.nickname.length == 0 || changeUser.password.length == 0) {
        errorHandler("Nickname and password cannot be empty")
        return;
    }
    if (changeUser.nickname.length < 3) {
        errorHandler("Nickname must be at least 3 characters long")
        return;
    }
    for (let i = 0; i < state.nicknames.length; i++) {
        if (state.nicknames[i].displayName == changeUser.nickname) {
            errorHandler("Nickname already in use")
            return;
        }
    }
    //@ts-ignore
    const isSuccess = await userStore.changeNickname(user?.uid, user?.email, changeUser.nickname, changeUser.password)

    if (isSuccess) {
        router.go(0);
        return true;
    }
    errorHandler("Wrong password!")
}

async function changePass() {
    if (changePassword.newPassword0.length == 0 || changePassword.newPassword1.length == 0) {
        errorHandler("All forms must be filled in!")
        return;
    }
    if (changePassword.newPassword0.length < 8) {
        errorHandler("New password must be at least 8 characters long!")
        return;
    }
    if (changePassword.newPassword0 != changePassword.newPassword1) {
        errorHandler("Passwords do not match!")
        return;
    }
    const isSuccess = await userStore.changePassword(changePassword.newPassword0)
    if (isSuccess) {
        errorHandler("Password changed!")
        return true;
    }
    errorHandler("Something wrong happend!")
}


</script>

<template>
    <main id="posts">
        <section class="profile-header">
            <img :src="`${user!!.photoURL}`"/><br/>
            <span>{{ user?.displayName }}</span
            ><br/>
            <span>{{ user?.email }}</span
            ><br/>
            <button @click="signOutHandler">sign out</button>
        </section>
        <section class="profile-header" v-if="state.admin.admin == true">
            <h1>Admin settings:</h1>
            <form action="#" @submit.prevent="addSubject">
                <TextField class="changeUser"
                           id="Subject"
                           placeholder="Add subject.."
                           maxlength="20"
                           v-model:value="subjectAddition.subject"
                />
                <TextButton>Add subject</TextButton>
            </form>
            <div v-for="subject in state.subjects">
                <div class="subject-name">
                    <div> {{ subject.subject }}</div>
                    <span class="material-icons" @click="deleteSubject(subject.id)">delete</span>
                </div>
            </div>
        </section>

        <section class="profile-header" v-if="user?.providerData[0].providerId == 'password'">
            <h1>Change nickname:</h1>
            <form action="#" @submit.prevent="changeNickname()">
                <TextField class="changeUser"
                           id="Subject"
                           placeholder="New nickname"
                           v-model:value="changeUser.nickname"
                />
                <TextField class="changeUser"
                           id="Subject"
                           placeholder="Password confirmation"
                           type="password"
                           v-model:value="changeUser.password"
                />
                <TextButton style="margin: 1rem;">Change nickname</TextButton>
            </form>
        </section>

        <section v-else class="profile-header">
            <span>Users logged in using Google account cannot change their nickname and password</span>
        </section>

        <section class="profile-header" v-if="user?.providerData[0].providerId == 'password'">
            <h1>Change password:</h1>
            <form action="#" @submit.prevent="changePass()">
                <TextField class="changeUser"
                           id="Subject"
                           placeholder="New password"
                           type="password"
                           v-model:value="changePassword.newPassword0"
                />
                <TextField class="changeUser"
                           id="Subject"
                           placeholder="Confirm new password"
                           type="password"
                           v-model:value="changePassword.newPassword1"
                />
                <TextButton style="margin: 1rem;">Change password</TextButton>
            </form>
        </section>

        <section class="post" v-for="post in userPosts">
            <PostSingular :post="post"/>
        </section>

    </main>
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

#posts {
  padding: 1rem 0.5rem 2rem 0.5rem;
  margin-top: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .post {
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

  .subject-header {
    display: flex;
    align-items: center;
    gap: 0.1rem;

    > span {
      font-size: 0.6rem;
      font-weight: 500;
      align-content: center;
    }
  }

  .changeUser {
    border-radius: 8px;
    box-shadow: 0 0 10px 5px rgba(black, 0.1);
    background-color: $surfaceVariant;
    padding: 0.5rem 0.7rem;
    margin-top: 10px;
    margin: 1rem;
  }

  .subject-name {
    border-radius: 8px;
    box-shadow: 0 0 10px 5px rgba(black, 0.1);
    background-color: $surfaceVariant;
    padding: 0.5rem 0.7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-top: 10px;

    > div {
      flex: 8;
    }

    > span {
      font-weight: 500;
      flex: 1;

      &:hover {
        cursor: pointer;
      }
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
    justify-content: center;

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

  .profile-header {
    background-color: $surfaceVariant;
    border: none;
    border-radius: 18px;
    padding: 1rem;
    text-align: center;

    > img {
      min-width: 64px;
      max-width: 64px;
      min-height: 64px;
      max-height: 64px;
      border-radius: 50%;
      display: inline-block;
    }

    > button {
      background-color: $surfaceVariant;
      box-shadow: 0 0 5px 5px rgba(black, 0.1);
      border-radius: inherit;
      align-items: center;
      gap: 1rem;
      padding: 0.4rem 1rem;
      margin-top: 0.5rem;
    }
  }
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

.like-button:hover {
  cursor: pointer;
}

button.delete-post-button {
  align-items: center;
}

form {
  padding-top: 1rem;
  border: 1px black;
}



</style>
