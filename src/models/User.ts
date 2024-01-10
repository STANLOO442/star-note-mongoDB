import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  password: string;
  hashPassword: () => Promise<void>;
}

const userSchema = new Schema<UserDocument>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.hashPassword = async function () {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
