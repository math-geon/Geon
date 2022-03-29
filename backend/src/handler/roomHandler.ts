import { IRoomModel } from '../interfaces';
import { player, GameMode } from './';

export class Room {
    public id: string;
    public name: string;
    public maxPlayers: number;
    public password: string|null;
    public players: Array<player>;
    public gameMode: GameMode;
    public isActive: boolean;
    public isFull: boolean;
    public isPublic: boolean;
    public host: player;

    public createRoom(roomProperties: IRoomModel) {
        const room = new Room();
        room.id = roomProperties.id;
        room.name = roomProperties.name;
        room.maxPlayers = roomProperties.maxPlayers;
        room.password = roomProperties.password;
        room.players = [];
        room.gameMode = roomProperties.gameMode;
        room.isActive = roomProperties.isActive;
        room.isFull = roomProperties.isFull;
        room.isPublic = roomProperties.isPublic;
        room.host = roomProperties.host;
        return room;
    }
}
