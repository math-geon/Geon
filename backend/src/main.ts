import { WebsocketServer } from './connection/';
import { Logger } from './logger/';

const port: number = Number(process.env.GEON_PORT) || 3010;

const server = new WebsocketServer(port);
const logger = new Logger({ debug: true, prefix: 'Geon' });

server.startServer().then(() => {
  logger.info(`Websocket server is listening on port ${port}`);
}).catch(() => {
  logger.fatal(`Websocket server failed to start on port ${port}`);
});
