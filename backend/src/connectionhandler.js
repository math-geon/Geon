var ActiveRooms = []

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

function GenerateRoom(socket, Data) {
    const RoomScheme = {
        Id: '',
        Players : [],
    }
    
    const PlayerScheme = {
        Id: "",
        Name: "",
    }
    Data = JSON.parse(Data);
    RoomScheme.Id =getRandomString(7);
    PlayerScheme.Id = Data.UserId;
    RoomScheme.Players.push(PlayerScheme);
    ActiveRooms.push(RoomScheme)
    console.log(ActiveRooms);
    socket.emit('RoomId', JSON.stringify({RoomId: RoomScheme.Id}))
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('GenerateRoom', (Data) => {GenerateRoom(socket, Data)})
        socket.on('disconnect', () => {reconnect(socket)});
    });
};