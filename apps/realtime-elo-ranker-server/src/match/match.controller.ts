import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('matches')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau match' })
  @ApiResponse({
    status: 201,
    description: 'Le match a été créé avec succès.',
  })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les matchs',
  })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un match selon un id',
  })
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }
}
