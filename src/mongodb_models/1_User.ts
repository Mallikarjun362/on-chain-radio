import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    profile_picture: Buffer;
    wallet_address: string;
    nounce_message: string;
    public_key: string;
    username: string;
    email: string;
}

export const user_schema = new Schema<IUser>({
    wallet_address: { type: String, required: true, unique: true, index:true },
    public_key: { type: String, required: true, unique: true },
    profile_picture: { type: Buffer },
    nounce_message: { type: String },
    username: { type: String },
    email: { type: String },
});

const user_model = mongoose.models.User || mongoose.model<IUser>('User', user_schema);

export default user_model;