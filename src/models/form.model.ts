import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Form extends mongoose.Document {
  @Prop()
  name: string;
  @Prop({ default: false })
  unique: boolean;
  @Prop()
  displayName: string;
  @Prop()
  totalSteps: number;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop()
  createdBy: string;
  @Prop()
  question: Object[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
