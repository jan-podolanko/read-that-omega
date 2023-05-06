import { User } from "./User";

export interface NewComment {
    readonly postid: string;
    readonly body: string;
}

export interface Comment {
    readonly id: string;
    readonly body: string;
    readonly author: User;
    readonly date: Date;
    likeAmount: number;
    didUserLike: boolean;
}


