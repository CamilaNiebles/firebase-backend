import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TasksTemplate extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true })
  displayUrl: string;
  @Prop({ required: true })
  createdBy: string;
  @Prop({ required: true })
  variables: object[];
  @Prop({ default: Date.now })
  createdDate: Date;
}

export const TaskTemplateSchema = SchemaFactory.createForClass(TasksTemplate);
