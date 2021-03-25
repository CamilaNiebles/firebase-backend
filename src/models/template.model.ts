import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FormTemplate extends Document {
  @Prop()
  name: string;
  @Prop()
  displayName: string;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop()
  createdBy: string;
  @Prop()
  question: Object[];
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
