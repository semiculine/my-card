// Card flip effect.
const card = document.querySelector('.card');

const welcomeStorageKey = 'my-card-welcome-shown';
let hasSeenWelcome = false;

try {
  hasSeenWelcome = sessionStorage.getItem(welcomeStorageKey) === 'true';
} catch (error) {
  console.error('Unable to check whether the welcome dialog was shown this session.', error);
}

if (!hasSeenWelcome) {
  const welcomeDialog = document.createElement('dialog');
  welcomeDialog.className = 'welcome-dialog';
  welcomeDialog.setAttribute('aria-labelledby', 'welcome-title');
  welcomeDialog.setAttribute('aria-describedby', 'welcome-description');

  const welcomeHeading = document.createElement('h2');
  welcomeHeading.id = 'welcome-title';
  welcomeHeading.textContent = 'Welcome!';

  const welcomeDescription = document.createElement('p');
  welcomeDescription.id = 'welcome-description';
  welcomeDescription.textContent =
    'Explore the trading card and use the navigation to find help and accessibility support.';

  const welcomeCloseButton = document.createElement('button');
  welcomeCloseButton.className = 'help-submit';
  welcomeCloseButton.type = 'button';
  welcomeCloseButton.textContent = 'Get started';
  welcomeCloseButton.autofocus = true;
  welcomeCloseButton.addEventListener('click', () => welcomeDialog.close());

  welcomeDialog.append(welcomeHeading, welcomeDescription, welcomeCloseButton);
  document.body.append(welcomeDialog);
  welcomeDialog.showModal();

  try {
    sessionStorage.setItem(welcomeStorageKey, 'true');
  } catch (error) {
    console.error('Unable to remember that the welcome dialog was shown this session.', error);
  }
}

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
    // Reset anything previous before starting the battle.
    battleResult.classList.remove('is-winning');
    battleResult.textContent = 'Battle Underway!';
    battleButton.disabled = true;

    const rivalStatsPanel = document.querySelector('.rival-stats');
    const battleDuel = document.querySelector('.battle-duel');

    if (rivalStatsPanel) {
      rivalStatsPanel.hidden = true;
    }

    if (battleDuel) {
      battleDuel.hidden = false;
    }

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

    // Add a quick dice animation and wait a moment before revealing the result.
    dice.style.animation = 'none';
    void dice.offsetWidth;
    dice.style.animation = 'rollDice 0.5s ease-in-out';

    setTimeout(() => {
      // Show the rival stats and bars after the fight animation.
      oppAthleticism.textContent = rivalStats.athleticism;
      oppSnack.textContent = rivalStats.snackPower;
      oppFashion.textContent = rivalStats.fashionPower;

      oppAthleticismBar.style.width = `${rivalStats.athleticism}%`;
      oppSnackBar.style.width = `${rivalStats.snackPower}%`;
      oppFashionBar.style.width = `${rivalStats.fashionPower}%`;

      if (rivalStatsPanel) {
        rivalStatsPanel.hidden = false;
      }

      if (battleDuel) {
        battleDuel.hidden = true;
      }

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

      battleResult.textContent = result;
      battleResult.classList.add('is-winning');
      battleButton.disabled = false;

      setTimeout(() => {
        battleResult.classList.remove('is-winning');
      }, 600);
    }, 2000);
  });
}

const supportForm = document.getElementById('support-form');

if (supportForm) {
  const supportFields = [
    {
      input: document.getElementById('support-name'),
      error: document.getElementById('support-name-error'),
      emptyMessage: '▲ Please provide a name.',
      invalidMessage: '▲ Please provide a name.'
    },
    {
      input: document.getElementById('support-email'),
      error: document.getElementById('support-email-error'),
      emptyMessage: '▲ Please provide an email address.',
      invalidMessage: '▲ Please provide a valid email address.'
    },
    {
      input: document.getElementById('support-message'),
      error: document.getElementById('support-message-error'),
      emptyMessage: '▲ Please tell us how we can help.',
      invalidMessage: '▲ Please tell us how we can help.'
    }
  ];
  const formErrorBanner = document.getElementById('support-form-error');
  const formStatus = document.getElementById('support-form-status');

  if (supportFields.every(({ input, error }) => input && error) && formErrorBanner && formStatus) {
    const validateField = ({ input, error, emptyMessage, invalidMessage }) => {
      const isEmpty = !input.value.trim();
      const isInvalid = isEmpty || !input.validity.valid;
      error.textContent = isInvalid ? (isEmpty ? emptyMessage : invalidMessage) : '';

      if (isInvalid) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }

      return isInvalid;
    };

    supportFields.forEach((field) => {
      const { input, error } = field;
      input.addEventListener('input', () => {
        formStatus.textContent = '';

        if (formErrorBanner.hidden) {
          error.textContent = '';
          input.removeAttribute('aria-invalid');
        } else {
          let hasInvalidFields = false;
          supportFields.forEach((field) => {
            if (validateField(field)) {
              hasInvalidFields = true;
            }
          });
          formErrorBanner.hidden = !hasInvalidFields;
        }
      });
    });

    supportForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let firstInvalidField = null;
      supportFields.forEach((field) => {
        const isInvalid = validateField(field);
        if (isInvalid) {
          firstInvalidField ??= field.input;
        }
      });

      if (firstInvalidField) {
        formErrorBanner.hidden = false;
        formStatus.textContent = '';
        firstInvalidField.focus();
        return;
      }

      formErrorBanner.hidden = true;
      formStatus.textContent =
        'Your details are valid, but this demo form does not send messages.';
    });
  }
}
