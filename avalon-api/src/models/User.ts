/* eslint-disable @typescript-eslint/naming-convention */

import { model, Schema, Model, Document } from 'mongoose';

interface UserInterface extends Document {
    githubId: string | null,
    name: string;
}

const UserSchema = new Schema({
    githubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
});

const User: Model<UserInterface> = model('User', UserSchema);
export default User;