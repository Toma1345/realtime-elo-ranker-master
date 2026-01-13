import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
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
    findOne(id: string): string;
}
