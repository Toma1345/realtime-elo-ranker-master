import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from 'src/player/player.module';
import { RankingModule } from '../ranking/ranking.module';
import { Match } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), PlayerModule, RankingModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
