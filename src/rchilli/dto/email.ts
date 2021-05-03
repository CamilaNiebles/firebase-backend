import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Email {
  @IsString()
  @IsNotEmpty()
  EmailAddress: string;

  @IsNumber()
  @IsNotEmpty()
  ConfidenceScore: number;
}
