playersTurn = true;
class PlayerTemplate {
    shipsCount = [3, 2, 2, 1] // [1x1, 2x1, 3x1, 4x1]
    tableLogical = []; // Logické schéma tabulky hráče
    tableElement = document.createElement("table"); // Fyzická HTML tabulka
    playerType;
    shipsCounterElement; // HTML tagy s počtem zbývajících lodí
    messageElement =  document.querySelector("#message p");

    constructor(playerType, tableParentElement, shipsCounterElement){
        this.playerType = playerType
        this.shipsCounterElement = shipsCounterElement;
        this.generateTable(tableParentElement);
        this.updateShipCount();
    }
    collisionCheck(orientation, rowOrColumn, cell, shipType){
        for(let i = 0; i < shipType; i++){
            switch(orientation){
                case 0: {
                    if(this.tableLogical[rowOrColumn][cell] != 0) return false;
                    if(rowOrColumn < 9){
                        if(this.tableLogical[rowOrColumn+1][cell] != 0) return false;
                    }
                    if(rowOrColumn > 0){
                        if(this.tableLogical[rowOrColumn-1][cell] != 0) return false;
                    }
                    if(cell < 9){
                        if(this.tableLogical[rowOrColumn][cell+1] != 0) return false
                    }
                    if(cell > 0){
                        if(this.tableLogical[rowOrColumn][cell-1] != 0) return false
                    }
                    cell++;
                    break;
                }
                case 1: {
                    if(this.tableLogical[cell][rowOrColumn] != 0) return false;
                    if(rowOrColumn < 9){
                        if(this.tableLogical[cell][rowOrColumn+1] != 0) return false
                    }
                    if(rowOrColumn > 0){
                        if(this.tableLogical[cell][rowOrColumn-1] != 0) return false
                        
                    }
                    if(cell < 9){
                        if(this.tableLogical[cell+1][rowOrColumn] != 0) return false;
                    }
                    if(cell > 0){
                        if(this.tableLogical[cell-1][rowOrColumn] != 0) return false;
                    }
                    cell++;
                    break;
                }
            }
        }
        return true;
    }

    placeShips(){
        for(let shipType = 1; shipType <= this.shipsCount.length; shipType++){
            for(let i = 0; i < this.shipsCount[shipType-1]; i++){
                let orientation = Math.floor(Math.random()*2) // Orientace lodi: 0 = vodorovně, 1 = svisle
                let rowOrColumn = Math.floor(Math.random()*10) // Výběr řádku nebo sloupce (to, jestli tato hodnota reprezentuje sloupec (osa X) nebo řádek (osa Y) tabulky, rozhoduje orientace lodi: vodorovně -> řádek; svisle -> sloupec)
 
                let cell = Math.floor(Math.random()*(10-shipType)); // Vygenerování první buňky lodi

                /* Pokud je vygenerovánaná pozice lodi již obsazena jinou lodí, bude se zkoušet umístit novou loď na první možné
                neobsazené místo.*/
                if(this.collisionCheck(orientation, rowOrColumn, cell, shipType) == false){
                    

                    while(this.collisionCheck(orientation, rowOrColumn, cell, shipType) == false){
                            if(cell < 10-shipType && rowOrColumn <= 9){
                                cell++;
                            }else if(cell >= 10-shipType && rowOrColumn < 9){
                                cell = 0;
                                rowOrColumn++;
                            }else if(cell >= 10-shipType && rowOrColumn >= 9){
                                cell = 0;
                                rowOrColumn = 0;
                            }
                    }          
                }
                

                // Umístění lodi do tabulky
                for(let j = 0; j < shipType; j++){
                    switch(orientation){
                        case 0: {
                            this.tableLogical[rowOrColumn][cell] = shipType;
                            cell++;
                            break;
                        }
                        case 1: {
                            this.tableLogical[cell][rowOrColumn] = shipType;
                            cell++;
                            break;
                        }
                    }
                }
            }
        }
    }
    generateTable(parentElement){
        this.tableElement.classList.add("shipTable");
        for(let i = 0; i < 10; i++){
            let rowElement = document.createElement("tr");
            rowElement.id = `${this.playerType}-row-${i}`;
            let rowLogical = [];
            
            for(let j = 0; j < 10; j++){
                let cellElement = document.createElement("td");
                cellElement.id = `${this.playerType}-${i}-${j}`;
                rowElement.append(cellElement);
                rowLogical.push(0);
            }

            this.tableElement.append(rowElement);
            this.tableLogical.push(rowLogical);
        }
        this.placeShips()
        parentElement.append(this.tableElement);
        this.tableElement.style.width = `${this.tableElement.offsetHeight}px`;
    }

