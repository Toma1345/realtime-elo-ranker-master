import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    findAll(): Promise<Player[]>;
    findOne(id: string): Promise<Player | null>;
    updateElo(id: string, newElo: number): Promise<Player | null>;
}
