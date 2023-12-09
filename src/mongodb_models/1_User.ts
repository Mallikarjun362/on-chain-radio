import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    profile_picture: Buffer;
    wallet_address: string;
    nounce_message: string;
    public_key: string;
    full_name: string;
}

export const user_schema = new Schema<IUser>({
    wallet_address: { type: String, required: true, unique: true, index: true },
    public_key: { type: String, required: true, unique: true },
    profile_picture: { type: Buffer },
    nounce_message: { type: String },
    full_name: { type: String, default: "" },
});

const user_model = mongoose.models.User || mongoose.model<IUser>('User', user_schema);

export default user_model;