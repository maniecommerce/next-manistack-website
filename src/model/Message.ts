import {Schema, Document} from "mongoose"


export interface Message extends Document{
    content:string;
    createAt: Date
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
    }
})