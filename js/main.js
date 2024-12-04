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
const dealEl = document.querySelector('#deal');
// Message elements
const msgEl = document.getElementById('message');
const initBetEl = document.querySelector('.continue');

/*--------------- event listeners --------------*/
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
  currentWager = 0
  dHand = [];
  pHand = [];
  render();
}

function dealInit() {
  outcome = null;
  pScore = 0;
  dScore = 0;
  dHand = [];
  pHand = [];
}

init();

function renderBoard() {
  purseEl.innerText = `Purse: $${purse}`;
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  pScoreEl.innerText = `Score: ${pScore}`;
  dScoreEl.innerText = `Score:`;
  msgEl.innerText = MSG_LOOKUP[outcome];
  dealerContainerEl.innerHTML = '';
  playerContainerEl.innerHTML = '';
}

// If the pHand array has any length and outcome != null, then hand in play
function handInPlay() {
  return pHand.length && !outcome;
}

// Decide which button shows at what time
function renderControls() {
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  purseEl.innerText = `Purse: $${purse}`;
  // If current wager is >= 10 and the hand is not in play, 
  //  the button will be visible, otherwise hidden
  dealEl.style.visibility = currentWager >= 10 && !handInPlay() ? 'visible' : 'hidden';
  initBetEl.style.visibility = currentWager < 10 && !handInPlay() ? 'visible' : 'hidden';
  betEl.style.visibility = purse === 0 || handInPlay() ? 'hidden' : 'visible';
  if (purse < 10) {
    if (outcome === 'D' || outcome === 'DBJ') {
      playEl.style.visibility = 'visible';
      initBetEl.innerText = "Game Over. Reset to continue."
    }
  } else {
    playEl.style.visibility = 'hidden'
    initBetEl.innerText = "Place a bet to continue."
  }
  // If the hand is in play, then show hit & stay buttons
  hitEl.style.visibility = handInPlay() ? 'visible' : 'hidden';
  stayEl.style.visibility = handInPlay() ? 'visible' : 'hidden';
  showMsg();
}

function render() {
  currentWagerEl.innerHTML = `Current Wager: ${currentWager}`;
  purseEl.innerText = `Purse: $${purse}`;
  msgEl.innerHTML = MSG_LOOKUP[outcome];
  renderBoard();
  renderControls();
  renderHand();
}

// Credit Jim Clark
function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function (card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

// Check if dealer or player has 21 before continuing hand
function checkFor21() {
  if (dScore === 21 && pScore === 21) {
    outcome = 'T';
    revealDealerCard();
  } else if (dScore === 21) {
    outcome = 'DBJ';
    revealDealerCard();
  } else if (pScore === 21) {
    outcome = 'PBJ';
    revealDealerCard();
  }
  showMsg();
  renderControls();
}

function showMsg() {
  msgEl.innerText = MSG_LOOKUP[outcome];
}

function checkForWinner() {
  if (dScore < 21 && dScore > pScore) {
    outcome = 'D';
  } else if (pScore < 21 && pScore > dScore) {
    outcome = 'P';
  } else if (pScore === dScore) {
    outcome = 'T';
  }
  revealDealerCard();
  showMsg();
  settleBet();
}

function updateWager() {
  dealInit();
  if (purse >= 10) {
    currentWager += 10;
    purse -= 10;
  }
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  purseEl.innerText = `Purse: $${purse}`;
  renderControls()
  renderBoard();
}

function settleBet() {
  if (outcome === 'PBJ') {
    purse += currentWager + (currentWager * 1.5);
  } else if (outcome === 'P') {
    purse += currentWager * 2;
  } else if (outcome === 'T') purse += currentWager;
  currentWager = 0;
  renderControls();
}

function revealDealerCard() {
  const hiddenCardEl = document.getElementById('dealer-hidden-card');
  if (hiddenCardEl) {
    hiddenCardEl.outerHTML = `<div class="card ${dHand[0].face}"></div>`;
  }
}

function dealHand() {
  dealInit();  
  // Creating copy of original deck
  const tempDeck = [...originalDeck];
  // Deal player and dealer 2 random cards ensuring can't receive
  //  exact same cards
  while (dHand.length < 2) {
    const pRndIdx = Math.floor(Math.random() * tempDeck.length);
    pHand.push(tempDeck.splice(pRndIdx, 1)[0]);
    const dRndIdx = Math.floor(Math.random() * tempDeck.length);
    dHand.push(tempDeck.splice(dRndIdx, 1)[0]);
  }
  // Update player and dealer score
  pScore = getHandTotal(pHand);
  dScore = getHandTotal(dHand);
  pScoreEl.innerText = `Score: ${pScore}`;
  if (dScore === 21 && pScore === 21) {
    outcome = 'T';
  } else if (dScore === 21) {
    outcome = 'DBJ';
  } else if (pScore === 21) {
    outcome = 'PBJ';
  }
  if (outcome) settleBet();
  currentDeck = tempDeck;
  render();
}

function handlePlayerHit() {
  // Add random index of current deck to player hand
  const pRndIdx = Math.floor(Math.random() * currentDeck.length);
  pHand.push(currentDeck.splice(pRndIdx, 1)[0]);
  let lastIndex = pHand.length - 1;
  let newCard = pHand[lastIndex];
  playerContainerEl.innerHTML +=
    `<div class="card ${newCard.face}"></div>`;
  pScore = getHandTotal(pHand);
  // Only show player score
  pScoreEl.innerText = `Score: ${pScore}`;
  if (pScore > 21) {
    outcome = 'D';
    settleBet();
  }
  checkFor21();
}

// Dealer has to hit on anything <= 16 until total is >=17
function handleDealerHit() {
  if (pScore < 21) {
    while (dScore <= 16 && dScore !== 21) {
      const pRndIdx = Math.floor(Math.random() * currentDeck.length);
      dHand.push(currentDeck.splice(pRndIdx, 1)[0]);
      let lastIndex = dHand.length - 1;
      let newCard = dHand[lastIndex];
      dealerContainerEl.innerHTML +=
        `<div class="card ${newCard.face}"></div>`;
      dScore = getHandTotal(dHand);
    }
  }
  // Update dealer score
  dScoreEl.innerText = `Score: ${dScore}`;
  if (dScore > 21) {
    outcome = 'P';
  }
  checkFor21();
  checkForWinner();
}

function renderHand() {
  // Render initial cards on the table (except first dealer card)
  for (let i = 0; i < dHand.length; i++) {
    dealerContainerEl.innerHTML = `<img src="css/card-library/images/backs/blue.svg" alt="Blue card back" class="card-back" id="dealer-hidden-card" />`;
    dealerContainerEl.innerHTML += `<div class="card ${dHand[i].face}"></div>`;
  }
  pHand.forEach(function (element, idx) {
    playerContainerEl.innerHTML += `<div class="card ${pHand[idx].face}"></div>`;
  });
  // Update player and dealer score
  pScore = getHandTotal(pHand);
  dScore = getHandTotal(dHand);
  checkFor21();
}

// Credit: Riplit
function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
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