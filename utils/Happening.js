/**
 * --> NOTE: Not currently included, as it is not finished yet, will add in a few days with many fun effects and mechanics planned <--
 * @fileoverview This file contains the Happening class, which will be used to create random effects/events in the game to spin up the basic memory game concept
 * They will happen either:
 *  - when we missmatch a pair of cards 3-4-5 times in a row depending on the game board size
 *  - after a certain amount of time has passed
 *  - after a certain amount of moves has been made
 */
class Happening {
  constructor(happeningName, ...params) {
    this.name = happeningName;
    this.happeningParameters = params;
    this.ref = document.querySelector("#activated-effect");
  }

  /**
   * @param {string | null} text
   */
  set name(text) {
    this.ref.textContent = text;
  }

  static trigger = {
    /**
     * Spawn random emojis for a few ms all over the screen like the start button
     */
    emojiSwarm: (
      targets = ["#start-button", "#score-panel", ".deck", "#board4", "#board5", "#board6", ".moves-title"],
      limit = 100
    ) => {
      this.textContent = "EMOJISWARM!";

      if (targets.length > 1) {
        targets.forEach((target) => {
          createEmojiParticles(document.querySelector(target), { number: limit });
        });
        return;
      }

      if (targets.length === 1) {
        createEmojiParticles(document.querySelector(targets), { number: limit });
        return;
      }
    },
    earthquake: () => {
      this.textContent = "EARTHQUAKE!";
      shakeElements();
    },
    negative: () => {
      this.textContent = "NEGATIVE!";
      shakeElements([document.querySelector(".moves-title"), document.querySelector(".moves")]);
    },
    flipflop: () => {
      this.textContent = "FLIP FLOP!";
      // Switch found matched tiles with unmatched ones
      const matchedTiles = document.querySelectorAll(".match");
      const unmatchedTiles = document.querySelectorAll(".card:not(.match)");

      currentlyFlipped = [];
      Array.from(matchedTiles).forEach((tile) => {
        animate({ target: tile, remove: true }, "match", "animated", "infinite", "rubberBand", "show");
      });

      Array.from(unmatchedTiles).forEach((tile) => {
        animate({ target: tile }, "match", "open", "animated", "infinite", "rubberBand");
      });

      match = document.querySelectorAll(".match").length;
      checkForWin();
    },
  };
}

export default Happening;
