import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RchilliResponse } from '../rchilli/dto/rchilli.response';

@Schema()
export class RChilli extends Document {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  fileUrl: string;

  @Prop()
  resumeParserData: RchilliResponse;
}

export const RChilliSchema = SchemaFactory.createForClass(RChilli);
