function reconnect(socket) {
    socket.broadcast.emit('reconnect');
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {reconnect(socket)});
    });
};