import { useEffect, useRef, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

const initialCard = {
  name: 'Colin Esperanza',
  major: 'Computer Science & Engineering',
  ability: 'Inability to decide between more than one option.',
  stats: [
    { name: 'Athleticism', value: 75 },
    { name: 'Snack Power', value: 78 },
    { name: 'Fashion Power', value: 88 }
  ],
  funFacts: [
    'My favorite way to reset is a coffee, a playlist, and a completely unnecessary choice of snack.',
    'Still, I somehow always pick the same one.'
  ]
};

function Navigation() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <ul>
        <li><NavLink to="/" end>My Card</NavLink></li>
        <li><NavLink to="/support">FAQ &amp; Support</NavLink></li>
        <li><NavLink to="/tutorial">How to Play</NavLink></li>
      </ul>
    </nav>
  );
}

function WelcomeDialog() {
  const dialogRef = useRef(null);

  useEffect(() => {
    const storageKey = 'my-card-welcome-shown';
    let hasSeenWelcome = false;

    try {
      hasSeenWelcome = sessionStorage.getItem(storageKey) === 'true';
    } catch (error) {
      console.error('Unable to check whether the welcome dialog was shown this session.', error);
    }

    if (!hasSeenWelcome && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch (error) {
        console.error('Unable to remember that the welcome dialog was shown this session.', error);
      }
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="welcome-dialog"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
    >
      <h2 id="welcome-title">Welcome!</h2>
      <p id="welcome-description">
        Explore the trading card and use the navigation to find help and accessibility support.
      </p>
      <button className="help-submit" type="button" onClick={() => dialogRef.current?.close()}>
        Get started
      </button>
    </dialog>
  );
}

function Stat({ name, value, rival = false }) {
  return (
    <div className={rival ? 'rival-stat' : 'stat'}>
      <div className={rival ? 'rival-stat__row' : 'stat__row'}>
        <span>{name}</span>
        <strong>{value}</strong>
      </div>
      <div
        className={`bar${rival ? ' bar--rival' : ''}`}
        role="progressbar"
        aria-label={name}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={value}
      >
        <span
          className={`bar__fill${rival ? ' bar__fill--rival' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function TradingCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function toggleCard() {
    setIsActive((active) => !active);
    setIsFlipped((flipped) => !flipped);
  }

  return (
    <>
      <article
        className={`card${isFlipped ? ' is-flipped' : ''}${isActive ? ' is-active' : ''}`}
        aria-label={`Trading card for ${card.name}`}
        onPointerEnter={() => setIsFlipped(true)}
        onPointerLeave={() => setIsFlipped(false)}
        onClick={() => {
          setIsActive((active) => !active);
          setIsFlipped(true);
        }}
      >
        <div className="card__inner">
          <div className="card__face card__face--front" aria-hidden={isFlipped}>
            <header className="card__header">
              <span className="badge">☕ Rare</span>
              <span className="card__type">Coffee</span>
            </header>
            <div className="card__emoji" role="img" aria-label="Coffee">☕</div>
            <div className="card__art" aria-hidden="true">
              <div className="art__glow" />
              <div className="art__chip">LVL 99</div>
              <div className="art__portrait">CE</div>
            </div>
            <section className="card__body">
              <p className="eyebrow">Digital Profile</p>
              <h1>{card.name}</h1>
              <div className="info-row">
                <span className="label">Major</span>
                <span className="value">{card.major}</span>
              </div>
              <div className="info-row info-row--highlight">
                <span className="label">Special Ability</span>
                <span className="value">{card.ability}</span>
              </div>
              <div className="stats" aria-label="Power stats">
                {card.stats.map((stat) => <Stat key={stat.name} {...stat} />)}
              </div>
              <footer className="card__footer">Hand-directed by me, built with AI</footer>
            </section>
          </div>
          <div id="card-back" className="card__face card__face--back" aria-hidden={!isFlipped}>
            <div className="back__header">Fun Fact</div>
            <div className="back__content">
              {card.funFacts.map((fact) => <p key={fact}>{fact}</p>)}
            </div>
          </div>
        </div>
      </article>
      <button
        className="card-flip-control"
        type="button"
        aria-controls="card-back"
        aria-pressed={isFlipped}
        onClick={toggleCard}
      >
        Show fun fact
      </button>
    </>
  );
}

function BattlePanel({ stats }) {
  const [rivalStats, setRivalStats] = useState(null);
  const [result, setResult] = useState('Roll the dice...');
  const [announcement, setAnnouncement] = useState('Roll the dice to start a battle.');
  const [isBattling, setIsBattling] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function startBattle() {
    setIsWinning(false);
    setResult('Battle Underway!');
    setAnnouncement('Battle underway. Rolling the dice.');
    setRivalStats(null);
    setIsBattling(true);
    const rolledStats = stats.map((stat) => ({
      name: stat.name,
      value: Math.floor(Math.random() * 100) + 1
    }));

    timerRef.current = window.setTimeout(() => {
      setRivalStats(rolledStats);
      const myTotal = stats.reduce((total, stat) => total + stat.value, 0);
      const rivalTotal = rolledStats.reduce((total, stat) => total + stat.value, 0);
      const outcome = rivalTotal > myTotal ? 'You lose.' : rivalTotal === myTotal ? "It's a tie." : 'You win.';
      setResult(outcome);
      setAnnouncement(
        `Battle complete. Rival stats: ${rolledStats.map((stat) => `${stat.name} ${stat.value}`).join(', ')}. ${outcome}`
      );
      setIsWinning(true);
      setIsBattling(false);
      timerRef.current = window.setTimeout(() => setIsWinning(false), 600);
    }, 2000);
  }

  return (
    <section className="battle-panel" aria-label="Battle section">
      <button className="battle-button" type="button" disabled={isBattling} onClick={startBattle}>
        Battle!
      </button>
      <div className={`dice${isBattling ? ' is-rolling' : ''}`} aria-hidden="true">🎲</div>
      <div className="battle-summary">
        <p className="battle-label">Mysterious Rival</p>
        {isBattling || !rivalStats ? (
          <div className="battle-duel" aria-hidden="true">
            <span className="duel-spark duel-spark--left" />
            <span className="duel-avatar" aria-hidden="true">🥊</span>
            <span className="duel-spark duel-spark--right" />
          </div>
        ) : rivalStats && (
          <div className="rival-stats">
            {rivalStats.map((stat) => <Stat key={stat.name} {...stat} rival />)}
          </div>
        )}
      </div>
      <p className={`battle-result${isWinning ? ' is-winning' : ''}`} aria-hidden="true">{result}</p>
      <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}

function HomePage() {
  const [card, setCard] = useState(initialCard);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/card/', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Profile request failed (${response.status}).`);
        }
        return response.json();
      })
      .then((data) => {
        setCard(data);
        setApiError('');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Unable to load card data from the Django API.', error);
          setApiError('Could not reach the Django API. Showing the sample card instead.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <WelcomeDialog />
      <main id="main-content" className="page-shell">
        <div>
          {apiError && <p className="api-status" role="status">{apiError}</p>}
          <TradingCard card={card} />
          <BattlePanel stats={card.stats} />
        </div>
      </main>
    </>
  );
}

function SupportPage() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const fieldRefs = useRef({});

  function validate(nextValues) {
    const nextErrors = {};
    if (!nextValues.name.trim()) nextErrors.name = '▲ Please provide a name.';
    if (!nextValues.email.trim()) {
      nextErrors.email = '▲ Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextValues.email)) {
      nextErrors.email = '▲ Please provide a valid email address.';
    }
    if (!nextValues.message.trim()) nextErrors.message = '▲ Please tell us how we can help.';
    return nextErrors;
  }

  function updateField(event) {
    const nextValues = { ...values, [event.target.name]: event.target.value };
    setValues(nextValues);
    setStatus('');
    if (hasSubmitted) setErrors(validate(nextValues));
  }

  function submitForm(event) {
    event.preventDefault();
    setHasSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('');
      fieldRefs.current[Object.keys(nextErrors)[0]]?.focus();
    } else {
      setStatus('Your details are valid, but this demo form does not send messages.');
    }
  }

  return (
    <main id="main-content" className="help-page">
      <article className="help-content">
        <p className="eyebrow">Help &amp; Support</p>
        <h1>Accessibility Support</h1>
        <p>
          This page offers tips for using the site with different access needs.
          You can navigate the page using a keyboard, screen reader, or browser zoom.
        </p>
        <section aria-labelledby="keyboard-heading">
          <h2 id="keyboard-heading">Keyboard navigation</h2>
          <p>
            Press Tab to move through links and controls, and press Enter to activate a link or
            button. A visible outline marks the currently focused control.
          </p>
        </section>
        <section aria-labelledby="reading-heading">
          <h2 id="reading-heading">Making content easier to read</h2>
          <p>
            Use your browser’s zoom controls to enlarge the page. Headings and labeled navigation
            help you find and move between sections.
          </p>
        </section>
        <section aria-labelledby="feedback-heading">
          <h2 id="feedback-heading">Need more help?</h2>
          <p>
            If you encounter an accessibility barrier, please share what page you were using and
            what happened with the site owner.
          </p>
        </section>
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently asked questions</h2>
          <details>
            <summary>How can I use the site without a mouse?</summary>
            <p>Press Tab to move through links and controls, Shift+Tab to move backward, and Enter or Space to activate the focused control.</p>
          </details>
          <details>
            <summary>Can I make the text larger?</summary>
            <p>Yes. Use your browser’s zoom controls to enlarge the page while keeping the content and controls available.</p>
          </details>
          <details>
            <summary>How do I find the main sections?</summary>
            <p>Use the page headings to navigate by section, or use the main navigation links at the top of the page to move between pages.</p>
          </details>
        </section>
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact support</h2>
          <p>This demo form validates your details but does not send messages.</p>
          <form className="support-form" noValidate onSubmit={submitForm}>
            {Object.keys(errors).length > 0 && (
              <div className="form-error-banner" id="support-form-error" role="alert">
                Please correct the highlighted fields before continuing.
              </div>
            )}
            {[
              { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
              { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
              { name: 'message', label: 'How can we help?', type: 'textarea' }
            ].map((field) => (
              <div
                className={`form-field${field.name === 'message' ? ' form-field--wide' : ''}`}
                key={field.name}
              >
                <label htmlFor={`support-${field.name}`}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    ref={(element) => { fieldRefs.current[field.name] = element; }}
                    id={`support-${field.name}`}
                    name={field.name}
                    rows="4"
                    value={values[field.name]}
                    onChange={updateField}
                    aria-describedby={`support-${field.name}-error${errors[field.name] ? ' support-form-error' : ''}`}
                    aria-invalid={Boolean(errors[field.name])}
                    required
                  />
                ) : (
                  <input
                    ref={(element) => { fieldRefs.current[field.name] = element; }}
                    id={`support-${field.name}`}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={values[field.name]}
                    onChange={updateField}
                    aria-describedby={`support-${field.name}-error${errors[field.name] ? ' support-form-error' : ''}`}
                    aria-invalid={Boolean(errors[field.name])}
                    required
                  />
                )}
                <span className="field-error" id={`support-${field.name}-error`} aria-live="polite">
                  {errors[field.name]}
                </span>
              </div>
            ))}
            <button className="help-submit" type="submit">Check form</button>
            <p className="form-status" aria-live="polite">{status}</p>
          </form>
        </section>
      </article>
    </main>
  );
}

