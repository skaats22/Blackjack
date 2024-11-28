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
stayEl.addEventListener('click', handleDealerHit);
playEl.addEventListener('click', handlePlayerHit, render);
hitEl.addEventListener('click', handlePlayerHit);
// document.querySelector('#bet').addEventListener('click', updateWager);
betEl.addEventListener('click', updateWager);
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
render();

function render() {
  purseEl.innerText = `Purse: $${purse}`;
  currentWagerEl.innerText = `Current Wager: $${currentWager}`;
  checkFor21();
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
  if (purse === 0) {betEl.style.visibility = 'hidden'};
    }
}

function checkForWinner() {
  //if (pScore < 21) return;
  if (pScore > dScore && pScore < 21) {
    winner = true;
    currentWagerEl.innerText = "You win!"
    purse += (currentWager * 2);
    turn = 'Player';
  }
  if (dScore > pScore && dScore < 21) {
    winner = true;
    currentWagerEl.innerText = "Dealer wins!"
    purse -= currentWager;
    turn = 'Player';
  }
  if (pScore > 21) {
    winner = true;
    purse += currentWager;
    currentWagerEl.innerText = "You busted, dealer wins!"
    turn = 'Player';
  }
  if (dScore > 21) {
    winner = true;
    purse += (currentWager * 2);
    currentWagerEl.innerText = "Dealer busted, you win!"
    turn = 'Player';
  }
  if (turn === 'Dealer' && dScore === pScore) {
    winner = true;
    purse += currentWager;
    currentWagerEl.innerText = "Push!"
    turn = 'Player';
  }
  if (winner === true){
    revealDealerCard();
  }
  if (winner === false) return;
  return purse;
}

function revealDealerCard() {
  const hiddenCardEl = document.getElementById('dealer-hidden-card');
  if (hiddenCardEl === true) {
    hiddenCardEl.outerHTML = `<div class="card ${dHand[0].face}"></div>`;
  }
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
    revealDealerCard();
    return purse;
  } 
  if (pScore === 21) {
    winner = true;
    betEl.style.visibility = 'hidden';
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    currentWagerEl.innerText = "You have 21, you win!"
    purse += (currentWager * 2);
    revealDealerCard();
    return purse;
  } else return;
}


// Not sure I need this and could try to combine with another fn
function switchPlayerTurn() {
  // If the player hits stay the goes to dealer
  turn = 'Dealer';
  //allBtnEl.style.visibility = 'hidden';
}

function dealHand() {
  dScore = 0;
  pScore = 0;
  dHand = [];
  pHand = [];
  dealerContainerEl.innerHTML = '';
  playerContainerEl.innerHTML = '';
  currentWagerEl.innerText = `Current Wager: $0`;
  hitEl.style.visibility = 'visible';
  stayEl.style.visibility = 'visible';
  betEl.style.visibility = 'visible';
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
        if(pScore >= 21) {
          hitEl.style.visibility = 'hidden';
        }
        // Only show player score
        pScoreEl.innerText = `Score: ${pScore}`;
      }
    }
  }
  checkFor21()
  return currentDeck;
}

// Dealer has to hit on anything <= 16 until total is >=17
function handleDealerHit() {
  checkFor21();
  turn = 'Dealer';
  if (turn === 'Dealer') {
    while (dScore <= 16 && dScore !== 21) {
      const pRndIdx = Math.floor(Math.random() * currentDeck.length);
      dHand.push(currentDeck.splice(pRndIdx, 1) [0]);
      let lastIndex = dHand.length - 1;
      let newCard = dHand[lastIndex];
      dealerContainerEl.innerHTML += 
      `<div class="card ${newCard.face}"></div>` ;
      // Update dealer score
      dScore += newCard.value;
      if (dScore > 21) {
        checkForWinner()
        return;
      }
    }
  }
  dScore.innerText = `Score: ${dScore}`
  checkForWinner();
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
  dScore = dHand[0].value + dHand[1].value;
  // Only show player score
  pScoreEl.innerText = `Score: ${pScore}`;
  // Show dealer score for testing
  dScoreEl.innerText = `Score: ${dScore}`;
  // Render initial cards on the table (except first dealer card)
  dealerContainerEl.innerHTML = `<img src="css/card-library/images/backs/blue.svg" alt="Blue card back" class="card-back" id="dealer-hidden-card" />`;
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