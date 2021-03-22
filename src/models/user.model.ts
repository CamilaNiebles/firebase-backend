import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Schema()
export class User extends Document {
  @Prop({
    index: true,
    unique: true,
  })
  email: string;

  @Prop()
  name: string;

  @Prop()
  idUser: string;

  @Prop()
  roles: string[];

  @Prop()
  salt: string;

  @Prop()
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
