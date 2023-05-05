import { User } from "./User";

export interface NewPost {
    readonly title: string;
    readonly body: string;
    readonly image: File | null;
    readonly location: string | null;
}

export interface Post {
    readonly id: string;
    readonly title: string;
    readonly body: string;
    readonly author: User;
    readonly imageURL: string | null;
    readonly date: Date;
    likeAmount: number;
    didUserLike: boolean;
    readonly location: string | null;
}
