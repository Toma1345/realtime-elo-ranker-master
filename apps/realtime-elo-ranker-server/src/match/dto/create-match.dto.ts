import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  @IsNumber()
  winnerId: number;

  @ApiProperty()
  @IsNumber()
  loserId: number;
}
