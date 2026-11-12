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

export default function TutorialPage() {
  return (
    <main id="main-content" className="help-page" tabIndex={-1}>
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
