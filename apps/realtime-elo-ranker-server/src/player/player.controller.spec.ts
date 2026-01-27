import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('devrait appeler findAll sur le service du lecteur', async () => {
    const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait appeler findOne sur le service de lecteur', async () => {
    const spy = jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await controller.findOne('player1');
    expect(spy).toHaveBeenCalledWith('player1');
  });
});
