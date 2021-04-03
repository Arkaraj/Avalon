/* eslint-disable @typescript-eslint/naming-convention */
import { model, Schema, Document, Types } from 'mongoose';

interface ITask extends Document {
    text: string | null;
    completed: boolean;
    room: Types.ObjectId | Record<string, unknown>;
    user: Types.ObjectId | Record<string, unknown>;
}

const TaskSchema: Schema = new Schema({
    text: { type: String },
    completed: { type: Boolean, default: false, required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default model<ITask>('Task', TaskSchema);