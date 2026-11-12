import { Link, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import TutorialPage from './pages/TutorialPage.jsx';

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

function SkipLink() {
  function focusMainContent() {
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView();
  }

  return (
    <Link className="skip-link" to="#main-content" onClick={focusMainContent}>
      Skip to main content
    </Link>
  );
}

export default function App() {
  return (
    <>
      <SkipLink />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route
          path="*"
          element={(
            <main id="main-content" className="help-page" tabIndex={-1}>
              <article className="help-content">
                <h1>Page not found</h1>
                <p>Use the navigation to return to the card or explore the help pages.</p>
              </article>
            </main>
          )}
        />
      </Routes>
    </>
  );
}
