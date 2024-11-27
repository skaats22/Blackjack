/*--------------- constants ---------------*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', 
  '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
//renderDeckInContainer(originalDeck, document.querySelector('.dealer-cards'));

/*--------------- state variables ---------------*/
let pScore;
let dScore;
let purse;
let currentWager;
let winner;
let tie;
let turn;
let shuffledDeck;
let dHand;
let pHand;
let currentDeck;

/*--------------- cached elements  ---------------*/
let dealerContainerEl = document.querySelector('.dealer-cards');
let playerContainerEl = document.querySelector('.player-cards');

let pScoreEl = document.querySelector('#player-score');
let dScoreEl = document.querySelector('#dealer-score');

let purseEl = document.querySelector('#purse');
let currentWagerEl = document.querySelector('#wager');

let stayEl = document.querySelector('#stay');
let hitEl = document.querySelector('#hit');
let betEl = document.querySelector('#bet');

let playEl = document.querySelector('#play');

/*--------------- event listeners --------------*/
document.querySelector('section').addEventListener('click', handleClick);
document.querySelector('#stay').addEventListener('click', switchPlayerTurn);
document.querySelector('#hit').addEventListener('click', handleHit);
document.querySelector('#bet').addEventListener('click', updateWager);

/*--------------- functions ---------------*/


function init() {
  pScore = 0;
  dScore = 0;
  purse = 100;
  currentWager = 0;
  winner = false;
  tie = false;
  turn = 'Player';
  dHand = [];
  pHand = [];

  render();
}

init();

function render() {
  if (currentWager === 0){
    updateWager();
  }
  renderHand();
  checkFor21();
  handleHit();
  switchPlayerTurn();
}

function updateDeck() {

}

function checkFor21() {
  if (dScore === 21) {
    winner = true;
  }
}

function updateWager(evt) {
  if (evt.target.tagName !== 'BUTTON') return;
  if (evt.target === betEl) {
    currentWager += 10;
    purse -= 10;
    currentWagerEl.innerText = `Current Wager: $${currentWager}`;    
    purseEl.innerText = `Purse: $${purse}`;
    betEl.style.visibility = 'hidden';
  }
}

function switchPlayerTurn() {
  // If the player hits stay the goes to dealer

}

function handleHit() {
  const pRndIdx = Math.floor(Math.random() * currentDeck.length);
  pHand.push(tempDeck.splice(pRndIdx, 1) [0]);
  const dRndIdx = Math.floor(Math.random() * currentDeck.length);
  dHand.push(tempDeck.splice(dRndIdx, 1) [0]);
}

function handleClick(evt) {
  if (evt.target.tagName !== 'BUTTON') return;
  // if (evt.target.tagName === 'BUTTON') {
  //   currentWager += 10;
  //   purse -= 10;
  //   currentWagerEl.innerText = `Current Wager: $${currentWager}`;    
  //   purseEl.innerText = `Purse: $${purse}`;
  //   betEl.style.visibility = 'hidden';
  // }
  // console.log(evt.target);
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


function renderHand() {
  // Creating copy of original deck
  const tempDeck = [...originalDeck];
  // Create arrays for dealer and player hands
  // let dHand = [];
  // let pHand = [];
  // Deal player and dealer 2 random cards ensuring can't receive
  //  exact same cards
  while (dHand.length < 2) {
    const pRndIdx = Math.floor(Math.random() * tempDeck.length);
    pHand.push(tempDeck.splice(pRndIdx, 1) [0]);
    const dRndIdx = Math.floor(Math.random() * tempDeck.length);
    dHand.push(tempDeck.splice(dRndIdx, 1) [0]);
  }
  // Update player and dealer score
  pScore = pHand[0].value + pHand[1].value;
  // Only show player score
  pScoreEl.innerText = `Score: ${pScore}`;
  dScore = dHand[0].value + dHand[1].value;
  // Render initial cards on the table (except first dealer card)
  dealerContainerEl.innerHTML = `<img src="css/card-library/images/backs/blue.svg" alt="Blue card back" class="card-back" />`;
  dealerContainerEl.innerHTML += `<div class="card ${dHand[1].face}"></div>` ;
  playerContainerEl.innerHTML += `<div class="card ${pHand[0].face}"></div>` ;
  playerContainerEl.innerHTML += `<div class="card ${pHand[1].face}"></div>` ;
  currentDeck = tempDeck;
}



// Have a spceific function that clears only parts of state and 
//  not the others
// Have a full reset function that clears all state

// For ace, build in logic only if hit