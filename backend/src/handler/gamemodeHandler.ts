export class GameMode {
    public name: string;
    public description: string;
    public isActive: boolean;
}

export class PitagorasGameMode extends GameMode {
    public name = 'Pitagoras';
    public description = 'Solve the Pitagoras Problem to move on the board, who reaches the end first wins!';
    public isActive = false;

}
