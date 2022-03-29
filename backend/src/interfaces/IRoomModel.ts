import { player, GameMode } from '../handler';

export interface IRoomModel {
    id: string,
    name: string,
    maxPlayers: number,
    password: string,
    players?: Array<player>,
    gameMode: GameMode,
    isActive: boolean,
    isFull?: boolean,
    isPublic: boolean,
    host: player
}
