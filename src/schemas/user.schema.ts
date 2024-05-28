import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ id: false })
class Verification {
  @Prop({
    default: false,
    type: Boolean,
  })
  is_verified: boolean;

  @Prop({
    type: Number,
    default: null,
  })
  token: number;

  @Prop({
    default: null,
  })
  expiry: number;
}

@Schema({ id: false })
class PasswordUpdate {
  @Prop({
    type: String,
  })
  token: string;

  @Prop({
    type: Number,
  })
  expiry: number;

  @Prop({
    type: Number,
  })
  password_updated_at: number;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    nullable: false,
    type: String,
  })
  first_name: string;

  @Prop({
    nullable: false,
    type: String,
  })
  last_name: string;

  @Prop({
    nullable: false,
    type: String,
  })
  country: string;

  @Prop({
    nullable: false,
    type: String,
  })
  city: string;

  @Prop({
    nullable: false,
    type: String,
  })
  email: string;

  @Prop({
    nullable: false,
    type: String,
  })
  phone_no: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_profile_completed: boolean;

  @Prop({
    nullable: false,
    type: String,
  })
  password: string;

  @Prop({
    nulflable: false,
    default: '',
    type: String,
  })
  address: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isLoggedIn: boolean;

  @Prop({
    nullable: false,
  })
  verification: Verification;

  @Prop({
    nullable: true,
  })
  passwordUpdate: PasswordUpdate;

  @Prop({
    nullable: true,
  })
  dob: String;

}
export const UserSchema = SchemaFactory.createForClass(User);
