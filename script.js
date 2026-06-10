/* =====================
   TYPEWRITER
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  const lines = [
    { id: 'line1', delay: 300 },
    { id: 'line2', delay: 700 },
    { id: 'line3', delay: 1100 },
    { id: 'line4', delay: 1500 },
  ];
  lines.forEach(({ id, delay }) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 600ms ease';
      el.style.opacity = '1';
    }, delay);
  });
});

/* =====================
   CLOCK + DATE
   ===================== */
function updateClock() {
  var timeEl = document.getElementById('timezone-time');
  var dateEl = document.getElementById('timezone-date');
  var now = new Date();

  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('el-GR', {
      timeZone: 'Europe/Athens',
      weekday: 'short',
      day:     'numeric',
      month:   'short',
      year:    'numeric',
    });
  }
}
setInterval(updateClock, 1000);
updateClock();

/* =====================
   MOBILE TAP-TO-EXPAND
   ===================== */
function buildMobileHeader(box) {
  if (box.querySelector('.mobile-header')) return; // already built
  var titleEl = box.querySelector('.box-title');
  if (!titleEl) return;

  var header = document.createElement('div');
  header.className = 'mobile-header';

  var chevron = document.createElement('span');
  chevron.className = 'mobile-chevron';
  chevron.innerHTML = '&#8964;';
  chevron.setAttribute('aria-hidden', 'true');

  titleEl.parentNode.insertBefore(header, titleEl);
  header.appendChild(titleEl);
  header.appendChild(chevron);
}

function wrapInner(box, wrapperClass) {
  if (box.querySelector('.' + wrapperClass)) return; // already wrapped
  var header = box.querySelector('.mobile-header');
  var wrapper = document.createElement('div');
  wrapper.className = wrapperClass;

  // collect all direct children that are NOT the header and NOT text nodes
  var toMove = Array.from(box.children).filter(function(c) { return c !== header; });
  toMove.forEach(function(c) { wrapper.appendChild(c); });
  box.appendChild(wrapper);
}

function initExpandable() {
  var isMobile = window.innerWidth <= 580;

  /* ── ABOUT ── */
  var aboutBox = document.querySelector('.about-box');
  if (aboutBox) {
    if (isMobile) {
      buildMobileHeader(aboutBox);
      aboutBox.onclick = function(e) {
        if (e.target.closest('a, button, .cert-clickable')) return;
        aboutBox.classList.toggle('expanded');
      };
    } else {
      aboutBox.onclick = null;
    }
  }

  /* ── CERTS ── */
  var certsBox = document.querySelector('.certs-box');
  if (certsBox) {
    if (isMobile) {
      buildMobileHeader(certsBox);
      certsBox.onclick = function(e) {
        if (e.target.closest('a, button, .cert-clickable')) return;
        certsBox.classList.toggle('expanded');
      };
    } else {
      certsBox.onclick = null;
    }
  }

  /* ── LANGUAGES ── */
  var langBox = document.querySelector('.languages-box');
  if (langBox) {
    if (isMobile) {
      buildMobileHeader(langBox);
      langBox.onclick = function(e) {
        if (e.target.closest('a, button')) return;
        langBox.classList.toggle('expanded');
      };
    } else {
      langBox.onclick = null;
    }
  }

  /* ── CONTACT ── */
  var contactBox = document.querySelector('.contact-box');
  if (contactBox) {
    if (isMobile) {
      buildMobileHeader(contactBox);
      wrapInner(contactBox, 'contact-inner');
      contactBox.onclick = function(e) {
        if (e.target.closest('a, button')) return;
        contactBox.classList.toggle('expanded');
      };
    } else {
      contactBox.onclick = null;
    }
  }

  /* ── PROJECTS ── */
  var projectBox = document.querySelector('.project-box');
  if (projectBox) {
    if (isMobile) {
      buildMobileHeader(projectBox);
      wrapInner(projectBox, 'project-inner');
      projectBox.onclick = function(e) {
        if (e.target.closest('a, button')) return;
        projectBox.classList.toggle('expanded');
      };
    } else {
      projectBox.onclick = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', initExpandable);
window.addEventListener('resize', initExpandable);
