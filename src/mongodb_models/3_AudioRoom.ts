import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioRoom extends Document {
    main_author_wallet_address: any,
    description?: string,
    created_at?: Date,
    title?: string,
    is_active: boolean,
}

export const audio_schema = new Schema<IAudioRoom>({
    created_at: { type: Date, default: Date.now },
    main_author_wallet_address: { type: String, required: true, unique: false },
    is_active: { type: Boolean, default: false },
    description: { type: String },
    title: { type: String },
});

const audio_room_model = mongoose.models.AudioRoom || mongoose.model<IAudioRoom>('AudioRoom', audio_schema);

export default audio_room_model;