import mongoose, {Schema, Document} from "mongoose"
import {Message,MessageSchema} from "./Message"



// Host Insterface whith type sefty
export interface Host extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
  referralCode: string;
  isAcceptingMessages: boolean;
  messages: Message[];
}


// Host Schema for mongodb
const HostSchema: Schema<Host> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  referralCode: {
    type: String,
    required: [true, 'referral code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});


// Check new data base creation and connect alreay data base
const HostModel =
  (mongoose.models.Host as mongoose.Model<Host>) ||
  mongoose.model<Host>('Host', HostSchema);

export default HostModel;