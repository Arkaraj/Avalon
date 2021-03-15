/* eslint-disable @typescript-eslint/naming-convention */
import { model, Schema, Model, Document, Types } from 'mongoose';

interface ITask extends Document {
    text: string | null;
    completed: boolean;
    rooms: Types.ObjectId | Record<string, unknown>;
}

const TaskSchema: Schema = new Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    room: { type: Schema.Types.ObjectId, ref: 'Room' }
});

export default model<ITask>('Task', TaskSchema);