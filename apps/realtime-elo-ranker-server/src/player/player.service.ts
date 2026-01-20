import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  findAll() {
    return this.playerRepository.find({ order: { elo: 'DESC' } });
  }

  findOne(id: number) {
    return this.playerRepository.findOneBy({ id });
  }

  async updateElo(id: number, newElo: number) {
    await this.playerRepository.update(id, { elo: newElo });
    return this.findOne(id);
  }
}
