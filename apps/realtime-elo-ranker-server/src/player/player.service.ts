import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  private players: Player[] = [];

  create(createPlayerDto: CreatePlayerDto): Player {
    const newPlayer: Player = {
      id: this.players.length + 1,
      name: createPlayerDto.name,
      elo: createPlayerDto.elo ?? 1000,
    };
    this.players.push(newPlayer);
    return newPlayer;
  }

  findAll(): Player[] {
    return this.players;
  }

  findOne(id: number) {
    return this.players.find((p) => p.id === id);
  }

  updateElo(id: number, newElo: number) {
    const player = this.findOne(id);
    if (player) {
      player.elo = newElo;
    }
    return player;
  }
}
