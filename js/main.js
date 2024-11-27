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
// Card container elements
let dealerContainerEl = document.querySelector('.dealer-cards');
let playerContainerEl = document.querySelector('.player-cards');
// Player score and dealer score elements
let pScoreEl = document.querySelector('#player-score');
let dScoreEl = document.querySelector('#dealer-score');
// Purse and wager elements
let purseEl = document.querySelector('#purse');
let currentWagerEl = document.querySelector('#wager');
// Button elements
let stayEl = document.querySelector('#stay');
let hitEl = document.querySelector('#hit');
let betEl = document.querySelector('#bet');
let playEl = document.querySelector('#play');
let allBtnEl = document.querySelectorAll('.btn');

/*--------------- event listeners --------------*/
document.querySelector('section').addEventListener('click', handleMisclick);
document.querySelector('#stay').addEventListener('click', switchPlayerTurn);
document.querySelector('#hit').addEventListener('click', handlePlayerHit);
document.querySelector('#bet').addEventListener('click', updateWager);
document.querySelector('#play').addEventListener('click', render);
document.querySelector('#deal').addEventListener('click', dealHand);

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
  purseEl.innerText = `Purse: $${purse}`;
  updateWager();
  dealHand();
  renderHand();
  checkFor21();
  handlePlayerHit();
  checkFor21();
  handleDealerHit();
  checkFor21();
  switchPlayerTurn();
  checkForWinner();
}

function checkForWinner() {
  if (pScore < 21) return;
  if (pScore > dScore) {
    winner = true;
    currentWagerEl.innerText = "You win!"
    purse += (currentWager * 2);
  } else {
    winner = true;
    currentWagerEl.innerText = "Dealer wins!"
    purse -= currentWager;
  }
}

function updateDeck() {
  // I return currentDeck when I change deck, 
  //  so don't think i need this...
}

// Check if dealer or player has 21 before continuing hand
function checkFor21() {
  if (dScore === 21) {
    winner = true;
    betEl.style.visibility = 'hidden';
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    dScoreEl.innerText = 21;
    currentWagerEl.innerText = "Dealer has 21, you lose!"
    purse -= currentWager;
    return purse;
  } else if (pScore === 21) {
    winner = true;
    betEl.style.visibility = 'hidden';
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    currentWagerEl.innerText = "You have 21, you win!"
    purse += (currentWager * 2);
    return purse;
  } else return;
}

// Bet button is visible for extra click after purse is 0 
function updateWager(evt) {
  if (purse > 0) {
    if (evt.target.id === 'bet') {
      currentWager += 10;
      purse -= 10;
      currentWagerEl.innerText = `Current Wager: $${currentWager}`;    
      purseEl.innerText = `Purse: $${purse}`;
    }
  } else if (purse === 0) {betEl.style.visibility = 'hidden'};
}

// Not sure I need this and could try to combine with another fn
function switchPlayerTurn() {
  // If the player hits stay the goes to dealer
  turn = 'Dealer';
  //allBtnEl.style.visibility = 'hidden';
}

function dealHand() {
  dHand = [];
  pHand = [];
  dealerContainerEl.innerHTML = '';
  playerContainerEl.innerHTML = '';
  renderHand();
}

// Hit button staying visible one click past 
function handlePlayerHit(evt) {
  checkFor21();
  if (turn === 'Player') {
    if (pScore < 21) {
      if (evt.target.id === 'hit') {
        const pRndIdx = Math.floor(Math.random() * currentDeck.length);
        pHand.push(currentDeck.splice(pRndIdx, 1) [0]);
        let lastIndex = pHand.length - 1;
        let newCard = pHand[lastIndex];
        playerContainerEl.innerHTML += 
          `<div class="card ${newCard.face}"></div>` ;
        // Update player and dealer score
        pScore += newCard.value;
        // Only show player score
        pScoreEl.innerText = `Score: ${pScore}`;
        return currentDeck;
      }
    } else {
      hitEl.style.visibility = 'hidden';
      return;
    }
  }
  console.log(currentDeck);
}

function handleDealerHit() {
  checkFor21();
  if (turn === 'Dealer') {
    if (dScore <= 16 && dScore !== 21) {
      const pRndIdx = Math.floor(Math.random() * currentDeck.length);
      dHand.push(currentDeck.splice(pRndIdx, 1) [0]);
      let lastIndex = dHand.length - 1;
      let newCard = dHand[lastIndex];
      dealerContainerEl.innerHTML += 
        `<div class="card ${newCard.face}"></div>` ;
      // Update player and dealer score
      dScore += newCard.value;
      // Only show player score
      return currentDeck;
    }
  }
}

// Dealer has to hit on anything <= 16 until total is >=17
function handleDealerHit() {
  
}

function handleMisclick(evt) {
  if (evt.target.class !== 'btn') return;
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
  return currentDeck;
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


// Have a spceific function that clears only parts of state and 
//  not the others
// Have a full reset function that clears all state

// For ace, build in logic only if hit