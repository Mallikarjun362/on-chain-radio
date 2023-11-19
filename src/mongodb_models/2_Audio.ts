import mongoose, { Document, Schema } from 'mongoose';

export interface IAudio extends Document {
    file_content: Buffer,
    description: string,
    created_at: Date,
    title: string,
    author: any,
}

export const audio_schema = new Schema<IAudio>({
    created_at: { type: Date, default: Date.now },
    file_content: { type: Buffer },
    description: { type: String },
    title: { type: String },
    author: {}
});

const audio_model = mongoose.models.Audio || mongoose.model<IAudio>('Audio', audio_schema);

export default audio_model;