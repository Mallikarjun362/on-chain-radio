import mongoose, { Schema } from 'mongoose';

export interface IAudio {
    author_wallet_address: any,
    end_streaming_time: Date,
    collection_type: String,
    streaming_time: Date,
    description: string,
    artist_name: string,
    monitized: Boolean,
    ipfs_hash: String,
    title: string,
    user: any,
}


export const audio_schema = new Schema<IAudio>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipfs_hash: { type: String, unique: true, index: true },
    author_wallet_address: { type: String, required: true },
    end_streaming_time: { type: Date },
    collection_type: { type: String },
    streaming_time: { type: Date },
    description: { type: String },
    artist_name: { type: String },
    monitized: { type: Boolean },
    title: { type: String },
});

audio_schema.pre('save', async function (next) {
    const author_wallet_address = this.author_wallet_address;

    try {
        const the_user = await mongoose.model('User').findOne({ wallet_address: author_wallet_address });
        if (the_user) {
            this.user = the_user._id;
        } else {
            console.error(`User not found for wallet_address: ${author_wallet_address}`);
        }
        next();
    } catch (err: any) {
        next(err);
    }
})
audio_schema.set('toObject', {
    transform: function (doc, ret) {
        ret._id = ret._id.toString();
        return ret;
    },
});
audio_schema.methods.toJSON = null;
const audio_model = mongoose.models.Audio || mongoose.model<IAudio>('Audio', audio_schema);

export default audio_model;