/*--------------- constants ---------------*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', 
  '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
//renderDeckInContainer(originalDeck, document.querySelector('.dealer-cards'));

/*--------------- state variables ---------------*/
let scores;
let purse;
let currentWager;
let winner;
let tie;
let turn;
let shuffledDeck;

/*--------------- cached elements  ---------------*/
let dealerContainerEl = document.querySelector('.dealer-cards');
let playerContainerEl = document.querySelector('.player-cards');

/*--------------- event listeners --------------*/


/*--------------- functions ---------------*/


function init() {
  scores = {
    pScore: 0,
    dScore: 0,
  };
  purse = 100;
  currentWager = 0;
  winner = false;
  tie = false;
  turn = 'Player';
  getNewShuffledDeck();

  render();
}

function render() {

}

function renderDeckInContainer(deck, container) {
  
  
  container.innerHTML = '';
  // Let's build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  // Or, use reduce to 'reduce' the array into a single thing - 
  //  in this case a string of HTML markup 
  // const cardsHtml = deck.reduce(function(html, card) {
  //   return html + `<div class="card ${card.face}"></div>`;
  // }, '');
  container.innerHTML = cardsHtml;
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

// Credit: Riplit
function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns 
    //  an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderHand(deck, container) {
  const tempDeck = [...originalDeck];
  let hand = [];
  while (hand.length < 2) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    hand.push(tempDeck.splice(rndIdx, 1) [0]);
  }
  console.log(hand);
}