import mongoose, { Schema } from 'mongoose';

export interface UserType {
	email: string;
	name: string;
}

const UserSchema = new Schema<UserType>({
	email: { required: true, type: String, unique: true },
	name: { required: true, type: String },
});

export const User = mongoose.model<UserType>('User', UserSchema);
