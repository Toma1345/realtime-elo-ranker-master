import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Player, { eager: true })
  winner: Player;

  @ManyToOne(() => Player, { eager: true })
  loser: Player;
}
