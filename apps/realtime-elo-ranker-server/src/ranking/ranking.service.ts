import { Injectable, OnModuleInit } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class RankingService implements OnModuleInit {
  private ranking: Player[] = [];
  constructor(private readonly playerService: PlayerService) {}

  async onModuleInit() {
    await this.refreshRanking();
  }

  async refreshRanking() {
    this.ranking = await this.playerService.findAll();
    this.ranking.sort((a, b) => b.elo - a.elo);
  }

  getRanking() {
    return this.ranking;
  }
}
