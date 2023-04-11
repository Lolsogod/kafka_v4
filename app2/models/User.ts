import { Schema, model} from 'mongoose';
//user model
export interface IUser {
    mail: String,
    login: String,
    password: String
}
const userSchema = new Schema<IUser>({
    mail: {type: String, required: true, unique: true},
    login: {type: String, required: true},
    password: {type: String, required: true}
})

export const User  = model<IUser>('user', userSchema);
