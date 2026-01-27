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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_service_1 = require("../player/player.service");
const player_entity_1 = require("../player/entities/player.entity");
let RankingService = class RankingService {
    playerService;
    eventEmitter;
    ranking = [];
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    async onModuleInit() {
        await this.refreshRanking();
    }
    async refreshRanking() {
        this.ranking = await this.playerService.findAll();
        this.ranking.sort((a, b) => b.elo - a.elo);
    }
    getRanking() {
        return this.ranking;
    }
    async handlePlayerCreated(player) {
        await this.refreshRanking();
        this.eventEmitter.emit('ranking.notify', {
            id: player.id,
            rank: player.elo,
        });
    }
};
exports.RankingService = RankingService;
__decorate([
    (0, event_emitter_1.OnEvent)('player.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_entity_1.Player]),
    __metadata("design:returntype", Promise)
], RankingService.prototype, "handlePlayerCreated", null);
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], RankingService);
//# sourceMappingURL=ranking.service.js.map