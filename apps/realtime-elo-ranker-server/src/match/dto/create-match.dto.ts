import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    example: 'Player1',
    description: 'ID du vainqueur',
  })
  @IsString()
  winner: string;

  @ApiProperty({
    example: 'Player2',
    description: 'ID du perdant',
  })
  @IsString()
  loser: string;

  @ApiProperty({
    example: false,
    description: 'Le match est-il une égalité ?',
  })
  @IsBoolean()
  @IsOptional()
  draw: boolean;
}
