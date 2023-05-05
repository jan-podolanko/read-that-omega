import { Ref, ref } from "vue";
import { User } from "../model/User";
import { UserEntity } from "../firebase/entities";
import { defineStore } from "pinia";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseStore } from "./firebase";
import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";

export type AuthProvider = "google" | "github";

export const useUserStore = defineStore("user", () => {
    const firebaseStore = useFirebaseStore();
    const auth = firebaseStore.auth;
    const db = firebaseStore.db;

    const isUserSignedIn: Ref<boolean | null> = ref(null);
    const userProfile: Ref<User | null> = ref(null);
    auth.onAuthStateChanged(user => {
        isUserSignedIn.value = !!user;
        userProfile.value = user as User;
    });

    async function getUser(uid: string): Promise<User | null> {
        return getDoc(doc(db, "users", uid))
            .catch(e => {
                console.log(e);
                return null;
            })
            .then(snapshot => {
                if (snapshot == null) return null;
                return snapshot.data() as User;
            });
    }

    async function signUpWithEmail(
        email: string,
        nickname: string,
        password: string
    ): Promise<boolean> {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            ).then(cred => cred.user);
            await updateProfile(user, {
                displayName: nickname,
                photoURL:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png",
            });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: nickname,
                photoURL:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png",
            } as UserEntity);

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function signInWithEmail(
        email: string,
        password: string
    ): Promise<boolean> {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                email,
                password
            ).then(cred => cred.user);
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            } as UserEntity);

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async function signInWithProvider(
        provider: AuthProvider
    ): Promise<boolean> {
        let _provider: GithubAuthProvider | GoogleAuthProvider;
        switch (provider) {
            case "github":
                _provider = new GithubAuthProvider();
                break;
            case "google":
                _provider = new GoogleAuthProvider();
                break;
        }

        try {
            const user = await signInWithPopup(auth, _provider).then(
                cred => cred.user
            );
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            } as UserEntity);

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    return {
        getUser,
        isUserSignedIn,
        signInWithEmail,
        signInWithProvider,
        signUpWithEmail,
        userProfile,
    };
});
