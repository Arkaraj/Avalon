export type User = {
    _id: string;
    name: string;
    githubID: string;
    tasks: Array<string>;
};

export type RoomDetail = {
    name: string | undefined;
    description: string | undefined;
};

export type Room = {
    admin: Array<string | null>;
    name: string;
    description: string;
    code: string;
    members: Array<string | null>;
}