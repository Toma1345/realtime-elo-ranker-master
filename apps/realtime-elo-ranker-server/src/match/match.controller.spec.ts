import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    service = module.get<MatchService>(MatchService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('devrait appeler findAll sur le service', async () => {
    const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait appeler findOne sur le service', async () => {
    const spy = jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await controller.findOne('1');
    expect(spy).toHaveBeenCalledWith(1);
  });
});
