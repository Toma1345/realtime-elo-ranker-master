import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlayerService', () => {
  let service: PlayerService;
  let repo: any;
  let eventEmitter: EventEmitter2;

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(player => Promise.resolve({ ...player, elo: 1000 })),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getRepositoryToken(Player), useValue: mockRepository },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repo = module.get(getRepositoryToken(Player));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('devrait créer un joueur et émettre un événement', async () => {
    const dto = { id: 'Player1' };
    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith('player.created', result);
    expect(result.id).toBe('Player1');
  });

  it('devrait renvoyer tous les joueurs', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });

  it('devrait trouver un joueur', async () => {
    const player = { id: 'p1' };
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(player as any);
    expect(await service.findOne('p1')).toEqual(player);
  });

  it('devrait mettre à jour elo', async () => {
    const updateSpy = jest.spyOn(repo, 'update').mockResolvedValue({} as any);
    jest.spyOn(repo, 'findOneBy').mockResolvedValue({ id: 'p1', elo: 1100 } as any);

    const result = await service.updateElo('p1', 1100);
    expect(updateSpy).toHaveBeenCalledWith('p1', { elo: 1100 });
    expect(result.elo).toBe(1100);
  });
});
