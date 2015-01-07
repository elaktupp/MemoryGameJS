/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * TODO:
 * 
 * - Only 1 player at the moment and no scores counted
 * - After match found the next click should inactivate matched pair AND
 *      a) Open the next clicked item, if item is closed
 *      OR
 *      b) Do nothing except inactivate matched pair, if item is inactive
 * - Check when the game ends and declare the winner
 * 
 * + Perhaps the matched pair should be inactivated to founding player's color?
 * 
 * RULES:
 * 
 * - Player tries to find two matching images by opening two closed pieces.
 * - If matching pair is found the player get another go.
 * - If no match is found the next player gets his/her turn.
 */

/* This should be in a file or something... */
var images = [
  "alarmed.png","alien.png","amazed.png","angry_shout.png","angst.png","beard.png",
  "bow.png","cheek.png","clown_nose.png","confused.png","cool.png","devil.png",
  "envy.png","eyes_closed_happy.png","eyes_closed_neutral.png",
  "eyes_closed_unhappy.png","eyes_rolling.png","eyes_wide_alarmed.png",
  "eyes_wide_amazed.png","eyes_wide_happy.png","eyes_wide_open_cheek.png",
  "eyes_wide_open_confused.png","eyes_wide_open_grin.png","eyes_wide_open_up.png",
  "frankenstein.png","full_grin.png","full_grin_wink.png","grin.png","happy.png",
  "kiss.png","laugh.png","looney.png","masked.png","moustach_down.png",
  "moustach_up.png","mouth_shut.png","neutral.png","party.png","pirate.png",
  "sad.png","sick.png","spectacles.png","sweat_happy.png","sweat_unhappy.png",
  "system.png","tongue_out.png","uncertain.png","unhappy.png",
  "wink.png","yawn.png"
];

window.onload = function (event) {
    console.log(event); // Good to have for debugging
    
    generateGamePieces();
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function generateGamePieces() {
    var rows = 10;
    var columns = 10;
    var i,j = 0;
    
    /*
     * BOARD {
     *     TR { TR_SPAN { TD { TD_SPAN { TN } }, TD { TD_SPAN { TN } }, ... }
     *     TR { TR_SPAN { TD { TD_SPAN { TN } }, TD { TD_SPAN { TN } }, ... }
     *     TR { TR_SPAN { TD { TD_SPAN { TN } }, TD { TD_SPAN { TN } }, ... } 
     * }
     */
   
    var board = document.getElementById("gameboard");
    var pieces = [];
    // We have 10 x 10 board, so we need 100 pieces to fill it
    // but we must have two similar pieces
    for (i = 0; i < 100; i++) {
        var td = document.createElement('td');
        td.addEventListener('click',handleClick,false);
        var img = document.createElement('img');
        img.isGamePieceActive = true;
        img.setAttribute('class', 'piece');
        img.setAttribute('src',"./images/"+images[Math.floor(i/2)]);
        img.setAttribute('alt',images[Math.floor(i/2)]);
        td.appendChild(img);
        pieces.push(td);
    }
    
    shuffle(pieces);
    
    for (i = 0; i < rows; i++) {
        // Prepare table row and span for its content
        var tr = document.createElement('tr');
        var tr_span = document.createElement('span');
        tr_span.setAttribute('class', 'piecerow');
        for (j = 0; j < columns; j++) {
            // Put td piece into table row span
            tr_span.appendChild(pieces[(i*10)+j]);
            // Put table row span into table row
            tr.appendChild(tr_span);
        }
        // Add filled table row to board
        board.appendChild(tr);
    }
    
}

var firstOpen = null;
var secondOpen = null;
var nbrOfOpenPieces = 0;
var weHaveMatch = false;

function handleClick(event) {
    
    console.log(event);

    var clickedOne = event.target;

    // First of all, is this piece still usable i.e. not found yet
    if (clickedOne.isGamePieceActive) {

        switch (nbrOfOpenPieces) {
            case 0: // No piece selected yet
            {
                firstOpen = event.target;
                console.log("FIRST ONE!");
                openPiece(firstOpen);
                firstOpen.style.webkitTransition = "background-color 1s";
                nbrOfOpenPieces += 1;
            }
            break;
            case 1: // One piece is open, go for second one
            {
                if (clickedOne === firstOpen) {
                    // Clicked same twice
                    console.log("SAME TWICE!");
                } else {
                    // Clicked pieces is not yet open
                    secondOpen = clickedOne;
                    nbrOfOpenPieces += 1;
                    openPiece(secondOpen);
                    secondOpen.style.webkitTransition = "background-color 1s";
                    // tried to do flip but not working... at least not like this
                    //secondOpen.style.webkitTransition = "transform 1s, background-color 2s";
                    //secondOpen.style.webkitTransform = "rotate3d(1,0,0,180deg";

                    var newOne = secondOpen.alt.toString();
                    var openOne = firstOpen.alt.toString();

                    if (newOne === openOne) {

                        // Match found!
                        console.log("MATCH FOUND!");
                        firstOpen.isGamePieceActive = false;
                        secondOpen.isGamePieceActive = false;
                        weHaveMatch = true;

                    } else {

                        console.log("NOT MATCH!");

                    }
                }
            }
            break;
            default: {
                if (weHaveMatch) {
                    console.log("WELL DONE!");
                    inactivatePiece(firstOpen);
                    inactivatePiece(secondOpen);
                    weHaveMatch = false;
                } else {
                    console.log("TRY AGAIN!");
                    closePiece(firstOpen);
                    closePiece(secondOpen);
                }
                nbrOfOpenPieces = 0;
            }
        }
    } else {
        console.log("ALREADY FOUND!");
    }
}

function closePiece(piece) {
    // Change background color to make piece image invisible
    // i.e. make the piece closed
    piece.style.backgroundColor = "black";
    piece.style.webkitTransition = "background-color 1s";
}

function openPiece(piece) {
    // Change background color to make piece image visible
    // i.e. make the piece open
    piece.style.backgroundColor = "white";
    piece.style.webkitTransition = "background-color 1s";
}

function inactivatePiece(piece) {
    // Change background color to mark the piece as found
    piece.style.backgroundColor = "lightgray";
    piece.style.webkitTransition = "background-color 1s";
}