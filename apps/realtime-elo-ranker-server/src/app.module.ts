import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { RankingGateway } from './ranking/ranking.gateway';

@Module({
  imports: [PlayerModule, MatchModule],
  controllers: [AppController],
  providers: [AppService, RankingGateway],
})
export class AppModule {}
