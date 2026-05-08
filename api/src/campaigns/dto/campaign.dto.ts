import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}
