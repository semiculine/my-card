// Card flip effect.
const card = document.querySelector('.card');

if (card) {
  card.addEventListener('pointerenter', () => {
    card.classList.add('is-flipped');
  });

  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-flipped');
  });

  card.addEventListener('click', () => {
    card.classList.toggle('is-active');
    card.classList.toggle('is-flipped');
  });
}

// Battle button: roll random stats for me and a mysterious rival.
const battleButton = document.querySelector('.battle-button');
const battleResult = document.getElementById('battle-result');
const dice = document.querySelector('.dice');

const oppAthleticism = document.getElementById('opp-athleticism');
const oppSnack = document.getElementById('opp-snack');
const oppFashion = document.getElementById('opp-fashion');

const oppAthleticismBar = document.getElementById('opp-athleticism-bar');
const oppSnackBar = document.getElementById('opp-snack-bar');
const oppFashionBar = document.getElementById('opp-fashion-bar');

if (battleButton && battleResult && dice && oppAthleticism && oppSnack && oppFashion && oppAthleticismBar && oppSnackBar && oppFashionBar) {
  battleButton.addEventListener('click', () => {
    // My own stat values.
    const myStats = {
      athleticism: 75,
      snackPower: 78,
      fashionPower: 88
    };

    // Helper function to produce a random number between 1 and 100.
    const rollStat = () => Math.floor(Math.random() * 100) + 1;

    // Random rival stats.
    const rivalStats = {
      athleticism: rollStat(),
      snackPower: rollStat(),
      fashionPower: rollStat()
    };

    // Show the rival stats and set the bars.
    oppAthleticism.textContent = rivalStats.athleticism;
    oppSnack.textContent = rivalStats.snackPower;
    oppFashion.textContent = rivalStats.fashionPower;

    oppAthleticismBar.style.width = `${rivalStats.athleticism}%`;
    oppSnackBar.style.width = `${rivalStats.snackPower}%`;
    oppFashionBar.style.width = `${rivalStats.fashionPower}%`;

    // Combine each set of numbers.
    const myTotal = myStats.athleticism + myStats.snackPower + myStats.fashionPower;
    const rivalTotal = rivalStats.athleticism + rivalStats.snackPower + rivalStats.fashionPower;

    // Decide the outcome.
    let result = 'You Win!';
    if (rivalTotal > myTotal) {
      result = 'You Lose!';
    } else if (rivalTotal === myTotal) {
      result = 'It\'s a Tie!';
    }

    // Add a quick dice animation and show the result.
    dice.style.animation = 'none';
    void dice.offsetWidth;
    dice.style.animation = 'rollDice 0.5s ease-in-out';

    battleResult.textContent = result;
    battleResult.classList.add('is-winning');

    setTimeout(() => {
      battleResult.classList.remove('is-winning');
    }, 600);
  });
}
