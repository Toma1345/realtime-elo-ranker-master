import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingService', () => {
  let controller: RankingController;
  let service: RankingService;
  let playerService: PlayerService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        RankingService,
        {
          provide: PlayerService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('devrait retourner le classement formaté pour le client', async () => {
    const mockPlayers = [{ id: 'P1', elo: 1200 }];
    jest.spyOn(playerService, 'findAll').mockResolvedValue(mockPlayers as any);

    await service.refreshRanking();

    const result = controller.getRanking();
    expect(result).toEqual([{ id: 'P1', rank: 1200 }]);
  });

  it('devrait trier les joueurs par ELO décroissant', async () => {
    const players = [
      { id: 'P1', elo: 1000 },
      { id: 'P2', elo: 1200 },
    ];
    jest.spyOn(playerService, 'findAll').mockResolvedValue(players as any);

    await service.refreshRanking();
    const ranking = service.getRanking();

    expect(ranking[0].id).toBe('P2');
    expect(ranking[1].id).toBe('P1');
  });

  it("devrait gérer l'événement player.created", async () => {
    const mockPlayer = { id: 'p1', elo: 1000 } as any;
    await service.handlePlayerCreated(mockPlayer);

    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'ranking.notify',
      expect.any(Object),
    );
  });
});
