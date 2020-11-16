var MouseSelectedText = false;
var MouseSelectedBox = false;
var loaded = false;

function BoxWrapper(Name) {
    if (!MouseSelectedText && !MouseSelectedBox) {
        setTimeout(()=>{
            if (!MouseSelectedText && !MouseSelectedBox) {
                document.getElementsByClassName(Name)[0].id = 'CopyTextSpeechBoxDisapear';
                setTimeout(()=>{
                    if (!MouseSelectedText && !MouseSelectedBox) {
                        document.getElementsByClassName('CopyText')[0].textContent = 'Copiar Código';
                        document.getElementsByClassName(Name)[0].id = '';
                        document.getElementsByClassName(Name)[0].style.display = 'none';
                    } else {
                        document.getElementsByClassName('CopyText')[0].textContent = 'Copiar Código';
                        document.getElementsByClassName(Name)[0].style.display = 'block';
                        document.getElementsByClassName(Name)[0].id = '';
                    }
                }, 300);
            } else {
                document.getElementsByClassName('CopyText')[0].textContent = 'Copiar Código';
                document.getElementsByClassName(Name)[0].style.display = 'block';
                document.getElementsByClassName(Name)[0].id = '';
            }
        }, 500);
    } else {
        document.getElementsByClassName(Name)[0].style.display = 'block';
        document.getElementsByClassName(Name)[0].id = '';
    }
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

var CurrentRoom = '';
var UserId = getRandomString(12);
var UserName = '';

function Loaded() {
    loaded = true;
    socket.on('NewUser', (Data)=>{
        Data = JSON.parse(Data);
        CreateUsers(Data.EnteredUserId);
    })
    socket.on('UserNameInformation', (Data)=>{
        Data = JSON.parse(Data);
        Players = [];
        Players = [...document.getElementsByClassName('Players')[0].children]
        Data.NickName = Data.NickName.split(">").join(" ")
        Data.NickName = Data.NickName.split("<").join(" ")
        Data.NickName = Data.NickName.split("/").join(" ")
        Players.forEach((element) => {
            if (element.id === Data.UserId) {
                element.innerHTML = Data.NickName;
            }
        })
    })
    socket.on('UserLeave', (Data) => {
        Data = JSON.parse(Data);
        document.getElementById(Data.UserLeaved).remove();
    })
    socket.on('FullRoom', () => {
        document.getElementsByClassName("MenuBackground")[0].style.display = 'block';
        document.getElementsByClassName("ConnectingScreen")[0].style.display = 'none';
        document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
        document.getElementsByClassName("Menus")[0].style.display = 'block';
        document.getElementsByClassName("Game")[0].style.display = 'none';
        document.getElementsByClassName("UserNameInput")[0].id = '';
        document.getElementsByClassName("UserNameInput")[0].style.display = 'none';
        document.getElementsByClassName('RoomFulled')[0].style.display = 'block';
    })
    socket.on('RoomNotExists', () => {
        document.getElementsByClassName("MenuBackground")[0].style.display = 'block';
        document.getElementsByClassName("ConnectingScreen")[0].style.display = 'none';
        document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
        document.getElementsByClassName("Menus")[0].style.display = 'block';
        document.getElementsByClassName("Game")[0].style.display = 'none';
        document.getElementsByClassName("UserNameInput")[0].id = '';
        document.getElementsByClassName("UserNameInput")[0].style.display = 'none';
        document.getElementsByClassName("RoomNotFounded")[0].style.display = 'block';
    })
    document.getElementsByClassName('RoomForm')[0].addEventListener('submit', PlayRoomIdBlockAndExecute)
    socket.on('reconnect', ()=>{
       newUserId = getRandomString(12);
        oldUserId = UserId
        socket.emit('Reconnector', JSON.stringify({oldUserId: oldUserId, userId: newUserId}));
        Players = [...document.getElementsByClassName('Players')[0].children]
        Players.forEach((element, index) => {
            if (element.id === oldUserId) {
                element.id = newUserId;
            }
        })
        UserId = newUserId;
    })

    socket.on('UpdateUserId', (Data) => {
        Data = JSON.parse(Data);
        Players = [...document.getElementsByClassName('Players')[0].children]
        Players.forEach((element, index) => {
            if (element.id === Data.OldId) {
                element.id = Data.NewId;
            }
        })
    })

    socket.on('ConnectionFailed', () => {
        document.getElementsByClassName('ErrorScreen')[0].style.display = 'block';
    })
}

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
    CurrentRoom = document.getElementsByClassName('RoomId')[0].value;
    StartTheGame(CurrentRoom)
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

function ProgressbarHandler(Name, Max, Percentage, Time) {
    Time = Time || 2;
    if (Percentage === "100") { Percentage = "98"}
    Value = (Percentage/100)*Max;
    AnimationTime = 0;
    function Animation() {
        setTimeout(()=>{
            if (AnimationTime > 100) {return;}
            AnimationTime += Time;
            if (((AnimationTime/100)*Value) > document.getElementsByClassName(Name)[0].style.width.toString().substring(0,document.getElementsByClassName(Name)[0].style.width.toString().length-2)) {
                document.getElementsByClassName(Name)[0].style.width = ((AnimationTime/100)*Value)+'vw';
            }
            Animation()
        }, 1)
    }
    Animation();
}

function Credits() {
    document.getElementsByClassName("MenuBackground")[0].style.display = 'none';
    document.getElementsByClassName("CreditsScreen")[0].style.display = 'block';
}

function BackToMainMenu(Page) {
    if (Page === "Credits") {
        document.getElementsByClassName("CreditsScreen")[0].style.display = 'none';
    }
    document.getElementsByClassName("MenuBackground")[0].style.display = 'block';
}

function CreateGame() {
    document.getElementsByClassName("MenuBackground")[0].style.display = 'none';
    document.getElementsByClassName("ConnectingScreen")[0].style.display = 'block';
    document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
    socket.emit('GenerateRoom', JSON.stringify({UserId: UserId}));
    ProgressbarHandler("ProgressProgressBar", "49.5", "75");
    socket.on('RoomId', (Data) => {
        Data = JSON.parse(Data)
        CurrentRoom = Data.RoomId;
        ProgressbarHandler("ProgressProgressBar", "49.5", "100");
        setTimeout(()=>{
            StartTheGame(CurrentRoom);
        },1000)
    })
}

function UsernameHandler() {
    if (document.getElementsByClassName('UserTextInput')[0].value.length > 0) {
        document.getElementsByClassName('UserTextSubmit')[0].disabled = false;
    } else {
        document.getElementsByClassName('UserTextSubmit')[0].disabled = true;
    }
}

function UserNameSubmit(event) {
    event.preventDefault();
    UserName = document.getElementsByClassName('UserTextInput')[0].value;
    socket.emit('RegisterUserName', JSON.stringify({RoomId: CurrentRoom, UserId: UserId, UserName: UserName}))
    document.getElementsByClassName('UserNameInput')[0].id = 'popup-close';
    setTimeout(()=>{
        document.getElementsByClassName('UserNameInput')[0].id = 'popup-close';
        document.getElementsByClassName('UserNameInput')[0].style.display = 'none';
    }, 300)
}

function StartTheGame(RoomID) {
    function WaitLoad() {
        if (loaded === false) {
            setTimeout(()=>{WaitLoad()}, 2500)
        } else {
            socket.emit('RegisterUser', JSON.stringify({RoomId: RoomID, UserId: UserId}))
            document.getElementsByClassName('userInput')[0].addEventListener('submit', UserNameSubmit)
            document.getElementsByClassName("Menus")[0].style.display = 'none';
            document.getElementsByClassName("Game")[0].style.display = 'block';
            document.getElementsByClassName("RoomIdText")[0].innerHTML = RoomID;
            document.getElementsByClassName("UserNameInput")[0].id = 'popup';
            document.getElementsByClassName("UserNameInput")[0].style.display = 'block';
            document.getElementsByClassName('UserTextInput')[0].value = UserName;
            setTimeout(()=>{document.getElementsByClassName("UserNameInput")[0].id = '';}, 300)
        }
    }
    WaitLoad()
}

function CreateUsers(id) {
    document.getElementsByClassName('Players')[0].innerHTML += '<div id="'+id+'" class="PlayerWrapper">Aguardando...</div>'
}

function PlayRoomIdBlockAndExecute(event) {
    event.preventDefault();
    StartGame();
}