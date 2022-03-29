import { user } from './';

export class player extends user {
    public name: string;
    public isReady: boolean;
    public isPlayerTurn: boolean;
    public isHost: boolean;
    public score: number;
    public boardPosition: number;
    public isAnswering: boolean;
}
