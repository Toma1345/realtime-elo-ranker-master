import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
    });

    const savedPlayer = await this.playerRepository.save(player);
    this.eventEmitter.emit('player.created', savedPlayer);

    return savedPlayer;
  }

  findAll() {
    return this.playerRepository.find({ order: { elo: 'DESC' } });
  }

  findOne(id: string) {
    return this.playerRepository.findOneBy({ id });
  }

  async updateElo(id: string, newElo: number) {
    await this.playerRepository.update(id, { elo: newElo });
    return this.findOne(id);
  }
}
