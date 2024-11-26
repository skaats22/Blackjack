/*--------------- constants ---------------*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', 
  '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*--------------- state variables ---------------*/
let dScore;
let pScore;
let purse;
let currentWager;

/*--------------- cached elements  ---------------*/


/*--------------- event listeners --------------*/


/*--------------- functions ---------------*/


function renderHand(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml = cardsHtml + (`<div class="card ${card.face}"></div>` *2);
}

// Credit: Riplit
function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        // If rank is 'A' assign it 11 otherwise assign it 10
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}
