/* eslint-disable @typescript-eslint/naming-convention */
import { model, Schema, Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';

interface IRoom extends Document {
    admin: Array<Types.ObjectId | null>;
    name: string;
    code: string;
    members: Array<Types.ObjectId | null>;
}

const RoomSchema: Schema = new Schema({
    admin: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    code: { type: String, default: () => nanoid(6) },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default model<IRoom>('Room', RoomSchema);