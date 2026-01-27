import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('MatchService', () => {
  let service: MatchService;
  let playerService: PlayerService;
  let matchRepository: Repository<Match>;

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
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    playerService = module.get<PlayerService>(PlayerService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  it('devrait calculer correctement le nouvel ELO après un match', async () => {
    jest.spyOn(playerService, 'findOne')
      .mockResolvedValueOnce({ id: 'P1', elo: 1000 } as any) // Vainqueur
      .mockResolvedValueOnce({ id: 'P2', elo: 1000 } as any); // Perdant

    await service.create({ winner: 'P1', loser: 'P2', draw: false });

    expect(playerService.updateElo).toHaveBeenCalledWith('P1', 1016);
    expect(playerService.updateElo).toHaveBeenCalledWith('P2', 984);
  });

  it('devrait réussir à créer une partie et à mettre à jour le classement Elo', async () => {
    const p1 = { id: 'p1', elo: 1000 };
    const p2 = { id: 'p2', elo: 1000 };

    jest.spyOn(playerService, 'findOne')
      .mockResolvedValueOnce(p1 as any)
      .mockResolvedValueOnce(p2 as any);

    jest.spyOn(matchRepository, 'create').mockReturnValue({} as any);
    jest.spyOn(matchRepository, 'save').mockResolvedValue({} as any);

    const result = await service.create({
      winner: 'p1',
      loser: 'p2',
      draw: false,
    });
    expect(result).toBeDefined();
  });

  it("devrait lever une exception NotFoundException si les joueurs n'existent pas", async () => {
    jest.spyOn(playerService, 'findOne').mockResolvedValue(null);
    await expect(
      service.create({ winner: 'p1', loser: 'p2', draw: false })
    ).rejects.toThrow(NotFoundException);
  });
});
