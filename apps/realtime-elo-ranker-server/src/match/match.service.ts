import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly playerService: PlayerService) {}

  create(createMatchDto: CreateMatchDto) {
    const winner = this.playerService.findOne(+createMatchDto.winnerId);
    const loser = this.playerService.findOne(+createMatchDto.loserId);

    if (!winner || !loser) {
      throw new Error('Player not found');
    }

    // Update ELO scores
    const winnerElo = winner.elo;
    const loserElo = loser.elo;
    const kFactor = 32;

    const expectedWinnerScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedLoserScore = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

    const newWinnerElo = winnerElo + kFactor * (1 - expectedWinnerScore);
    const newLoserElo = loserElo + kFactor * (0 - expectedLoserScore);

    this.playerService.updateElo(+createMatchDto.winnerId, newWinnerElo);
    this.playerService.updateElo(+createMatchDto.loserId, newLoserElo);

    return {
      message: 'Match validé',
      details: {
        winner: {
          id: winner.id,
          oldElo: winner.elo,
          newElo: newWinnerElo,
        },
        loser: {
          id: loser.id,
          oldElo: loser.elo,
          newElo: newLoserElo,
        },
      },
    };
  }

  findAll() {
    return `This action returns all match`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }
}
