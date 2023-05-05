import { Timestamp } from "firebase/firestore";

export interface UserEntity {
    readonly uid: string;
    readonly displayName: string;
    readonly photoURL: string;
}

export interface PostEntity {
    readonly uid: string;
    readonly title: string;
    readonly body: string;
    readonly timestamp: Timestamp;
    readonly likes: string[];
    readonly location: string | null;
}
