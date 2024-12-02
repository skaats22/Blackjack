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
let turn;
let dHand;
let pHand;
let currentDeck;

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

/*--------------- event listeners --------------*/
document.querySelector('section').addEventListener('click', handleMisclick);
stayEl.addEventListener('click', handleDealerHit);
playEl.addEventListener('click', init);
hitEl.addEventListener('click', handlePlayerHit);
betEl.addEventListener('click', updateWager);
dealEl.addEventListener('click', dealHand);

/*--------------- functions ---------------*/

function init() {
  pScore = 0;
  dScore = 0;
  purse = 100;
  currentWager = 0;
  winner = false;
  turn = 'Player';
  dHand = [];
  pHand = [];
  playEl.style.visibility = 'hidden';
  stayEl.style.visibility = 'hidden';
  hitEl.style.visibility = 'hidden';
  dealEl.style.visibility = 'visible';
  betEl.style.visibility = 'visible';
  render();
}

init();
render();

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
  if (dScore === 21 && pScore !== 21) {
    winner = true;
    // betEl.style.visibility = 'hidden';
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    dScoreEl.innerText = `Score: 21`;
    currentWagerEl.innerText = "Dealer has 21, you lose!"
    dealEl.style.visibility = 'visible';
    currentWager = 0;
    revealDealerCard();
    return purse;
  } else if (pScore === 21 && dScore !== 21) {
    winner = true;
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    currentWagerEl.innerText = `You have 21, you win $${currentWager * 1.5}!`
    purse += (currentWager + (currentWager * 1.5));
    dealEl.style.visibility = 'visible';
    currentWager = 0;
    revealDealerCard();
    return purse;
  } else if (pScore === 21 && dScore === 21) {
    winner = true;
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    currentWagerEl.innerText = `You both have 21, push!`
    purse += currentWager;
    dealEl.style.visibility = 'visible';
    revealDealerCard();
    return purse;
  } else return;
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

function checkForWinner() {
  checkFor21();
  if (turn === 'Dealer') {
    if (pScore > dScore && pScore < 21) {
      winner = true;
      currentWagerEl.innerText = `You win $${currentWager}!`
      purse += (currentWager * 2);
      turn = 'Player';
      currentWager = 0;
    } else if (dScore > pScore && dScore < 21) {
      winner = true;
      currentWagerEl.innerText = "Dealer wins!"
      turn = 'Player';
      currentWager = 0;
    } else if (pScore > 21) {
      winner = true;
      currentWagerEl.innerText = "You busted, dealer wins!"
      turn = 'Player';
      currentWager = 0;
    } else if (dScore > 21) {
      winner = true;
      purse += (currentWager * 2);
      currentWagerEl.innerText = `Dealer busted, you win $${currentWager}!`
      turn = 'Player';
      currentWager = 0;
    } else if (dScore === pScore) {
      winner = true;
      purse += currentWager;
      currentWagerEl.innerText = "Push!"
      turn = 'Player';
      currentWager = 0;
    }
  }
  if (winner === false) return;
  if (turn === 'Player' && pScore > 21) {
    winner = true;
    currentWagerEl.innerText = "You busted, dealer wins!";
    currentWager = 0;
  }
  if (winner === true){
    revealDealerCard();
    stayEl.style.visibility = 'hidden';
    hitEl.style.visibility = 'hidden';
    if (purse === 0) {
      currentWagerEl.innerText = "You ran out of money. Game over!"
      playEl.style.visibility = 'visible';
      betEl.style.visibility = 'hidden';
      dealEl.style.visibility = 'hidden';
    }
  }
  dealEl.style.visibility = 'visible'
  return purse;
}

function revealDealerCard() {
  const hiddenCardEl = document.getElementById('dealer-hidden-card');
  if (hiddenCardEl) {
    hiddenCardEl.outerHTML = `<div class="card ${dHand[0].face}"></div>`;
  }
}



function dealHand() {
  render();
  if (currentWager == 0) {
    currentWagerEl.innerText = `You must place a bet before you start.`
    betEl.style.visibility = 'visible';
  } else {
    dScore = 0;
    pScore = 0;
    dHand = [];
    pHand = [];
    dealerContainerEl.innerHTML = '';
    playerContainerEl.innerHTML = '';
    currentWagerEl.innerText = `Current Wager: $${currentWager}`;
    hitEl.style.visibility = 'visible';
    stayEl.style.visibility = 'visible';
    betEl.style.visibility = 'hidden';
    playEl.innerText = 'Reset';
    renderHand();
    checkFor21();
    
  }
}

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
        pScore = getHandTotal(pHand);
        // Only show player score
        pScoreEl.innerText = `Score: ${pScore}`;
        // }
        if (pScore >= 21) {
          hitEl.style.visibility = 'hidden';
        }
      }
    } 
    if (pScore > 21) {
      handleDealerHit();
    }
  }
  checkFor21();
  return currentDeck;
}

// Dealer has to hit on anything <= 16 until total is >=17
function handleDealerHit() {
  checkFor21();
  turn = 'Dealer';
  if (turn === 'Dealer' && pScore < 21) {
    while (dScore <= 16 && dScore !== 21) {
      const pRndIdx = Math.floor(Math.random() * currentDeck.length);
      dHand.push(currentDeck.splice(pRndIdx, 1) [0]);
      let lastIndex = dHand.length - 1;
      let newCard = dHand[lastIndex];
      dealerContainerEl.innerHTML += 
      `<div class="card ${newCard.face}"></div>` ;
      // Update dealer score
      dScore = getHandTotal(dHand);
      if (dScore > 21) {
        dScoreEl.innerText = `Score: ${dScore}`
        checkForWinner()
        return;
      }
    }
  }
  dScoreEl.innerText = `Score: ${dScore}`
  checkForWinner();
}

function handleMisclick(evt) {
  if (evt.target.class !== 'btn') return;
}

function renderHand() {
  // Creating copy of original deck
  const tempDeck = [...originalDeck];
  dealEl.style.visibility = 'hidden';
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
  // dScoreEl.innerText = `Score: ${dScore}`;
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


// If a state is true 
// Maybe there's a helper function that you can create to check something
// and trigger something, so don't have to repeat same line of code

// Current issues needing to be resolved:
// 1. Need to hit deal to reset, then bet to keep going
// 2. When dealt 2 aces, it defaults to 22 and player busts
// 3. Lots of button hiding and visibility
// 4. Don't really have a 'state' - everything is mostly hard-coded
// 5. Purse is not updating immediately after game
// 6. Score didn't reset between 