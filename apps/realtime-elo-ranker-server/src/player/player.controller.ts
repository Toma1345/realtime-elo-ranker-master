import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('players')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau joueur' })
  @ApiResponse({
    status: 201,
    description: 'Le joueur a été créé avec succès.',
  })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les joueurs',
  })
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un joueur selon son id',
  })
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }
}
