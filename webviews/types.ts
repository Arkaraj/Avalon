export type User = {
    _id: string;
    name: string;
    githubID: string;
    tasks: Array<Task>;
};

export type RoomDetail = {
    name: string | undefined;
    description: string | undefined;
};

export type Room = {
    _id:string;
    admin: Array<string | null>;
    name: string;
    description: string;
    code: string;
    members: Array<string | null>;
};
export type Task = {
    _id:string;
    user: string;
    text: string;
    completed: boolean;
    room: string;
};