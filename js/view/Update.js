/**
 * [ ] Update.js
 * 
 * The Update.js module runs at the end of every player action. It helps to modify the DOM by
 * updating crucial information such as player/dealer scores and the cards currently on the table.
 * 
 */

'use strict';

const Update = (() => {

    /* The update method alters the DOM every time it is called based on new information */
    const update = (triggerAction, gameStateCollection) => {

        let suit;
        let rank;

        if (triggerAction === "deal") {
            /* Remove placeholders that keep play area's shape */
            deleteAllCardElements();
            setGameButtonState(true, false, false, false);
            setStatusText("The deck has been shuffled and the cards dealt. Good luck!");

            for (let h = 0; h < 2; h++) {
            /* Four initial cards when dealing */
                let totalCards = 2;
                for (let i = 0; i < totalCards; i++) {
                    /* Player receives odd cards in deal */
                    if (i % 2 === 1) {
                        suit = gameStateCollection.playerHand[h].getValue().suit;
                        rank = gameStateCollection.playerHand[h].getValue().rank;
                    /* dealer receives even cards in dealing */
                    } else if (i % 2 === 0) {
                        suit = gameStateCollection.dealerHand[h].getValue().suit;
                        rank = gameStateCollection.dealerHand[h].getValue().rank;
                    }
                    /* Create card element */
                    if (h !== 1 || i % 2 !== 0) {
                        drawCard(suit, rank, i % 2);
                    } else {
                        drawCard(suit, rank, i % 2, 1);
                    }
                }
            }

        } else if (triggerAction === "hit") {
            suit = gameStateCollection.playerHand[gameStateCollection.playerHand.length - 1].getValue().suit;
            rank = gameStateCollection.playerHand[gameStateCollection.playerHand.length - 1].getValue().rank;            
            drawCard(suit, rank, 1)
            
        } else if (triggerAction === "stand") {

            /* First reveal the dealer's hidden card */
            revealDealerCard(gameStateCollection.dealerHand);

            /* Display remaining drawn cards */
            if (gameStateCollection.dealerHand.length > 2) {
                for (let i = 2; i < gameStateCollection.dealerHand.length; i++) {
                    suit = gameStateCollection.dealerHand[i].getValue().suit;
                    rank = gameStateCollection.dealerHand[i].getValue().rank;  
                    drawCard(suit, rank, 0);  
                }

            }
        

        } else if (triggerAction === "resign") {

        } else if (triggerAction === "completed") {
            if (gameStateCollection.gameStatus === "Dealer natural! You've lost." ||
            gameStateCollection.gameStatus === "Player natural! You've won.") {
                revealDealerCard(gameStateCollection.dealerHand);              
            }
                        revealDealerCard(gameStateCollection.dealerHand);
            setStatusText("Game over! " + gameStateCollection.gameStatus);
            setGameButtonState(false, true, true, true);
        }

        /* check if game was won or lost to provide additional visual updates */

        if (gameStateCollection.gameStatus === "win") {

        } else if (gameStateCollection.gameStatus === "loss") {

        } else if (gameStateCollection.gameStatus === "draw") {

        }

    }

    /*******************************************************************************
     * Update helper methods:
     * Helper methods indirectly work with the above methods to do things like
     * update the player's view with the newest information.
     ********************************************************************************/

    /* Facedown can be 0 or 1. If 1, then card is drawn face down. */
    const drawCard = function(suit, rank, player, faceDown = 0) {
        let elemClass = "";
        let parentClass = "";
        let txtNode;
        const divElm = document.createElement("div");
        if (faceDown === 0) {
            txtNode = document.createTextNode(suit + " " + rank);
        } else {
            txtNode = document.createTextNode("");
            divElm.style.background = "#E63946";
        }

        let parentElm;

        divElm.appendChild(txtNode);
        if (player === 0) {
            elemClass = "dealerCard";
            parentClass = "dealerHand";
        } else if (player === 1) {
            elemClass = "playerCard";
            parentClass = "playerHand";
        } else {
            parentClass = "undefined";
            elemClass = "undefined";
        }
        divElm.classList.add(elemClass);
        parentElm = document.getElementById(parentClass);
        parentElm.appendChild(divElm);
    }

    /* Changes the contents of a specific card that has been placed on the table. */
    const revealDealerCard = function(gsc) {
        let suit = gsc[1].getValue().suit;
        let rank = gsc[1].getValue().rank;
        let divElm = document.getElementsByClassName('dealerCard')[1];
        divElm.style.background = "#A8DADC";
        /* Don't draw on card if it contains content */
        if (divElm.textContent === "") {
            let txtNode = document.createTextNode(suit + " " + rank);
            divElm.appendChild(txtNode);
        }
    }

    const deleteAllCardElements = function() {
        let hand;
        let playerParentElem;

        for (let i = 0; i < 2; i++) {
            if(i === 0) {
                hand = "dealerHand";
            } else if (i === 1) {
                hand = "playerHand";
            }
            playerParentElem = document.getElementById(hand);
            while (playerParentElem.firstChild) {
                playerParentElem.removeChild(playerParentElem.firstChild);
            }
        }
    }

    const setGameButtonState = function(btn1 = false, btn2 = true, btn3 = true, btn4 = true) {
            document.getElementById("btn-deal").disabled = btn1;
            document.getElementById("btn-hit").disabled = btn2;
            document.getElementById("btn-stand").disabled = btn3;
            document.getElementById("btn-resign").disabled = btn4;
    }

    const setStatusText = function(text) {
        document.getElementById('topMessageArea').innerHTML = text;
    }

    return { 
        update,
        revealDealerCard
     };

})();

export { Update };