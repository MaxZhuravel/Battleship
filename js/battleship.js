var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.classList.add("hit");
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.classList.add("miss");
    },
    displayBorders: function(borders){
        var cells = new Array();
        for(var i=0;i<borders.length;i++){
            cells[i]=document.getElementById(borders[i])
            if(cells[i]){
                cells[i].classList.add("miss");
            }
        }
    }
}

var model = {
    boardSize:10,
    numShips:10,
    shipSunk:0,
    shipLength:[4,3,3,2,2,2,1,1,1,1],
    ships:[{locations:[0,0,0,0],hits:["","","",""],borders:[0,0,0,0,0,0,0,0,0,0,0,0]},
            {locations:[0,0,0],hits:["","",""],borders:[0,0,0,0,0,0,0,0,0,0,0,0]},
            {locations:[0,0,0],hits:["","",""],borders:[0,0,0,0,0,0,0,0,0,0,0,0]},
            {locations:[0,0],hits:["",""],borders:[0,0,0,0,0,0,0,0,0,0]},
            {locations:[0,0],hits:["",""],borders:[0,0,0,0,0,0,0,0,0,0]},
            {locations:[0,0],hits:["",""],borders:[0,0,0,0,0,0,0,0,0,0]},
            {locations:[0],hits:[""],borders:[0,0,0,0,0,0,0,0]},
            {locations:[0],hits:[""],borders:[0,0,0,0,0,0,0,0]},
            {locations:[0],hits:[""],borders:[0,0,0,0,0,0,0,0]},
            {locations:[0],hits:[""],borders:[0,0,0,0,0,0,0,0]}],
    fire:function(guess){
        for(var i=0;i<this.numShips;i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(index>=0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Влучив!");
                if(this.isSunk(ship,i)){
                    this.shipSunk++;
                    view.displayMessage("Ти потопив мій корабель!");
                    view.displayBorders(this.ships[i].borders)
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Промах!");
        return false;
    },
    isSunk:function(ship,x){
        for(var i=0; i<this.shipLength[x];i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations:function(){
        var locations;
        for(var i = 0;i<this.numShips;i++){
            do{
                locations = this.generateShip(i);
                
            }while(this.collision(locations));
            this.ships[i].locations = locations[0];
            this.ships[i].borders = locations[1];
            console.log(this.ships[i]);
        }
    },
    generateShip:function(x){
        var direction = Math.floor(Math.random()*2);
        var row, col;
        if (direction === 1){
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()*(this.boardSize - this.shipLength[x]));
        }else{
            row = Math.floor(Math.random()*(this.boardSize - this.shipLength[x]));
            col = Math.floor(Math.random()*this.boardSize);
        }
        var newShipCollection = [];
        var newBorderCollection = [];
        for(var i = 0;i<this.shipLength[x];i++){
            if(this.shipLength[x] === 1){
                newShipCollection.push(row + "" + (col));
                newBorderCollection.push((row-1)+""+(col-1));
                newBorderCollection.push((row)+""+(col-1));
                newBorderCollection.push((row+1)+""+(col-1));
                newBorderCollection.push((row-1)+""+(col+i));
                newBorderCollection.push((row+1)+""+(col+i));
                newBorderCollection.push((row-1)+""+(col+this.shipLength[x]));
                newBorderCollection.push((row)+""+(col+this.shipLength[x]));
                newBorderCollection.push((row+1)+""+(col+this.shipLength[x]));
            }
            else if(direction === 1){
                newShipCollection.push(row + "" + (col+i));
                if(i==0){
                    newBorderCollection.push((row-1)+""+(col-1));
                    newBorderCollection.push((row)+""+(col-1));
                    newBorderCollection.push((row+1)+""+(col-1));
                }else if(i===(this.shipLength[x]-1)){
                    newBorderCollection.push((row-1)+""+(col+this.shipLength[x]));
                    newBorderCollection.push((row)+""+(col+this.shipLength[x]));
                    newBorderCollection.push((row+1)+""+(col+this.shipLength[x]));
                }
                newBorderCollection.push((row-1)+""+(col+i));
                newBorderCollection.push((row+1)+""+(col+i));
            }else{
                newShipCollection.push((row+i) + "" + col);
                if(i==0){
                    newBorderCollection.push((row-1)+""+(col-1));
                    newBorderCollection.push((row-1)+""+(col));
                    newBorderCollection.push((row-1)+""+(col+1));
                }else if(i===(this.shipLength[x]-1)){
                    newBorderCollection.push((row+this.shipLength[x])+""+(col-1));
                    newBorderCollection.push((row+this.shipLength[x])+""+(col));
                    newBorderCollection.push((row+this.shipLength[x])+""+(col+1));
                }
                newBorderCollection.push((row+i)+""+(col-1));
                newBorderCollection.push((row+i)+""+(col+1));
            }
        }
        return [newShipCollection,newBorderCollection];
    },

    collision:function(locationsAndBorders){
        var locations = locationsAndBorders[0];
        var borders = locationsAndBorders[1];
        for(var i=0;i<this.numShips;i++){
            var ship = this.ships[i];
            for(var j=0;j<locations.length;j++){
                if(ship.locations.indexOf(locations[j])>=0){
                    return true;
                }
                else if(ship.borders.indexOf(locations[j])>=0){
                    return true;
                }            
            }
        }
        return false;
    }
}

var controller = {
    guesses:0,
    processGuess:function(guess){
        var location = this.parceGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMessage("Кількість ходів за які ви потопили всі мої кораблі: " + this.guesses);
            }
        }
    },
    parceGuess:function(guess){
        var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var alphabetSmall = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
        if(guess === null || guess.length < 2 || guess.length > 3){
            alert("Введіть коректні дані");
        }else{
            var row, column, letter;
            row = guess.slice(0,-1);
            letter = guess.slice(-1);
            row--;
            column = alphabet.indexOf(letter);
            if(column === -1){
                column = alphabetSmall.indexOf(letter);
            }
            
            if(isNaN(row)|| isNaN(column)){
                alert("Упс... Будь лака введіть число та літеру");
            }else if(row < 0 || row >= model.boardSize ||
                    column < 0 || column >= model.boardSize){
                alert("Введіть дані, які присутні на ігровому полі");
            }
            else{
                return row + "" + column;
            }
        }
        return null;
    }
}

window.onload = function(){
    model.generateShipLocations();
    var fireButton = document.getElementById("fireButton");
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    fireButton.onclick = function(){
        var guess = guessInput.value;
        controller.processGuess(guess);
        guessInput.value="";
    }
    guessInput.onkeypress = function(e){
        if(e.keyCode === 13){
            fireButton.onclick();
            return false;
        }
    }
}