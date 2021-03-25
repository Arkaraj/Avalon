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