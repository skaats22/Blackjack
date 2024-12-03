/*--------------- constants ---------------*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', 
  '10', 'J', 'Q', 'K', 'A'];

const MSG_LOOKUP = {
  null: 'Good luck!',
  'T': "It's a Push!",
  'P': 'Player Wins!',
  'D': 'Dealer Wins.',
  'PBJ': 'Player Has Blackjack!',
  'DBJ': 'Dealer Has Blackjack.'
}; 

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
//renderDeckInContainer(originalDeck, document.querySelector('.dealer-cards'));

/*--------------- state variables ---------------*/
let pScore, dScore; // Player/dealer score
let purse; // Amount of money player has
let currentWager; // Current bet
let outcome; // Result of hand
let dHand, pHand; // Player/dealer hand (arrays)
let currentDeck; // Deck for current hand 

/*--------------- cached elements  ---------------*/
// Card container elements
const dealerContainerEl = document.querySelector('.dealer-cards');
const playerContainerEl = document.querySelector('.player-cards');
// Player score and dealer score elements
const pScoreEl = document.querySelector('#player-score');
const dScoreEl = document.querySelector('#dealer-score');
// Purse and wager elements
const purseEl = document.querySelector('#purse');
const currentWagerEl = document.querySelector('#wager');
// Button elements
const stayEl = document.querySelector('#stay');
const hitEl = document.querySelector('#hit');
const betEl = document.querySelector('#bet');
const playEl = document.querySelector('#play');
const allBtnEl = document.querySelectorAll('.btn');
const dealEl = document.querySelector('#deal');
/////////////////
const handActiveEl = document.querySelectorAll('.hand-active');
const handOverEl = document.querySelectorAll('.hand-over');

const msgEl = document.getElementById('message');

/*--------------- event listeners --------------*/
document.querySelector('section').addEventListener('click', handleMisclick);
stayEl.addEventListener('click', handleDealerHit);
playEl.addEventListener('click', init);
hitEl.addEventListener('click', handlePlayerHit);
betEl.addEventListener('click', updateWager);
dealEl.addEventListener('click', dealHand);

/*--------------- functions ---------------*/

function init() {
  outcome = null;
  pScore = 0;
  dScore = 0;
  purse = 100;
  currentWager = 0;
  dHand = [];
  pHand = [];
  render();
}

init();

function renderBoard() {
  purseEl.innerText = `Purse: $${purse}`;
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  dealerContainerEl.innerHTML = '';
  playerContainerEl.innerHTML = '';
  dScore = 0;
  pScore = 0;
}

function renderControls() {
  // If hand is in play, then hide deal button, otherwise show it
  handOverEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  // If current wager is >= 10 and the hand is not in play, 
  //  the button will be visible, otherwise hidden
  dealEl.style.visibility = currentWager >= 10 && !handInPlay() ? 'visibile' : 'hidden';
  // If the hand is in play, then show handActive buttons
  handActiveEl.style.visibility = handInPlay() ? 'visibile' : 'hidden';
}

function render() {
  renderHand();
  betEl.innerHTML = currentWager;
  purseEl.innerHTML = purse;
  renderControls();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
}

function settleBet() {
  if (outcome === 'PBJ') {
    purse += currentWager + (currentWager * 1.5);
  } else if (outcome === 'P') {
    purse += bet * 2;
  }
  currentWager = 0;
}

function checkFor21() {
  if (pScore === 21) {
    outcome = 'PBJ';
  } else if (dScore === 21) {
    outcome = 'DBJ';
  }
}

