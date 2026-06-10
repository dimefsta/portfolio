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
   CLOCK
   ===================== */
function updateClock() {
  const el = document.getElementById('timezone-time');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('el-GR', {
    timeZone: 'Europe/Athens',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
setInterval(updateClock, 1000);
updateClock();

/* =====================
   MOBILE TAP-TO-EXPAND
   Handles: about, certs, languages, contact, project
   ===================== */
function initExpandable() {
  if (window.innerWidth > 580) return;

  const configs = [
    {
      boxSel:     '.about-box',
      titleSel:   '.about-content > .box-title, .about-box > .about-content > .box-title',
      rootTitle:  true,   // box-title is direct child of box (not inside content)
      innerClass: null,   // uses about-content directly
      stopSel:    'a, button, .cert-clickable',
    },
    {
      boxSel:     '.certs-box',
      rootTitle:  true,
      innerClass: null,
      stopSel:    'a, button, .cert-clickable',
    },
    {
      boxSel:     '.languages-box',
      rootTitle:  true,
      innerClass: null,
      stopSel:    'a, button',
    },
    {
      boxSel:     '.contact-box',
      rootTitle:  true,
      innerClass: 'contact-inner',
      stopSel:    'a, button',
    },
    {
      boxSel:     '.project-box',
      rootTitle:  true,
      innerClass: 'project-inner',
      stopSel:    'a, button',
    },
  ];

  configs.forEach(cfg => {
    var box = document.querySelector(cfg.boxSel);
    if (!box) return;

    // ── Build mobile-header if not present ──
    if (!box.querySelector('.mobile-header')) {
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

    // ── Wrap collapsible content if innerClass specified ──
    if (cfg.innerClass && !box.querySelector('.' + cfg.innerClass)) {
      var wrapper = document.createElement('div');
      wrapper.className = cfg.innerClass;

      var header = box.querySelector('.mobile-header');
      // move everything after the mobile-header into wrapper
      var children = Array.from(box.childNodes);
      children.forEach(function(child) {
        if (child !== header && child.nodeType !== 3 /* text */ ) {
          wrapper.appendChild(child);
        }
      });
      box.appendChild(wrapper);
    }

    // ── Toggle handler ──
    // Clone to remove any previous listeners
    var newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);

    newBox.addEventListener('click', function(e) {
      if (window.innerWidth > 580) return;
      if (cfg.stopSel && e.target.closest(cfg.stopSel)) return;
      newBox.classList.toggle('expanded');
    });
  });
}

document.addEventListener('DOMContentLoaded', initExpandable);
window.addEventListener('resize', function() {
  initExpandable();
});
