const byId = (id) => document.getElementById(id);
const status = byId('status');
const signIn = byId('sign-in');
const signOut = byId('sign-out');
const callback = new URL('/admin.html', location.origin).href;
const requestKey = 'microcd-website-admin-oauth';
const fmt = new Intl.NumberFormat();

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function endpoint(origin, path, parameters) {
  const url = new URL(path, origin);
  url.search = new URLSearchParams(parameters);
  return url.href;
}

function renderStats({ days, enquiryTrackingStart }) {
  const format = (value) => value === null ? '—' : fmt.format(value);
  for (const key of ['requests', 'enquiries']) {
    const values = days.map((day) => day[key]).filter((value) => value !== null);
    byId(key).textContent = format(values.length ? values.reduce((sum, value) => sum + value, 0) : null);
  }
  const started = new Date(enquiryTrackingStart).toISOString().replace('T', ' ').slice(0, 16);
  byId('coverage').textContent = 'Tracking began ' + started + ' UTC. Earlier dates have no total.';
  for (const day of [...days].reverse()) {
    const row = document.createElement('tr');
    const date = document.createElement('th');
    date.scope = 'row';
    date.textContent = day.date;
    row.append(date);
    for (const value of [day.requests, day.enquiries]) {
      const cell = document.createElement('td');
      cell.textContent = format(value);
      row.append(cell);
    }
    byId('days').append(row);
  }
  byId('dashboard').hidden = false;
}

async function initialize() {
  const { config } = await import('./website-admin-config.js');
  const { loginOrigin, clientId, statsEndpoint } = config;
  const parameters = new URL(location.href).searchParams;
  const code = parameters.get('code');
  const error = parameters.get('error');
  if (code || error) history.replaceState(null, '', callback);

  signIn.addEventListener('click', async () => {
    try {
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
      const state = base64url(crypto.getRandomValues(new Uint8Array(32)));
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
      sessionStorage.setItem(requestKey, JSON.stringify({ state, verifier }));
      location.assign(endpoint(loginOrigin, '/oauth2/authorize', {
        client_id: clientId, redirect_uri: callback, response_type: 'code', scope: 'openid',
        code_challenge: base64url(new Uint8Array(digest)), code_challenge_method: 'S256', state
      }));
    } catch {
      status.textContent = 'Unable to start sign-in. Please try again.';
    }
  });

  signOut.addEventListener('click', () => {
    byId('dashboard').hidden = true;
    location.replace(endpoint(loginOrigin, '/logout', { client_id: clientId, logout_uri: callback }));
  });

  status.textContent = 'Sign in with your invited administrator account.';
  signIn.hidden = false;
  if (error) {
    sessionStorage.removeItem(requestKey);
    status.textContent = 'Sign-in did not complete. Please try again.';
    return;
  }
  if (!code) return;

  const pending = JSON.parse(sessionStorage.getItem(requestKey) ?? 'null');
  sessionStorage.removeItem(requestKey);
  if (!pending || pending.state !== parameters.get('state')) {
    status.textContent = 'This sign-in request expired. Please start again.';
    return;
  }

  status.textContent = 'Loading website stats…';
  try {
    const response = await fetch(new URL('/oauth2/token', loginOrigin), {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code', client_id: clientId, code,
        redirect_uri: callback, code_verifier: pending.verifier
      }),
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Sign-in failed');
    const { access_token: accessToken } = await response.json();
    if (!accessToken) throw new Error('Sign-in failed');
    signIn.hidden = true;
    signOut.hidden = false;
    const stats = await fetch(statsEndpoint, {
      headers: { Authorization: 'Bearer ' + accessToken },
      cache: 'no-store'
    });
    if (!stats.ok) {
      status.textContent = 'Website stats are temporarily unavailable. Sign out and try again.';
      return;
    }
    renderStats(await stats.json());
    status.textContent = '';
  } catch {
    status.textContent = 'Unable to complete the request. Please try again.';
  }
}

initialize().catch(() => {
  status.textContent = 'Admin sign-in is temporarily unavailable.';
});
