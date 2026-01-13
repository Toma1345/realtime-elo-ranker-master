import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchService {
    private readonly playerService;
    constructor(playerService: PlayerService);
    create(createMatchDto: CreateMatchDto): {
        message: string;
        details: {
            winner: {
                id: number;
                oldElo: number;
                newElo: number;
            };
            loser: {
                id: number;
                oldElo: number;
                newElo: number;
            };
        };
    };
    findAll(): string;
    findOne(id: number): string;
}