// Credit Jim Clark
function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function(card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

function render() {
  purseEl.innerText = `Purse: $${purse}`;
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  dealerContainerEl.innerHTML = '';
  playerContainerEl.innerHTML = '';
  dScore = 0;
  pScore = 0;
  dScoreEl.innerText = `Score:`;
  pScoreEl.innerText = `Score:`;
}

// Check if dealer or player has 21 before continuing hand
function checkFor21() {
  if (dScore === 21 && pScore === 21) {
    outcome = 'T';
  } else if (dScore === 21) {
    outcome = 'DBJ';
  } else if (pScore === 21) {
    outcome = 'PBJ';
  } else return;
}

function checkForWinner() {
  if (pScore > 21) {
    outcome = 'D';
  } else if (dScore > 21) {
    outcome = 'P';
  } else if (pScore === dScore) {
    outcome = 'T';
  } else return;
}

function handleMessage(outcome) {
  if (outcome === )
}

function updateWager(evt) {
  if (purse > 0) {
    if (evt.target.id === 'bet') {
      console.log(evt.target.id);
      currentWager += 10;
      purse -= 10;
      currentWagerEl.innerText = `Current Wager: $${currentWager}`;    
      purseEl.innerText = `Purse: $${purse}`;
    }
  } else if (purse === 0) {betEl.style.visibility = 'hidden'};
}

function revealDealerCard() {
  const hiddenCardEl = document.getElementById('dealer-hidden-card');
  if (hiddenCardEl) {
    hiddenCardEl.outerHTML = `<div class="card ${dHand[0].face}"></div>`;
  }
}

function dealHand() {
  render();
  // Creating copy of original deck
  const tempDeck = [...originalDeck];
  // Deal player and dealer 2 random cards ensuring can't receive
  //  exact same cards
  while (dHand.length < 2) {
    const pRndIdx = Math.floor(Math.random() * tempDeck.length);
    pHand.push(tempDeck.splice(pRndIdx, 1) [0]);
    const dRndIdx = Math.floor(Math.random() * tempDeck.length);
    dHand.push(tempDeck.splice(dRndIdx, 1) [0]);
  }
  // Update player and dealer score
  pScore = getHandTotal(pHand);
  dScore = getHandTotal(dHand);
  pScoreEl.innerText = `Score: ${pScore}`;
  // Show dealer score for testing
  // Render initial cards on the table (except first dealer card)
  dealerContainerEl.innerHTML = `<img src="css/card-library/images/backs/blue.svg" alt="Blue card back" class="card-back" id="dealer-hidden-card" />`;
  dealerContainerEl.innerHTML += `<div class="card ${dHand[1].face}"></div>` ;
  playerContainerEl.innerHTML += `<div class="card ${pHand[0].face}"></div>` ;
  playerContainerEl.innerHTML += `<div class="card ${pHand[1].face}"></div>` ;
  currentDeck = tempDeck;
  renderHand();
  checkFor21();
  return currentDeck;
}

function handlePlayerHit(evt) {
  checkFor21();
  if (pScore < 21) {
    const pRndIdx = Math.floor(Math.random() * currentDeck.length);
    pHand.push(currentDeck.splice(pRndIdx, 1) [0]);
    let lastIndex = pHand.length - 1;
    let newCard = pHand[lastIndex];
    playerContainerEl.innerHTML += 
      `<div class="card ${newCard.face}"></div>` ;
    pScore = getHandTotal(pHand);
    // Only show player score
    pScoreEl.innerText = `Score: ${pScore}`;
  } 
  if (pScore > 21) {
    outcome = 'D';
    handleDealerHit();
    settleBet();
  }
  checkFor21();
  renderControls();
  return currentDeck;
}

// Dealer has to hit on anything <= 16 until total is >=17
function handleDealerHit() {
  checkFor21();
  while (dScore <= 16 && dScore !== 21) {
    const pRndIdx = Math.floor(Math.random() * currentDeck.length);
    dHand.push(currentDeck.splice(pRndIdx, 1) [0]);
    let lastIndex = dHand.length - 1;
    let newCard = dHand[lastIndex];
    dealerContainerEl.innerHTML += 
    `<div class="card ${newCard.face}"></div>` ;
    // Update dealer score
    dScore = getHandTotal(dHand);
  }
  dScoreEl.innerText = `Score: ${dScore}`
  revealDealerCard();
  checkforWinner();
}

function renderHand() {
  // Update player and dealer score
  pScore = getHandTotal(pHand);
  dScore = getHandTotal(dHand);
  pScoreEl.innerText = `Score: ${pScore}`;
  // Show dealer score for testing
  // Render initial cards on the table (except first dealer card)
  dealerContainerEl.innerHTML = `<img src="css/card-library/images/backs/blue.svg" alt="Blue card back" class="card-back" id="dealer-hidden-card" />`;
  for (let i = 1; i < dHand.length; i++) {
    dealerContainerEl.innerHTML += `<div class="card ${dHand[i].face}"></div>` ;
  }
  pHand.forEach(function(element) {
    playerContainerEl.innerHTML += `<div class="card ${pHand[element].face}"></div>` ;
  });
  checkFor21();
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

function handleMisclick(evt) {
  if (evt.target.class !== 'btn') return;
}

// Have a spceific function that clears only parts of state and 
//  not the others
// Have a full reset function that clears all state

// For ace, build in logic only if hit


// If a state is true 
// Maybe there's a helper function that you can create to check something
// and trigger something, so don't have to repeat same line of code

// Current issues needing to be resolved:
// 1. Need to hit deal to reset, then bet to keep going
// 2. When dealt 2 aces, it defaults to 22 and player busts
// 3. Lots of button hiding and visibility
// 4. Don't really have a 'state' - everything is mostly hard-coded
// 5. Purse can go below 0 if I have a 5 from a blackjack win