import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class FormTemplate extends mongoose.Document {
  @Prop({ required: true })
  name: string;
  @Prop({ default: false })
  unique: boolean;
  @Prop({ required: true })
  displayName: string;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop({ required: true })
  createdBy: string;
  @Prop()
  question: Object[];
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
