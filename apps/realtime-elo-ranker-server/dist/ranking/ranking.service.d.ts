import { OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';
export declare class RankingService implements OnModuleInit {
    private readonly playerService;
    private readonly eventEmitter;
    private ranking;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    onModuleInit(): Promise<void>;
    refreshRanking(): Promise<void>;
    getRanking(): Player[];
    handlePlayerCreated(player: Player): Promise<void>;
}
