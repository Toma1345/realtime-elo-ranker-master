"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_service_1 = require("../player/player.service");
const match_entity_1 = require("./entities/match.entity");
const ranking_service_1 = require("../ranking/ranking.service");
let MatchService = class MatchService {
    matchRepository;
    playerService;
    rankingService;
    eventEmitter;
    constructor(matchRepository, playerService, rankingService, eventEmitter) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
        this.rankingService = rankingService;
        this.eventEmitter = eventEmitter;
    }
    async create(createMatchDto) {
        const { winner: winnerName, loser: loserName, draw } = createMatchDto;
        const winner = await this.playerService.findOne(winnerName);
        const loser = await this.playerService.findOne(loserName);
        if (!winner || !loser) {
            throw new common_1.NotFoundException(`Joueur introuvable`);
        }
        const K = 32;
        const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));
        const actualScoreWinner = draw ? 0.5 : 1;
        const actualScoreLoser = draw ? 0.5 : 0;
        const newWinnerElo = Math.round(winner.elo + K * (actualScoreWinner - expectedWinner));
        const newLoserElo = Math.round(loser.elo + K * (actualScoreLoser - expectedLoser));
        await this.playerService.updateElo(winner.id, newWinnerElo);
        await this.playerService.updateElo(loser.id, newLoserElo);
        const match = this.matchRepository.create({
            winner,
            loser,
            timestamp: new Date(),
        });
        await this.matchRepository.save(match);
        await this.rankingService.refreshRanking();
        this.eventEmitter.emit('ranking.notify', {
            id: winner.id,
            rank: newWinnerElo,
        });
        this.eventEmitter.emit('ranking.notify', {
            id: loser.id,
            rank: newLoserElo,
        });
        return match;
    }
    findAll() {
        return this.matchRepository.find({
            relations: ['winner', 'loser'],
            order: { id: 'DESC' },
        });
    }
    findOne(id) {
        return this.matchRepository.findOne({
            where: { id },
            relations: ['winner', 'loser'],
        });
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService,
        ranking_service_1.RankingService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map