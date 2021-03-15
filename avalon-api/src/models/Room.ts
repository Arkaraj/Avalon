/* eslint-disable @typescript-eslint/naming-convention */
import { model, Schema, Model, Document } from 'mongoose';
import { nanoid } from 'nanoid';

interface IRoom extends Document {
    Admin: string;
    name: string;
    code: string;

}

const RoomSchema: Schema = new Schema({
    Admin: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    code: { type: String, default: () => nanoid(6) },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default model<IRoom>('Room', RoomSchema);