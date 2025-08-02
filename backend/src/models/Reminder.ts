import mongoose, { Document, Schema } from "mongoose";

export interface IReminder extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  time: Date;
  isSent: boolean;
}

const reminderSchema = new Schema<IReminder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  time: { type: Date, required: true },
  isSent: { type: Boolean, default: false }
});

export default mongoose.model<IReminder>("Reminder", reminderSchema);
