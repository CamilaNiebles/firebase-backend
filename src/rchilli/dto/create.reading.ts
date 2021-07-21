import { IsNotEmpty, IsString } from 'class-validator';
import { RchilliResponse } from './rchilli.response';

export class CreateNewReading {
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  resumeParserData: RchilliResponse;
}
