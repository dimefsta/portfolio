// ===== TYPEWRITER EFFECT =====
const lines = ['line1', 'line2', 'line3', 'line4'];
const delays = [0, 1.9, 3.8, 5.7];

lines.forEach((id, i) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animationDelay = delays[i] + 's';
  el.classList.add('typing-active');
  const duration = parseFloat(getComputedStyle(el).animationDuration) || 1.8;
  setTimeout(() => {
    el.classList.add('animated');
    el.classList.remove('typing-active');
  }, (delays[i] + duration) * 1000);
});

// ===== LIVE CLOCK (Athens / EEST) =====
function updateClock() {
  const el = document.getElementById('timezone-time');
  if (!el) return;
  const now = new Date();
  const opts = { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  el.textContent = new Intl.DateTimeFormat('el-GR', opts).format(now);
}
updateClock();
setInterval(updateClock, 1000);

// ===== GITHUB API DATA =====
const GITHUB_USER = 'dimefsta';

async function loadGitHubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    animateNumber('stat-repos', data.public_repos || 0);
    animateNumber('stat-followers', data.followers || 0);

    // Fetch repos to calculate total stars
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    animateNumber('stat-stars', totalStars);

    // Top language
    const langCount = {};
    repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const topLangs = Object.entries(langCount).sort((a,b) => b[1]-a[1]).slice(0,3).map(([l]) => l);
    const langEl = document.getElementById('top-lang');
    if (langEl) langEl.textContent = topLangs.length ? '🔥 Top: ' + topLangs.join(' · ') : 'No language data';

    // Load projects
    loadProjects(repos);
  } catch (e) {
    console.warn('GitHub API error:', e);
    ['stat-repos','stat-stars','stat-followers'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
    const langEl = document.getElementById('top-lang');
    if (langEl) langEl.textContent = 'Could not load stats';
  }
}

function loadProjects(repos) {
  const list = document.getElementById('projects-list');
  if (!list) return;

  const sorted = repos
    .filter(r => !r.fork && r.description)
    .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  if (!sorted.length) {
    list.innerHTML = '<div class="project-loading">No public projects yet.</div>';
    return;
  }

  list.innerHTML = sorted.map(r => `
    <a class="project-item" href="${r.html_url}" target="_blank" rel="noopener noreferrer">
      <div class="project-name">${escHtml(r.name)}</div>
      ${r.description ? `<div class="project-desc">${escHtml(r.description)}</div>` : ''}
      <div class="project-meta">
        ${r.language ? `<span class="project-lang">⬤ ${escHtml(r.language)}</span>` : ''}
        <span class="project-stars">★ ${r.stargazers_count}</span>
      </div>
    </a>
  `).join('');
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadGitHubStats();
