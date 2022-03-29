import { Room, GameMode, player } from "../handler";
import { stringGenerator } from '../utils/';

export class RoomManager  {
    private static rooms: Room[] = [];

    public static getRoom(id: string): Room {
        for (const room of this.rooms) {
            if (room.id === id) {
                return room;
            }
        }
        return null;
    }

    public static addRoom(room: Room): void {
        this.rooms.push(room);
    }

    public static removeRoom(room: Room): void {
        this.rooms.splice(this.rooms.indexOf(room), 1);
    }

    public static createRoom(name: string|null, password: string|null, host: player, maxPlayers: number, gameMode: GameMode, isPublic: boolean): Room {
        var id: string;

        do {
            id = stringGenerator(7);
        } while (this.getRoom(id) !== null);

        if (name === null) {
            name = "Room " + id;
        }

        const room = new Room().createRoom({ id, name, password, host, maxPlayers, gameMode, isPublic, isActive: true });
        this.addRoom(room);
        return room;
    }
}
