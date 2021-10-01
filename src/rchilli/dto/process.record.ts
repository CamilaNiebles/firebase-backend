import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProcessedRecords {
  @IsArray()
  @IsNotEmpty()
  successedValues: Object[];

  @IsArray()
  @IsNotEmpty()
  failedValues: Object[];
}
