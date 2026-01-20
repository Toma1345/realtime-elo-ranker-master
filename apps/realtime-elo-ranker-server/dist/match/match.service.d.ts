import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { RankingService } from '../ranking/ranking.service';
export declare class MatchService {
    private matchRepository;
    private playerService;
    private rankingService;
    private eventEmitter;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService, rankingService: RankingService, eventEmitter: EventEmitter2);
    create(createMatchDto: CreateMatchDto): Promise<Match>;
    findAll(): Promise<Match[]>;
    findOne(id: number): Promise<Match | null>;
}
