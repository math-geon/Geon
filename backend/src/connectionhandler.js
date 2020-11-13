var ActiveRooms = []
var ids = [];
var cleaning = false;

function cleaner() {
    if (!cleaning) {
        cleaning = true;
        setTimeout(()=> {
            ActiveRooms.forEach((element, index) => {
                element.Players.forEach((element2, index2) => {
                    if (!ids.includes(element2.Id)) {
                        ActiveRooms[index].Players.splice(index2,1);
                    }
                })
            })
            ActiveRooms.forEach((element, index) => {
                if (element.Players.length === 0) {
                    ActiveRooms.splice(index,1);
                }
            })
            ids = [];
            cleaning = false;
        }, 15000);
    }
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
    cleaner();
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
    var RoomId = getRandomString(7);
    ActiveRooms.forEach((element, index) => {
        if (element.Id === RoomId) {
            GenerateRoom(socket, Data);
            return;
        }
    })
    RoomScheme.Id = RoomId;
    PlayerScheme.Id = Data.UserId;
    RoomScheme.Players.push(PlayerScheme);
    ActiveRooms.push(RoomScheme)
    setTimeout(()=>{
        socket.emit('RoomId', JSON.stringify({RoomId: RoomScheme.Id}))
    }, 2000)
}

function Updater(socket, Data) {
    Data = JSON.parse(Data);
    ActiveRooms.forEach((element, index)=> {
        element.Players.forEach((element2, index2) => {
            if (element2.Id === Data.oldUserId) {
                ActiveRooms[index].Players[index2].Id = Data.userId;
                ids.push(Data.userId);
                cleaner();
            }
        })
    })
}

function verifyer(socket, executer, Data) {
    Data = JSON.parse(Data);
    var RoomContainsUser = false;
    ActiveRooms.forEach((element, index)=>{
        if (element.Id === Data.RoomId) {
            ActiveRooms[index].Players.forEach((element2, index2)=>{
                if (element2.Id === Data.UserId) {
                    RoomContainsUser = true;
                }
            })
        }    
    })
    if (RoomContainsUser) {
        executer(socket, Data)
    } else {
        socket.emit('ConnectionFailed');
    }
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('GenerateRoom', (Data) => {GenerateRoom(socket, Data)});
        socket.on('disconnect', () => {reconnect(socket)});
        socket.on('Reconnector', (Data) => {Updater(socket, Data)});
    });
};