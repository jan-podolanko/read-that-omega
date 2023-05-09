export interface User {
    readonly uid: string;
    readonly displayName: string;
    readonly photoURL: string;
    //@ts-ignore
    readonly admin: boolean;
}
