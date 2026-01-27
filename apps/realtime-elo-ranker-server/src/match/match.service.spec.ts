import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';

describe('MatchService', () => {
  let service: MatchService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: PlayerService,
          useValue: { findOne: jest.fn(), updateElo: jest.fn() },
        },
        { provide: RankingService, useValue: { refreshRanking: jest.fn() } },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        {
          provide: getRepositoryToken(Match),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('devrait calculer correctement le nouvel ELO après un match', async () => {
    jest.spyOn(playerService, 'findOne')
      .mockResolvedValueOnce({ id: 'P1', elo: 1000 } as any) // Vainqueur
      .mockResolvedValueOnce({ id: 'P2', elo: 1000 } as any); // Perdant

    await service.create({ winner: 'P1', loser: 'P2', draw: false });

    expect(playerService.updateElo).toHaveBeenCalledWith('P1', 1016);
    expect(playerService.updateElo).toHaveBeenCalledWith('P2', 984);
  });
});
