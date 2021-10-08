import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFile {
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  file: any;
}
