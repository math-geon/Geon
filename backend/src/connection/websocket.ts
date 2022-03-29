import ws from 'ws';

export class WebsocketServer {
    private wss: ws.Server;
    private port: number;

    constructor(port: number) {
      this.port = port;
    }

    public startServer(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.wss = new ws.Server({ port: this.port });
        this.wss.on('listening', () => {
          resolve(true);
        });
        this.wss.on('error', () => {
          reject(false);
        });
        this.wss.on('connection', this.onConnection);
      });
    }

    public onConnection(ws: ws): void {
      ws.on('message', this.onMessage);
    }

    public onMessage(message: string|Buffer): void {
      console.log(message.toString());
    }
}
