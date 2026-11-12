import { useEffect, useRef, useState } from 'react';

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
    <div className="card-column">
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
              <span className="badge">Rare</span>
              <span className="card__type">Coffee</span>
            </header>
            <div className="card__art" aria-hidden="true">
              <div className="art__glow" />
              <div className="art__chip">LVL 99</div>
              <div className="card__emoji">☕</div>
              <div className="art__portrait">CE</div>
            </div>
            <section className="card__body">
              <p className="eyebrow">Digital Profile</p>
              <h1>{card.name}</h1>
              <p className="card__major">
                <span>Major</span> · {card.major}
              </p>
              <section className="ability-block" aria-labelledby="ability-heading">
                <h2 id="ability-heading">Special Ability</h2>
                <p>{card.ability}</p>
              </section>
              <section className="stats" aria-label="Power stats">
                <h2 className="stats__heading">Power Stats</h2>
                {card.stats.map((stat) => <Stat key={stat.name} {...stat} />)}
              </section>
              <footer className="card__footer">NO. 001 • HAND-DIRECTED &amp; AI-BUILT</footer>
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
    </div>
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
    <>
      <section className="battle-controls" aria-label="Battle controls">
        <button className="battle-button" type="button" disabled={isBattling} onClick={startBattle}>
          Battle!
        </button>
        <div className={`dice${isBattling ? ' is-rolling' : ''}`} aria-hidden="true">🎲</div>
        <p className={`battle-result${isWinning ? ' is-winning' : ''}`} aria-hidden="true">{result}</p>
        <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </section>
      <section className="rival-card rival-panel" aria-label="Mysterious rival card">
        <div className="rival-card__inner">
          <header className="card__header">
            <span className="badge">? Rare</span>
            <span className="card__type">Rival</span>
          </header>
          {rivalStats ? (
            <div className="rival-card__body">
              <div className="rival-card__art" aria-hidden="true">
                <div className="art__glow" />
                <div className="art__portrait">?</div>
              </div>
              <p className="eyebrow">Challenger</p>
              <h2 className="rival-card__name">Mysterious Rival</h2>
              <p className="rival-card__subtitle">A new opponent has appeared.</p>
              <section className="ability-block ability-block--rival" aria-labelledby="rival-ability-heading">
                <h3 id="rival-ability-heading">Special Ability</h3>
                <p>??? — their true strengths are still a mystery.</p>
              </section>
              <section className="stats stats--rival" aria-label="Rival power stats">
                <h3 className="stats__heading">Power Stats</h3>
                {rivalStats.map((stat) => <Stat key={stat.name} {...stat} rival />)}
              </section>
            </div>
          ) : (
            <div className={`rival-card__back${isBattling ? ' is-battling' : ''}`} aria-hidden={!isBattling}>
              {isBattling ? (
                <>
                  <div className="battle-duel" aria-hidden="true">
                    <span className="duel-spark duel-spark--left" />
                    <span className="duel-avatar">🥊</span>
                    <span className="duel-spark duel-spark--right" />
                  </div>
                  <p className="rival-card__prompt">Rival approaching...</p>
                </>
              ) : (
                <div className="rival-card__ornament" aria-hidden="true">
                  <span>✦</span>
                  <strong>?</strong>
                  <span>✦</span>
                </div>
              )}
            </div>
          )}
          {!rivalStats && !isBattling && (
            <p className="rival-card__prompt">Battle to reveal your opponent</p>
          )}
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
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
      <main id="main-content" className="page-shell" tabIndex={-1}>
        {apiError && <p className="api-status" role="status">{apiError}</p>}
        <div className="battle-layout">
          <TradingCard card={card} />
          <BattlePanel stats={card.stats} />
        </div>
      </main>
    </>
  );
}
