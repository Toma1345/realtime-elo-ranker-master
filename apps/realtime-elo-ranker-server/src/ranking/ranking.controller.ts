import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupère le classement actuel (JSON)' })
  getRanking() {
    return this.rankingService.getRanking();
  }

  @Sse('sse')
  @ApiOperation({ summary: 'Flux SSE pour les mises à jour du classement' })
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ranking.update').pipe(
      map((data) => {
        return { data } as MessageEvent;
      }),
    );
  }
}
