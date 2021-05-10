import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tasks extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  createdBy: string;
  @Prop({ required: true })
  variables: object[];
  @Prop({ default: Date.now })
  createdDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Tasks);
