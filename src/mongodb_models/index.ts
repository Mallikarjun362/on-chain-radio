'server only'
import mongoose from "mongoose";
import user_model from "./1_User";
import audio_model from "./2_Audio";
import audio_room_model from "./3_AudioRoom";
import { MONGODB_URI } from "@/utils/3_Constants";
if(!(global as any)._mongooseConnection){
    mongoose.connect(MONGODB_URI, {}).then(() => {
        (global as any)._mongooseConnection = mongoose.connection;
        console.log("Mongo Connection Successful")
        mongoose.connection.on('error', err => {
            console.error(err);
        });
        mongoose.connection.on('disconnected', err => {
            console.log("Mongoose Disconnected",err);
        });
    });
}

export const UserModel = user_model;
export const AudioModel = audio_model;
export const AudioRoomModel = audio_room_model;