<script setup lang="ts">
    import TextButton from "../components/TextButton.vue";
    import TextField from "../components/TextField.vue";
    import { reactive, toRaw } from "vue";
    import { useRouter } from "vue-router";
    import { useUserStore } from "../../stores/user";

    const router = useRouter();
    const userStore = useUserStore();

    const credentials = reactive({
        email: "",
        nickname: "",
        password: "",
    });

    async function onSignUp() {
        const cred = toRaw(credentials);

        const emailRegex =
            /[a-z\d][a-z\d-_.]*[a-z\d]+@[a-z\d][a-z\d-_.]*[a-z\d]\.[a-z]{2,}/gi;
        if (!emailRegex.test(cred.email)) return;
        if (cred.nickname.length < 3) return;
        if (cred.password.length < 8) return;

        const isSuccess = await userStore.signUpWithEmail(
            cred.email,
            cred.nickname,
            cred.password
        );
        if (isSuccess) {
            await router.replace({ name: "Home" });
        }
    }
</script>

<template>
    <h1>Enter your credentials to sign in</h1>

    <section id="signup-form">
        <div>
            <form action="#" @submit.prevent="onSignUp">
                <label for="email">Email</label>
                <TextField
                    id="email"
                    type="email"
                    v-model:value="credentials.email"
                />

                <label for="nickname">Nickname</label>
                <TextField
                    id="nickname"
                    type="text"
                    v-model:value="credentials.nickname"
                />

                <label for="password">Password</label>
                <TextField
                    id="password"
                    type="password"
                    v-model:value="credentials.password"
                />

                <TextButton id="signup-button">Sign Up</TextButton>
            </form>
        </div>
    </section>

    <p id="signin-text">
        Already have an account?
        <router-link id="signin-link" :to="{ name: 'SignIn', replace: true }">
            Sign In
        </router-link>
    </p>
</template>

<style scoped lang="scss">
    * {
        font-size: 1.125rem;
    }

    h1 {
        padding: 0 1rem;
        font-size: 1.5rem;
        letter-spacing: 1px;
        font-weight: 400;
    }

    #signup-form {
        padding: 0 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    form {
        display: flex;
        flex-direction: column;

        > input:not(:last-of-type) {
            margin-bottom: 2rem;
        }

        > button {
            margin: 1.5rem 0 2rem 0;
        }
    }

    #signup-button {
        align-self: flex-end;
    }

    #signin-text {
        padding: 0 1rem;
        font-weight: 500;
        text-align: center;
        margin-bottom: 5rem;
    }

    #signin-link {
        color: $primary;
    }
</style>
