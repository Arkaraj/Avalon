/* eslint-disable @typescript-eslint/naming-convention */
import { model, Schema, Model, Document } from 'mongoose';

interface ITask extends Document {
    text: string | null,
    completed: boolean;
}

const TaskSchema: Schema = new Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
});

export default model<ITask>('Task', TaskSchema);