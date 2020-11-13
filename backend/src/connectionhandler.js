var ActiveRooms = []

const RoomScheme = {
    Id: '',
    Players : [],
}

const PlayerScheme = {
    Id: "",
    Name: "",
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function reconnect(socket) {
    socket.broadcast.emit('reconnect');
}

function GenerateRoom(socket) {
    let RoomId = getRandomString(7)

}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('GenerateRoom', () => {GenerateRoom(socket)})
        socket.on('disconnect', () => {reconnect(socket)});
    });
};