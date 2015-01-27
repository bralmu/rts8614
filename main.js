"use strict";
var stage, layer, background;
var mouseX, mouseY;
var gameUnits, selectedGameUnit;

// Definición clase GameUnit
var GameUnit = function(x, y, color) {
    this.targetX = x;
    this.targetY = y;
    this.selectedFillColor = 'white';
    this.unselectedFillColor = color;
    this.kineticElement = new Kinetic.Rect({
        x: this.targetX,
        y: this.targetY,
        width: 100,
        height: 50,
        fill: color,
        stroke: 'black',
        strokeWidth: 4
      });
    this.getPosition = function() {
        return {x: this.kineticElement.getPosition().x, y: this.kineticElement.getPosition().y};
    }
    this.setPosition = function(parameters) {
        if(parameters.x >= 0 && parameters.y >= 0) {
            this.kineticElement.setPosition(parameters);
        }
    }
    this.setSelected = function(selected) {
        if(selected == true) {
            this.kineticElement.setFill(this.selectedFillColor);
        }else if (selected == false) {
            this.kineticElement.setFill(this.unselectedFillColor);
        }
    }
}

// Crear elementos
gameUnits = [new GameUnit(100,300,'green'), new GameUnit(300,100,'blue')];
stage = new Kinetic.Stage({
        container: 'container',
        width: 640,
        height: 360
      });
layer = new Kinetic.Layer();
background = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: 640,
    height: 360,
    fill: 'grey',
    });

// Añadir elementos
layer.add(background);
for(var gu in gameUnits) {
    var shape = gameUnits[gu].kineticElement;
    layer.add(shape);
}
stage.add(layer);


function refresh() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 5;
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 5;
    for(var gu in gameUnits) {
        var unit = gameUnits[gu];
        unit.setPosition({x: ((unit.targetX + unit.getPosition().x) / 2), y: ((unit.targetY + unit.getPosition().y) / 2)});
    }   
    stage.setWidth(w);
    stage.setHeight(h);
    background.setWidth(w);
    background.setHeight(h);
}

function clickAction() {
    // si hacemos click sobre una unidad actualizamos selectedGameUnit
    for (var gu in gameUnits) {
        var unit = gameUnits[gu];
        if(mouseX >= (unit.getPosition().x)
        && mouseX <= (unit.getPosition().x + unit.kineticElement.getWidth())
        && mouseY >= (unit.getPosition().y)
        && mouseY <= (unit.getPosition().y + unit.kineticElement.getHeight())) {
            selectedGameUnit = unit;
            for (var gu in gameUnits) {
                gameUnits[gu].setSelected(false);
            }
            selectedGameUnit.setSelected(true);
            break;
        }
    }
    // si hacemos click fuera de la unidad seleccionada, la desplazamos
    if(selectedGameUnit != undefined &&
        (mouseX < (selectedGameUnit.getPosition().x)
        || mouseX > (selectedGameUnit.getPosition().x + selectedGameUnit.kineticElement.getWidth())
        || mouseY < (selectedGameUnit.getPosition().y)
        || mouseY > (selectedGameUnit.getPosition().y + selectedGameUnit.kineticElement.getHeight()))) {
        selectedGameUnit.targetX = (mouseX - selectedGameUnit.kineticElement.getWidth() / 2);
        selectedGameUnit.targetY = (mouseY - selectedGameUnit.kineticElement.getHeight() / 2);
    }
}

$(document).mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

$('#container').click(function(e) {
    clickAction();
});

window.setInterval(function(){
    refresh();
}, 40);


