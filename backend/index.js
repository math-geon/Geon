const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const FrontEndPath = path.resolve(__dirname, '..', 'frontend');
const connection = require('./src/connectionhandler');

// Permite o envio de dados entre o jogo e o servidor usando o padrão json.
app.use(express.json());
// Deixa os arquivos do jogo publicos para que o jogo possa carregar seus arquivos
app.use(express.static(FrontEndPath));
// Faz com que quando a pessoa acesse o site ele envie o arquivo do jogo para a pessoa.
app.get('/', (req, res) => {
  res.sendFile(path.resolve(FrontEndPath, 'Geon.html'));
});
// inicia o socket
connection(io);

// Liga o servidor.
http.listen('3000', () => {
  console.log('Conectado com a porta: 3000');
});
