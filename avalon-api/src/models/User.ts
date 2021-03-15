/* eslint-disable @typescript-eslint/naming-convention */

import { model, Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
    githubId: string | null,
    name: string;
}

const UserSchema: Schema = new Schema({
    githubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
});

// const User: Model<UserInterface> = model('User', UserSchema);
export default model<UserInterface>('User', UserSchema);