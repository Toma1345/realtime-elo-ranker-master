import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Tom', description: 'Nom du joueur' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
