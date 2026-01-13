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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
let MatchService = class MatchService {
    playerService;
    constructor(playerService) {
        this.playerService = playerService;
    }
    create(createMatchDto) {
        const winner = this.playerService.findOne(+createMatchDto.winnerId);
        const loser = this.playerService.findOne(+createMatchDto.loserId);
        if (!winner || !loser) {
            throw new Error('Player not found');
        }
        const winnerElo = winner.elo;
        const loserElo = loser.elo;
        const kFactor = 32;
        const expectedWinnerScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
        const expectedLoserScore = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
        const newWinnerElo = winnerElo + kFactor * (1 - expectedWinnerScore);
        const newLoserElo = loserElo + kFactor * (0 - expectedLoserScore);
        this.playerService.updateElo(+createMatchDto.winnerId, newWinnerElo);
        this.playerService.updateElo(+createMatchDto.loserId, newLoserElo);
        return {
            message: 'Match validé',
            details: {
                winner: {
                    id: winner.id,
                    oldElo: winner.elo,
                    newElo: newWinnerElo,
                },
                loser: {
                    id: loser.id,
                    oldElo: loser.elo,
                    newElo: newLoserElo,
                },
            },
        };
    }
    findAll() {
        return `This action returns all match`;
    }
    findOne(id) {
        return `This action returns a #${id} match`;
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], MatchService);
//# sourceMappingURL=match.service.js.map