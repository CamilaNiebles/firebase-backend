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
  @Prop()
  totalSteps: number;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop({ required: true })
  createdBy: string;
  @Prop({ required: true })
  question: [
    {
      question: {
        type: string;
      };
      name: {
        type: string;
      };
      resource: {
        type: string;
      };
      type: {
        type: string;
      };
      value: {
        type: string;
        default: null;
      };
      step: {
        type: string;
      };
      id: {
        type: string;
      };
      _id: false;
    },
  ];
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
