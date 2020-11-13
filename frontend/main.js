function StartGame() {
    document.getElementsByClassName("ConnectingScreen")[0].style.display = 'block';
    document.getElementsByClassName("ProgressProgressBar")[0].style.width = '0vw';
    ConnectToServer();
}

function ConnectToServer() {
    socket.emit('connection')
}