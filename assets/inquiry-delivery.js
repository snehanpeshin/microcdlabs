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
  function consultationSource(referrer, origin) {
    if (!referrer) return 'direct';
    try {
      const url = new URL(referrer);
      if (url.origin !== origin) return 'external';
      const path = url.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, '') || '/';
      if (path === '/') return 'home';
      if (['/services', '/microfluidic-consulting', '/diagnostic-cartridge-design', '/engineering-prototyping'].includes(path)) return 'services';
      if (path === '/products' || path === '/kits' || path.startsWith('/catalog/') || path.startsWith('/microfluidic-')) return 'components';
      if (path === '/clair' || path.startsWith('/clair/')) return 'clair';
      if (['/tools', '/modeler', '/analyzer', '/motor-controller', '/diagnostics', '/platform'].some(page => path === page || path.startsWith(page + '/'))) return 'tools';
      if (path === '/labops') return 'labops';
    } catch { /* unrecognized source */ }
    return 'other';
  }
  function recordInteraction(config, event, source, fetcher = fetch) {
    const url = endpointURL(config.interactionEndpoint);
    if (!url || (event !== 'start' && event !== 'submit')) return;
    // The event contains only a fixed event type and a category from consultationSource.
    return Promise.resolve().then(() => fetcher(url, {
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
      referrerPolicy: 'no-referrer',
      headers: {'Content-Type': 'text/plain'},
      body: JSON.stringify({event, source})
    })).catch(() => { /* reporting must not block form use */ });
  }
  const api = {endpointURL, deliver, track, consultationSource, recordInteraction};
  root.MicroCDInquiryDelivery = api;
})(typeof window === 'undefined' ? globalThis : window);
