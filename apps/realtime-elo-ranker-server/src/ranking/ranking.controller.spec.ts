import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingController', () => {
  let controller: RankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        RankingService,
        {
          provide: PlayerService,
          useValue: { findAll: jest.fn().mockResolvedValue([]) },
        },
        EventEmitter2,
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('devrait retourner un flux SSE (Observable)', () => {
    const result = controller.sse();
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });
});
