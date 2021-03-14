/* eslint-disable @typescript-eslint/naming-convention */

import { model, Schema, Model, Document } from 'mongoose';

interface UserInterface extends Document {
    name: string;
}

const UserSchema = new Schema({
    name: { type: String, required: true },
});

const User: Model<UserInterface> = model('User', UserSchema);
export default User;