let playerTableArea = document.querySelector("#playersArea .tableArea");
let playerCounter = document.querySelectorAll("#playersArea .infoArea .shipCountNum")
let opponentsTableArea = document.querySelector("#opponentsArea .tableArea");
let opponentsCounter = document.querySelectorAll("#opponentsArea .infoArea .shipCountNum")


let player = new HumanPlayer(playerTableArea, playerCounter);
let opponent = new RobotPlayer(opponentsTableArea, opponentsCounter, player);

let fullscreenMessage = document.querySelector("#fullscreenMessage");
let fullscreenMessageBtn = document.querySelector("#fullscreenMessage button");
fullscreenMessageBtn.addEventListener("click", ()=>{
    fullscreenMessage.style.display = "none";
    fullscreenMessageBtn.style.display = "none";
})