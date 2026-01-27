import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  @IsString()
  winner: string;

  @ApiProperty()
  @IsString()
  loser: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  draw: boolean;
}
