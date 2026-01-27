import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class RankingService implements OnModuleInit {
  private ranking: Player[] = [];

  constructor(
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  @OnEvent('player.created')
  async handlePlayerCreated(player: Player) {
    await this.refreshRanking();
    this.eventEmitter.emit('ranking.notify', {
      id: player.id,
      rank: player.elo,
    });
  }
}
