import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService {
    private players;
    create(createPlayerDto: CreatePlayerDto): Player;
    findAll(): Player[];
    findOne(id: number): Player | undefined;
    updateElo(id: number, newElo: number): Player | undefined;
}
