import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UploadZip {
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @IsNotEmpty()
  zip: Express.Multer.File;

  @IsArray()
  @IsNotEmpty()
  company: string[];
}
