import { useRef, useState } from 'react';

export default function SupportPage() {
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
    <main id="main-content" className="help-page" tabIndex={-1}>
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
