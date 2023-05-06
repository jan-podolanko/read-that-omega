import { Timestamp } from "firebase/firestore";

export interface UserEntity {
    readonly uid: string;
    readonly displayName: string;
    readonly photoURL: string;
    readonly admin: boolean;
}

export interface PostEntity {
    readonly subject: string;
    readonly uid: string;
    readonly title: string;
    readonly body: string;
    readonly timestamp: Timestamp;
    readonly likes: string[];
    readonly location: string | null;
}
