'use server'
import { AudioModel, AudioRoomModel } from "@/mongodb_models";

export async function uploadAudio({
    author_wallet_address,
    end_streaming_time,
    collection_type,
    streaming_time,
    description,
    artist_name,
    monitized,
    ipfs_hash,
    title,
}: any): Promise<boolean> {
    try {

        const new_audio = new AudioModel({
            end_streaming_time: new Date(end_streaming_time),
            streaming_time: new Date(streaming_time),
            author_wallet_address,
            collection_type,
            description,
            artist_name,
            monitized,
            ipfs_hash,
            title,
        });
        await new_audio.save();
        return JSON.parse(JSON.stringify(new_audio._doc));
    } catch (e) {
        console.log("Saving audio error", e);
        return false
    }
}

export async function changeToMonetized({ ipfs_hash }: any): Promise<boolean> {
    await AudioModel.findOneAndUpdate({ ipfs_hash }, { monitized: true }).exec()
    return true;
}

export async function fetchAllPostStreamingData() {
    // POST
    const results = await AudioModel.find({
        streaming_time: {
            $gt: Date.now(),
        }
    }).exec();
    return JSON.parse(JSON.stringify(results.map(doc => doc._doc)));
}

export async function fetchAllCurrentStreamingData() {
    // CURRENT
    const results = await AudioModel.find({
        streaming_time: {
            $lt: Date.now(),
        },
        end_streaming_time: {
            $gt: Date.now(),
        }
    }).exec();
    return JSON.parse(JSON.stringify(results.map(doc => doc._doc)));
}

export async function fetchAllStreamedData() {
    // PAST
    const results = await AudioModel.find({
        end_streaming_time: {
            $lt: Date.now(),
        }
    }).populate('user').exec();
    return JSON.parse(JSON.stringify(results.map(doc => doc._doc)));
}

// ----------------------------- <AUDIO-ROOM> DATABASE FUNCTIONS -----------------------------
export async function getAllActiveRooms(): Promise<Array<typeof AudioRoomModel>> {
    const results = (await AudioRoomModel.find({ is_active: true }).exec())
    return JSON.parse(JSON.stringify(results));
}

export async function setRoomActive(roomId: string) {
    const the_audio_room = await AudioRoomModel.findByIdAndUpdate(roomId, { is_active: true })
    return true
}

export async function setRoomInactive(roomId: string) {
    const the_audio_room = await AudioRoomModel.findByIdAndUpdate(roomId, { is_active: false })
    return true
}

export async function createRoom(title: string, wallet_address: string, description: string = "") {
    console.log("Function: Create Room");
    if (!wallet_address) {
        return false
    } else {
        const new_audio_room = new AudioRoomModel({ main_author_wallet_address: wallet_address, title, description });
        await new_audio_room.save();
        return new_audio_room._id?.toString();
    }
}

export async function getRoomDetailsById(roomId: string) {
    console.log("Get Room Details by ID")
    const result = await AudioRoomModel.findById(roomId).select('main_author_wallet_address description title').exec();
    return JSON.parse(JSON.stringify(result));
}

export async function getRoomsOfAnUser(wallet_address: string): Promise<Array<any>> {
    console.log("Function: Get Rooms of An User");
    const results = (await AudioRoomModel.find({ main_author_wallet_address: wallet_address }));
    return JSON.parse(JSON.stringify(results));
}

export async function deleteRoomById(roomId: string): Promise<any> {
    if (!roomId) throw Error("Room ID Required");
    await AudioRoomModel.findByIdAndDelete(roomId)
    return true
}