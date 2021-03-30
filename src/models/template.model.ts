import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class FormTemplate extends mongoose.Document {
  @Prop()
  name: string;
  @Prop()
  displayName: string;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop()
  createdBy: string;
  @Prop()
  // eslint-disable-next-line @typescript-eslint/ban-types
  question: Object[];
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
