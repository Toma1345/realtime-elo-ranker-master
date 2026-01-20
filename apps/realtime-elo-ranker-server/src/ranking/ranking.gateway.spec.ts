import { Test, TestingModule } from '@nestjs/testing';
import { RankingGateway } from './ranking.gateway';

describe('RankingGateway', () => {
  let gateway: RankingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankingGateway],
    }).compile();

    gateway = module.get<RankingGateway>(RankingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
