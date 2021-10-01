import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UploadZip {
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @IsNotEmpty()
  zip: any;

  @IsArray()
  @IsNotEmpty()
  company: string[];
}
