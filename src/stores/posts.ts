import { NewPost, Post } from "../model/Post";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    runTransaction,
    updateDoc,
    Timestamp,
    Query,
    where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { defineStore } from "pinia";
import { useFirebaseStore } from "./firebase";
import { useUserStore } from "./user";
import { PostEntity } from "../firebase/entities";
import { User } from "../model/User";

export const usePostsStore = defineStore("firestore", () => {
    const firebaseStore = useFirebaseStore();
    const userStore = useUserStore();
    const db = firebaseStore.db;
    const storage = firebaseStore.storage;

    const postsCollection = collection(db, "posts");

    async function createPost(post: NewPost): Promise<boolean> {
        const user = userStore.userProfile;
        if (user === null) return false;

        try {
            const postRef = await addDoc(postsCollection, {
                uid: user.uid,
                title: post.title,
                body: post.body,
                timestamp: Timestamp.now(),
                likes: [],
                location: post.location,
            } as PostEntity);

            if (post.image == null) return true;

            const imageRef = ref(storage, `postImages/${postRef.id}.jpeg`);
            await uploadBytes(imageRef, post.image);

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function getUserPosts(uid: string): Promise<Post[]> {
        const postsQuery = query(
            postsCollection,
            where("uid", "==", uid),
            orderBy("timestamp", "desc"),
            limit(10)
        );
        const postsQuerySnapshot = await getDocs(postsQuery);

        return Promise.all(
            postsQuerySnapshot.docs.map(postsSnapshot =>
                runTransaction(db, async tx => {
                    const postSnapshot = await tx.get(postsSnapshot.ref);
                    const post = postSnapshot.data() as PostEntity;
                    const user = await tx
                        .get(doc(db, "users", post.uid))
                        .then(userSnapshot => userSnapshot.data() as User);
                    let imageURL: string | null = null;
                    try {
                        const imageStorageURL = `postImages/${postSnapshot.id}.jpeg`;
                        const imageRef = ref(storage, imageStorageURL);
                        imageURL = await getDownloadURL(imageRef);
                    } catch (e) {
                        console.log(e);
                    }

                    return {
                        id: postSnapshot.id,
                        author: user,
                        title: post.title,
                        body: post.body,
                        date: new Date(post.timestamp.seconds * 1000),
                        likeAmount: post.likes.length,
                        didUserLike: post.likes.includes(
                            userStore.userProfile!!.uid
                        ),
                        imageURL,
                        location: post.location,
                    } as Post;
                })
            )
        );
    }

    async function getPosts(searchText?: string): Promise<Post[]> {
        let postsQuery: Query;
        if (searchText) {
            postsQuery = query(
                postsCollection,
                where("title", ">=", searchText),
                orderBy("title", "desc"),
                orderBy("timestamp", "asc"),
                limit(10)
            );
        } else {
            postsQuery = query(
                postsCollection,
                limit(10),
                orderBy("timestamp", "desc")
            );
        }
        const postsQuerySnapshot = await getDocs(postsQuery);

        return Promise.all(
            postsQuerySnapshot.docs.map(postsSnapshot =>
                runTransaction(db, async tx => {
                    const postSnapshot = await tx.get(postsSnapshot.ref);
                    const post = postSnapshot.data() as PostEntity;
                    const user = await tx
                        .get(doc(db, "users", post.uid))
                        .then(userSnapshot => userSnapshot.data() as User);
                    let imageURL: string | null = null;
                    try {
                        const imageStorageURL = `postImages/${postSnapshot.id}.jpeg`;
                        const imageRef = ref(storage, imageStorageURL);
                        imageURL = await getDownloadURL(imageRef);
                    } catch (e) {
                        console.log(e);
                    }

                    return {
                        id: postSnapshot.id,
                        author: user,
                        title: post.title,
                        body: post.body,
                        date: new Date(post.timestamp.seconds * 1000),
                        likeAmount: post.likes.length,
                        didUserLike: post.likes.includes(
                            userStore.userProfile!!.uid
                        ),
                        imageURL,
                        location: post.location,
                    } as Post;
                })
            )
        );
    }

    async function likePost(postID: string): Promise<boolean> {
        const postRef = doc(db, "posts", postID);
        const likes = arrayUnion(userStore.userProfile!!.uid);
        try {
            await updateDoc(postRef, "likes", likes);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async function dislikePost(postID: string): Promise<boolean> {
        const postRef = doc(db, "posts", postID);
        const likes = arrayRemove(userStore.userProfile!!.uid);
        try {
            await updateDoc(postRef, "likes", likes);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    return {
        createPost,
        getPosts,
        getUserPosts,
        likePost,
        dislikePost,
    };
});
