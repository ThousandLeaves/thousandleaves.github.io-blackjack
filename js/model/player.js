/**
 * [ ] player.js
 * 
 * Player is a factory object that contains object properties for the player's hand and score.
 * We can also keep a player's name for future iterations that could add multiplayer. Both the 
 * player and dealer are considered as player objects for the purposes of processing game logic.
 */

"use strict";

export const Player = (hand, score) => {
    return {

        _hand: hand,
        _score: score = 0,
        _aceHigh: true,
        _roundsWon: 0,

        getHand() {
            return this._hand;
        },

        getScore() {
            return this._score;
        },
        
        getRoundsWon() {
            return this._roundsWon;
        },

        addScore(addAmt) {
            this._score += parseInt(addAmt);
        },

        addCard(card) {
            this._hand.push(card);
        },

        addWin() {
            this._roundsWon += 1;
        },

        removeHand() {
            this._hand = [];
        },

        /* Bit slower than addScore, only used when changing aces to low */
        recalculateScore() {
            this._score = 0;
            for (let i of this._hand) {
                this.addScore(i.getValue().points);
            }
        },

        hasNatural() {
            if (this._hand.length === 2) {
                if (this._score === 21) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // raise some issue about improper length
            }
        },

        /* Evaluate hand and adjust ace to low if high would result in loss
            Should only be called when player/dealer score > 21 */
        determineAcesValue() {
            let aceValue = "high";
            for (let i of this._hand) {
                console.log(i);
                if(i.getValue().rank === "Ace") {
                    aceValue = "low"
                    i.setAce(aceValue);
                    this.recalculateScore();
                }
            }
            if (aceValue === "low") {
                return "low";
            } else {
                 return "high";
            }
       }
    }
}