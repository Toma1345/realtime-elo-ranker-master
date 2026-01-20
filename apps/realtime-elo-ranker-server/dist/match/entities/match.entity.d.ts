import { Player } from '../../player/entities/player.entity';
export declare class Match {
    id: number;
    timestamp: Date;
    winner: Player;
    loser: Player;
}
