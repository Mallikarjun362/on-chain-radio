'use server'
import { AudioRoomModel } from "@/mongodb_models";


// AUDIO ROOM DATABASE FUNCTIONS
export async function getAllActiveRooms(): Promise<Array<typeof AudioRoomModel>> {
    const rooms = (await AudioRoomModel.find({ is_active: true }).exec()).map((val, idx, arr) => ({ ...val._doc, _id: val._doc._id.toString() }))
    return rooms;
}

export async function setRoomActive(roomId: string) {
    const update = { is_active: true };
    const the_audio_room = await AudioRoomModel.findByIdAndUpdate(roomId, update)
    return true
}

export async function setRoomInactive(roomId: string) {
    const update = { is_active: false };
    const the_audio_room = await AudioRoomModel.findByIdAndUpdate(roomId, update)
    return true
}

export async function createRoom(title: string, wallet_address: string) {
    console.log("Function: Create Room");
    if (!wallet_address) {
        return false
    } else {
        const new_audio_room = new AudioRoomModel({ main_author_wallet_address: wallet_address, title });
        await new_audio_room.save();
        return new_audio_room._id?.toString();
    }
}

export async function getRoomsOfAnUser(wallet_address: string): Promise<Array<any>> {
    console.log("Function: Get Rooms of An User");
    const results = (await AudioRoomModel.find({ main_author_wallet_address: wallet_address })).map((val, idx, arr) => ({ ...val._doc, _id: val._doc._id.toString() }))
    return results;
}

export async function deleteRoom(roomId: string): Promise<any> {
    if (!roomId) throw Error("Room ID Required");
    await AudioRoomModel.findByIdAndDelete(roomId)
    return true
}