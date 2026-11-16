(function (root) {
  'use strict';
  function endpointURL(value) {
    try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; }
    catch { return ''; }
  }
  async function deliver(endpoint, payload, fetcher = fetch) {
    const url = endpointURL(endpoint);
    if (!url) throw new Error('Submission is not configured. Please email your inquiry instead.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetcher(url, {
        method: 'POST', credentials: 'omit', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true || typeof result.receipt !== 'string' || !result.receipt) {
        throw new Error('Submission was not confirmed. Please email your inquiry instead.');
      }
      return result;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Confirmation timed out. Your inquiry may have been received; please avoid resubmitting and contact info@microcdlabs.com if unsure.');
      throw error;
    } finally { clearTimeout(timer); }
  }
  function track(config, receipt, gtag) {
    if (typeof gtag !== 'function' || !/^AW-\d+\/[A-Za-z0-9_-]+$/.test(config.googleAdsSendTo || '')) return;
    // No contact information or message content goes to Google. Existing consent remains in force.
    gtag('event', 'conversion', {send_to: config.googleAdsSendTo, transaction_id: receipt});
  }
  const api = {endpointURL, deliver, track};
  root.MicroCDInquiryDelivery = api;
})(typeof window === 'undefined' ? globalThis : window);
