/* Website v19: FormSubmit AJAX, with explicit service confirmation. */
(() => {
  'use strict';
  const form = document.getElementById('consultation-form');
  const status = document.getElementById('form-status');
  const button = document.getElementById('send-request');
  if (!form || !status || !button) return;

  function report(message, type) {
    status.hidden = false;
    status.textContent = message;
    status.className = 'form-status ' + type;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) {
      report('Unable to send your request. Please contact Vitek directly by email.', 'error');
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    report('Sending your consultation request…', 'pending');
    try {
      const response = await fetch('https://formsubmit.co/ajax/vitpc@mail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      // Some service errors return HTTP 200 and success: "false".
      if (!response.ok || String(result.success).toLowerCase() !== 'true') {
        throw new Error('FormSubmit did not confirm delivery.');
      }
      report('Your consultation request was sent successfully. Vitek will review it and reply whether he can help and what it could cost.', 'success');
      form.reset();
    } catch (error) {
      report('Your request could not be confirmed as sent. Please try again or email vitpc@mail.com directly. Your form entries have been preserved.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Send consultation request';
    }
  });
})();
