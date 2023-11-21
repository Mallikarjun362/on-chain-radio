import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioRoom extends Document {
    main_author_wallet_address: any,
    description?: string,
    is_active: boolean,
    created_at?: Date,
    title?: string,
}

export const audio_schema = new Schema<IAudioRoom>({
    main_author_wallet_address: { type: String, required: true, unique: false },
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: false },
    description: { type: String, default: "" },
    title: { type: String, default: "" },
});

const audio_room_model = mongoose.models.AudioRoom || mongoose.model<IAudioRoom>('AudioRoom', audio_schema);

export default audio_room_model;