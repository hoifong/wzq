import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string,
    password: string,
    level: number,
    createTime: Date,
    lastLoginTime: Date,
    pic: string,

    tokens: AuthToken[];
}

export interface AuthToken {
    accessToken: string,
    kind: string
}

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 10 },
    password: { type: String, required: true, minlength: 6, maxlength: 15},
    level: { type: Number, required: true, min: 0, default: 0 },
    createTime: { type: Date, required: true },
    lastLoginTime: { type: Date, required: false },
    pic: { type: String, required: false },
    tokens: Array
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;