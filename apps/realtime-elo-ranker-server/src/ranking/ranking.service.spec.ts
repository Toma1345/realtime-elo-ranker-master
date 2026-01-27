import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingController', () => {
  let controller: RankingController;
  let service: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: {
            getRanking: jest.fn().mockReturnValue([{ id: 'P1', elo: 1200 }])
          },
        },
        { provide: EventEmitter2, useValue: {} },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
  });

  it('devrait retourner le classement formaté pour le client', () => {
    const result = controller.getRanking();
    expect(result).toEqual([{ id: 'P1', rank: 1200 }]);
    expect(service.getRanking).toHaveBeenCalled();
  });
});
