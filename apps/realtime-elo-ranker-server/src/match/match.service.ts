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
    const { winner: winnerName, loser: loserName, draw } = createMatchDto;

    const winner = await this.playerService.findOne(winnerName);
    const loser = await this.playerService.findOne(loserName);

    if (!winner || !loser) {
      throw new NotFoundException(`Joueur introuvable`);
    }

    // Update ELO scores
    const K = 32;

    const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

    const actualScoreWinner = draw ? 0.5 : 1;
    const actualScoreLoser = draw ? 0.5 : 0;

    const newWinnerElo = Math.round(
      winner.elo + K * (actualScoreWinner - expectedWinner),
    );
    const newLoserElo = Math.round(
      loser.elo + K * (actualScoreLoser - expectedLoser),
    );

    await this.playerService.updateElo(winner.id, newWinnerElo);
    await this.playerService.updateElo(loser.id, newLoserElo);

    const match = this.matchRepository.create({
      winner,
      loser,
      timestamp: new Date(),
    });
    await this.matchRepository.save(match);

    await this.rankingService.refreshRanking();

    this.eventEmitter.emit('ranking.notify', {
      id: winner.id,
      rank: newWinnerElo,
    });
    this.eventEmitter.emit('ranking.notify', {
      id: loser.id,
      rank: newLoserElo,
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
