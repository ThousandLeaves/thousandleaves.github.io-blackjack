/**
 * [ ] main.js
 * 
 * This file imports all other modules and is the entry point for scripting behavior.
 * All interactions coming from index are processed here and router to their respective objects/modules.
 * 
 * main.js serves as the main logic controller, receiving input from the view and then routing that input
 * to methods and properties in the appropriate model.
 * 
 * The update.js module is always called last, after all controller and model methods have completed.
 * This ensures the view will be updated with the most accurate information.
 */

"use strict";

import { Update } from "./view/Update.js";
import { Deck } from "./model/deck.js";
import { Player } from "./model/player.js";

const BlackjackGame = (() => {

    var isNewGame = true;
    /* Game status describes the game state. Begins uninitialized, can be playing, win, loss, etc. */
    var gameStatus = "uninitialized";
    var player1;
    var dealer;
    var acesValue = "high";
 
    /* Define buttons in const in case names change later */
    const GAME_BUTTON_ARRAY = ["Deal", "Hit", "Stand", "Resign"];

    function getButtonClick(e) {
        let updateType = "";
        let triggerAction = "";
        let postGameDrawing = true;
        /* Signify game has started */
        if (isNewGame) {
            isNewGame = false;
        }

        if(e.target.innerText === GAME_BUTTON_ARRAY[0]) {
            /* Only available in first turn of game. Deals cards out to players/dealer */
            gameDeal();
            triggerAction = "deal";
            if (checkNaturals() === true) {
            gameStatus = "playing";
            postGameDrawing = false;
            }
        } else if(e.target.innerText === GAME_BUTTON_ARRAY[1]) {
            /* Player receives a card until choosing to stand or busting */
            gameHit();
            triggerAction = "hit";
        } else if(e.target.innerText === GAME_BUTTON_ARRAY[2]) {
            /* Player does not draw more cards. Dealer draws until > 17 or bust */
            gameStand();
            triggerAction = "stand";
            postGameDrawing = false;
        } else if(e.target.innerText === GAME_BUTTON_ARRAY[3]) {
            /*  */
            gameResign();
            triggerAction = "resign";
        }

        if (postGameDrawing) {
            /* After every button click, update the view with new information */
            let gameStateCollection = {
                playerHand: player1.getHand(),
                dealerHand: dealer.getHand(),
                playerRoundsWon: player1.getRoundsWon(),
                dealerRoundsWon: dealer.getRoundsWon(),
                gameStatus: gameStatus
            }
            Update.update(triggerAction, gameStateCollection);
        }
    }

    /*******************************************************************************
     * Game interactive functions:
     * These functions provide the core gameplay actions that respond to player input.
     * 
     * All interactive functions return an array value of updated gameplay elements
     * that need to be refreshed on the DOM.
     *******************************************************************************/
    /* gameDeal initializes a new game. */
    var gameDeal = () => {
        player1 = Player(new Array(), 0);
        dealer = Player(new Array(), 0);
        Deck.populateDeck();
        Deck.shuffleDeck();

        /* Remove any cards from the player's hand */
        player1.removeHand();
        dealer.removeHand();
        for (let i = 1; i <= 4; i++) {
            if(i % 2 === 1) {
                addCardsToHand(player1);
            } else {
                addCardsToHand(dealer);
            }

        }
    }

    var gameHit = () => {

        addCardsToHand(player1);

        if (player1.getScore() > 21 && acesValue === "high") {
            acesValue = checkAcesHighOrLow(player1);
            if (acesValue === "high") {
                gameCompletionState("lose", dealer);                
            }
        } else if (player1.getScore() > 21 && acesValue === "low") {
            gameCompletionState("lose", dealer);               
        }

    }

    var gameStand = () => {
        let isDealerBust = false;
        let triggerAction = "stand";

        while (dealer.getScore() < 17) {
            addCardsToHand(dealer);
            if (dealer.getScore() > 21) {
                if (checkAcesHighOrLow(dealer) === "high") {
                            // Dealer loses
                            isDealerBust = true;
                }
            }
        }

            let gameStateCollection = {
                playerHand: player1.getHand(),
                dealerHand: dealer.getHand(),
                playerRoundsWon: player1.getRoundsWon(),
                dealerRoundsWon: dealer.getRoundsWon(),
                gameStatus: gameStatus
            }
            Update.update(triggerAction, gameStateCollection);

        /* Check if dealer busted, otherwise compare dealer & player scores */
        if (isDealerBust) {
            gameCompletionState("win", player1);
        } else {
            if (player1.getScore() > dealer.getScore()) {
                gameCompletionState("win", player1);
            } else if (player1.getScore() < dealer.getScore()) {
                gameCompletionState("lose", dealer);
            } else {
                gameCompletionState("draw");
            }
        }

    }


    var gameResign = () => {
        gameCompletionState("resign", dealer);
    }

    /*******************************************************************************
     * Game helper functions:
     * Helper functions indirectly work with the above functions to do things like
     * determine the game state.
     ********************************************************************************/
    var addCardsToHand = (player) => {
        let newCard = Deck.takeCard();
        player.addCard(newCard);
        player.addScore(newCard.getValue().points);     
    }

    /* Checks if dealer or player has natural. Returns false otherwise, setting game state
    to "playing" */
    var checkNaturals = () => {

        let triggerAction = "deal";
        /* After every button click, update the view with new information */
        let gameStateCollection = {
            playerHand: player1.getHand(),
            dealerHand: dealer.getHand(),
            playerRoundsWon: player1.getRoundsWon(),
            dealerRoundsWon: dealer.getRoundsWon(),
            gameStatus: gameStatus
        }
        Update.update(triggerAction, gameStateCollection);


        let playerNatural = player1.hasNatural();
        let dealerNatural = dealer.hasNatural();

        if (playerNatural && dealerNatural) {
            gameCompletionState("draw");
        } else if (playerNatural) {
            console.log("nat");
            gameCompletionState("naturalPlayer", player1);
        } else if (dealerNatural) {
            console.log("nat");
            gameCompletionState("naturalDealer", dealer);
        } else {
            return false;
        }
    }

    /* Called whenever dealer or player would go over 21 */
    var checkAcesHighOrLow = (player) => {
        return player.determineAcesValue();
    }

    var gameCompletionState = (state, winner = dealer) => {

        let triggerAction = "completed";
        
        if (state === "win") {
            gameStatus = "You've won this round!";
        } else if (state === "lose") {
            gameStatus = "You've lost this round.";
        } else if (state === "draw") {
            gameStatus = "The round was a draw!";
        } else if (state === "naturalPlayer") {
            gameStatus = "Player natural! You've won.";
        } else if (state === "naturalDealer") {
            gameStatus = "Dealer natural! You've lost.";
        } else if (state === "resign") {
            gameStatus = "You've resigned.";
        }

        let gameStateCollection = {
            playerHand: player1.getHand(),
            dealerHand: dealer.getHand(),
            playerRoundsWon: player1.getRoundsWon(),
            dealerRoundsWon: dealer.getRoundsWon(),
            gameStatus: gameStatus
        }
        Update.update(triggerAction, gameStateCollection);

        if (state !== "draw") {
            winner.addWin();
        }
    }

    const sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*******************************************************************************
     * Add event listeners to buttons to separate design from implementation
     *******************************************************************************/
    let gameButtons = document.querySelectorAll("button");
    gameButtons.forEach(element => element.addEventListener("click", getButtonClick));

})();