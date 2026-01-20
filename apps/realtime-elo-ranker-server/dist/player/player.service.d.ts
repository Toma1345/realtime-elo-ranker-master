import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService {
    private playerRepository;
    constructor(playerRepository: Repository<Player>);
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    findAll(): Promise<Player[]>;
    findOne(id: number): Promise<Player | null>;
    updateElo(id: number, newElo: number): Promise<Player | null>;
}
