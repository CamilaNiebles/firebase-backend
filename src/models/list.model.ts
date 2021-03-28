import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class List extends Document {
  @Prop()
  name: string;
  @Prop()
  displayName: string;
  @Prop({ default: Date.now })
  createdDate: Date;
  @Prop()
  createdBy: string;
  @Prop()
  defaultType: string;
  @Prop()
  options: Object[];
}

export const ListSchema = SchemaFactory.createForClass(List);
