import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private playerService: PlayerService,
    private rankingService: RankingService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { winnerId, loserId } = createMatchDto;

    const winner = await this.playerService.findOne(winnerId);
    const loser = await this.playerService.findOne(loserId);

    if (!winner || !loser) {
      throw new NotFoundException('Joueur introuvable');
    }

    // Update ELO scores
    const K = 32;

    const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

    const newWinnerElo = Math.round(winner.elo + K * (1 - expectedWinner));
    const newLoserElo = Math.round(loser.elo + K * (0 - expectedLoser));

    // Mise à jour des joueurs
    await this.playerService.updateElo(winner.id, newWinnerElo);
    await this.playerService.updateElo(loser.id, newLoserElo);

    const match = this.matchRepository.create({
      winner,
      loser,
      timestamp: new Date(),
    });
    await this.matchRepository.save(match);

    await this.rankingService.refreshRanking();

    this.eventEmitter.emit('ranking.update', {
      ranking: this.rankingService.getRanking(),
    });

    return match;
  }

  findAll() {
    return this.matchRepository.find({
      relations: ['winner', 'loser'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.matchRepository.findOne({
      where: { id },
      relations: ['winner', 'loser'],
    });
  }
}
