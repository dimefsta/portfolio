// ===== TYPEWRITER EFFECT =====
const lines = ['line1', 'line2', 'line3', 'line4'];
const delays = [0, 1.9, 3.8, 5.7];

lines.forEach((id, i) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animationDelay = delays[i] + 's';
  el.classList.add('typing-active');
  const duration = 2;
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

// ===== GITHUB PROJECTS =====
const GITHUB_USER = 'dimefsta';

async function loadProjects() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
    if (!res.ok) throw new Error('API error');
    const repos = await res.json();

    const sorted = repos
      .filter(r => !r.fork && r.description)
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

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
  } catch (e) {
    list.innerHTML = '<div class="project-loading">Could not load projects.</div>';
  }
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadProjects();