    updateShipCount(){
        let victory = true;
        let lastShipsCount = this.shipsCount.slice(0)
        this.shipsCount.fill(0);
        let occurrences = [0, 0, 0, 0];
        for(let row = 0; row < 10; row++){
            for(let column = 0; column < 10; column++){
                switch(this.tableLogical[row][column]){
                    case 1: occurrences[0]++; break;
                    case 2: occurrences[1]++; break;
                    case 3: occurrences[2]++; break;
                    case 4: occurrences[3]++; break;
                }
            }
        }
        for(let i = 0; i < 4; i++){
            this.shipsCount[i] = Math.ceil(occurrences[i]/(i+1));
            this.shipsCounterElement[i].textContent = this.shipsCount[i];
            if(this.shipsCount[i] < lastShipsCount[i]){
                switch(this.playerType){
                    case "r": {
                        this.messageElement.textContent = `Potopili jste loď ${i+1}x1`;
                        break;
                    }
                    case "h": {
                        this.messageElement.textContent = `Byla potopena vaše loď ${i+1}x1`;
                        break;
                    }
                }
                
            }
        }
        for(let i = 0; i < 4; i++){
            if(this.shipsCount[i] != 0){
                victory = false;
                break;
            }
        }
        if(victory){
            let fullscreenMessage = document.querySelector("#fullscreenMessage");
            switch(this.playerType){
                case "h": {
                    fullscreenMessage.textContent = "Prohráli jste";
                    break
                }
                case "r": {
                    fullscreenMessage.textContent = "Vyhráli jste";
                }
            }
            fullscreenMessage.style.display = "flex";
        }
        
    }
    
}

/* Třídy obou hráčů reprezentjí jejich vlastní flotily (tabulka, počty lodí apod.), proto každá hrající strana (člověk vs počítač) pracuje s třídou svého protivníka*/
class HumanPlayer extends PlayerTemplate {
    remainingCells = [];

    constructor(tableParentElement, shipsCounterElement){
        super("h", tableParentElement, shipsCounterElement);

        for(let row = 0; row < 10; row++){
            for(let column = 0; column < 10; column++){
                let cellElement = document.querySelector(`#${this.playerType}-${row}-${column}`);

                if(this.tableLogical[row][column] >= 1 && this.tableLogical[row][column] <=4){
                    cellElement.style.backgroundColor = "#4c4c4c";
                }
            }
        }
        
        /* V poli "remainingCells" jsou uložena všechny nezasažené buňky hráče. Při každém odehrání počítače se příslušný 
        záznam náhodně určené buňky vymaže. Díky tomu počítač netrefuje již použité buňky*/
        for(let row = 0; row < 10; row++){
            for(let column = 0; column < 10; column++){
                this.remainingCells.push({"row": row, "column": column});
            }
        }
    }




    guess(){
        let randomCellIndex = Math.floor(Math.random()*this.remainingCells.length);
        let randomCell = this.remainingCells[randomCellIndex];
        this.remainingCells.splice(randomCellIndex, 1);

        let cellElement = document.querySelector(`#${this.playerType}-${randomCell.row}-${randomCell.column}`);

        if(this.tableLogical[randomCell.row][randomCell.column] >= 1 && this.tableLogical[randomCell.row][randomCell.column] <= 4){
            this.tableLogical[randomCell.row][randomCell.column] = "hit";
            this.messageElement.textContent = "Vaše loď byla zasažena";
            cellElement.style.backgroundColor = "#bd0000";
        }else if(this.tableLogical[randomCell.row][randomCell.column] == 0){
            this.tableLogical[randomCell.row][randomCell.column] = "miss";
            this.messageElement.textContent = "Protivník minul vaši loď";
            cellElement.style.backgroundColor = "#1e94b4";
        }
        this.updateShipCount();

        playersTurn = true;
    }
}

class RobotPlayer extends PlayerTemplate {
    constructor(tableParentElement, shipsCounterElement, playersObject){
        super("r", tableParentElement, shipsCounterElement);
        
        // Event při kliknutí na buňku tabulky protivníka (počítače)
        this.tableElement.childNodes.forEach((row)=>{
            row.childNodes.forEach((cell)=>{
                cell.addEventListener("click", ()=>{
                    if(playersTurn){
                        let coordinates = cell.id.split("-");
                        this.guess(coordinates[1], coordinates[2]);
                    }
                })
            })
        })

        // Refernece na objekt hráče. Z něj se volá metoda guess() pokaždé, když hráč zvolí pole počítače
        this.playersObject = playersObject;
    }

    guess(row, column){
        if(this.tableLogical[row][column] >= 0 && this.tableLogical[row][column] <= 4){
            playersTurn = false;
            let cellElement = document.querySelector(`#${this.playerType}-${row}-${column}`);

            if(this.tableLogical[row][column] >= 1 && this.tableLogical[row][column] <= 4){
                this.tableLogical[row][column] = "hit";
                this.messageElement.textContent = "Zásah";
                cellElement.style.backgroundColor = "#4c4c4c";
            }else if(this.tableLogical[row][column] == 0){
                this.tableLogical[row][column] = "miss";
                this.messageElement.textContent = "Netrefili jste se";
                cellElement.style.backgroundColor = "#1e94b4";
            }
            this.updateShipCount();

            // Tah počítače:
            setTimeout(function(thisObject){
                thisObject.playersObject.guess();
            }, 1000, this);
        }else{
            this.messageElement.textContent = "Nemůžete zvolit stejnou pozici vícekrát";
        }
    }
}