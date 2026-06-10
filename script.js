// =====================
// TYPEWRITER ANIMATION
// =====================
const lines = ['line1','line2','line3','line4'];
let currentLine = 0;

function showNextLine() {
  if (currentLine < lines.length) {
    const el = document.getElementById(lines[currentLine]);
    if (el) {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '1';
    }
    currentLine++;
    if (currentLine < lines.length) setTimeout(showNextLine, 350);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(showNextLine, 300);

  // =====================
  // LIVE CLOCK
  // =====================
  function updateClock() {
    const el = document.getElementById('timezone-time');
    if (!el) return;
    const now = new Date();
    const time = now.toLocaleTimeString('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    el.textContent = time;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // =====================
  // MOBILE TAP-TO-EXPAND
  // Injects chevron toggle into About & Certs boxes
  // Only activates when screen <= 580px
  // =====================
  function isMobile() {
    return window.innerWidth <= 580;
  }

  // Inject expand toggle row inside a box
  // Wraps existing .box-title into an .expand-toggle div with chevron
  function injectToggle(boxSelector, titleSelector) {
    var box = document.querySelector(boxSelector);
    if (!box) return;
    var title = box.querySelector(titleSelector);
    if (!title || box.querySelector('.expand-toggle')) return; // already injected

    var wrapper = document.createElement('div');
    wrapper.className = 'expand-toggle';

    var chevron = document.createElement('span');
    chevron.className = 'expand-chevron';
    chevron.innerHTML = '&#8964;'; // ⌄
    chevron.setAttribute('aria-hidden', 'true');

    title.parentNode.insertBefore(wrapper, title);
    wrapper.appendChild(title);
    wrapper.appendChild(chevron);
  }

  function setupExpandBoxes() {
    if (!isMobile()) return;

    injectToggle('.about-box', '.box-title');
    injectToggle('.certs-box', '.box-title');

    // About box toggle
    var aboutBox = document.querySelector('.about-box');
    if (aboutBox && !aboutBox._expandBound) {
      aboutBox._expandBound = true;
      aboutBox.addEventListener('click', function(e) {
        if (!isMobile()) return;
        // Don't interfere with links/buttons inside
        if (e.target.closest('a, button')) return;
        aboutBox.classList.toggle('expanded');
      });
    }

    // Certs box toggle — but NOT when clicking a cert card link/button
    var certsBox = document.querySelector('.certs-box');
    if (certsBox && !certsBox._expandBound) {
      certsBox._expandBound = true;
      certsBox.addEventListener('click', function(e) {
        if (!isMobile()) return;
        // If clicking a cert card, only expand — don't toggle shut
        if (e.target.closest('.cert-card')) {
          if (!certsBox.classList.contains('expanded')) {
            certsBox.classList.add('expanded');
          }
          return;
        }
        certsBox.classList.toggle('expanded');
      });
    }
  }

  setupExpandBoxes();

  // Re-run on resize (e.g. rotate phone)
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupExpandBoxes, 200);
  });
});
