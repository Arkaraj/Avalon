/* eslint-disable @typescript-eslint/naming-convention */

import { model, Schema, Document, Types } from 'mongoose';

export interface UserInterface extends Document {
    githubId: string | null;
    name: string | undefined;
    tasks: Array<Types.ObjectId | null>;
    rooms: Array<Types.ObjectId | null>;
    createdRooms: Array<Types.ObjectId | null>;
}

const UserSchema: Schema = new Schema({
    githubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    createdRooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }]
});

// const User: Model<UserInterface> = model('User', UserSchema);
export default model<UserInterface>('User', UserSchema);