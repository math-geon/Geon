var CurrentRoom = '';

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function StartGame() {
    document.getElementsByClassName("MenuBackground")[0].style.display = 'none';
    document.getElementsByClassName("ConnectingScreen")[0].style.display = 'block';
    document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
    socket.emit('EnterRoom')
}

function RoomIdHandler() {
    if (document.getElementsByClassName("RoomId")[0].value.length > 7) {
        document.getElementsByClassName("RoomId")[0].value = document.getElementsByClassName("RoomId")[0].value.slice(0,7)
    }
    if (document.getElementsByClassName("RoomId")[0].value.length === 7) {
        document.getElementsByClassName("PlayButton")[0].disabled = false;
    } else {
        document.getElementsByClassName("PlayButton")[0].disabled = true;
    }
}

function ProgressbarHandler(Name, Max, Percentage) {
    Value = (Percentage/100)*Max;
    AnimationTime = 0;
    function Animation() {
        setTimeout(()=>{
            if (AnimationTime > 100) {return;}
            AnimationTime += 2;
            document.getElementsByClassName(Name)[0].style.width = ((AnimationTime/100)*Value)+'vw';
            Animation()
        }, 1)
    }
    Animation();
}

function CreateGame() {
    document.getElementsByClassName("MenuBackground")[0].style.display = 'none';
    document.getElementsByClassName("ConnectingScreen")[0].style.display = 'block';
    document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
    socket.emit('GenerateRoom', JSON.stringify({UserId: getRandomString(12)}));
    ProgressbarHandler("ProgressProgressBar", "49.5", "35");
    socket.on('RoomId', (Data) => {
        Data = JSON.parse(Data)
        CurrentRoom = Data.RoomId;
        ProgressbarHandler("ProgressProgressBar", "49.5", "65");
    })
}