function TutorialPage() {
  const steps = [
    {
      heading: 'Explore your card',
      description: 'The front of the card shows the profile, special ability, and stats. Move your pointer over the card or activate Show fun fact to reveal the back.',
      image: 'card-profile-guide.svg',
      alt: 'Illustration of the card front, highlighting the profile, special ability, and three stat bars.',
      caption: 'Step 1: Find your profile and stats.'
    },
    {
      heading: 'Read the fun fact',
      description: 'When the card flips, read the information on its back. Activate Show fun fact again or move your pointer away to return to the front.',
      image: 'card-fun-fact-guide.svg',
      alt: 'Illustration showing the card flipping from its profile side to reveal a fun fact on the reverse.',
      caption: 'Step 2: Turn the card over to see its fun fact.'
    },
    {
      heading: 'Start a battle',
      description: 'Select the Battle button below the card. The dice roll reveals a rival’s stats and shows the battle result.',
      image: 'card-battle-guide.svg',
      alt: 'Illustration of the Battle button, a dice roll, rival stat bars, and the battle result.',
      caption: 'Step 3: Roll the dice and compare stats.'
    }
  ];

  return (
    <main id="main-content" className="help-page">
      <article className="help-content">
        <header>
          <p className="eyebrow">Visual User Guide</p>
          <h1>Trading Card Tutorial</h1>
          <p>
            Follow these steps to explore your card and start a battle. The illustrations point
            out the key details and controls at each step.
          </p>
        </header>
        <section aria-labelledby="tutorial-heading">
          <h2 id="tutorial-heading">How to use the card</h2>
          <ol className="tutorial-steps">
            {steps.map((step) => (
              <li key={step.heading}>
                <article className="tutorial-step">
                  <h3>{step.heading}</h3>
                  <p>{step.description}</p>
                  <figure className="guide-figure">
                    <img src={`/images/${step.image}`} alt={step.alt} />
                    <figcaption>{step.caption}</figcaption>
                  </figure>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </main>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="*" element={<main className="help-page"><article className="help-content"><h1>Page not found</h1><p>Use the navigation to return to the card or explore the help pages.</p></article></main>} />
      </Routes>
    </>
  );
}
