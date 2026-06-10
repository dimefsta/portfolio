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
    el.textContent = now.toLocaleTimeString('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // =====================
  // MOBILE TAP-TO-EXPAND
  // Wraps box title in a .mobile-header div with a chevron.
  // Only runs on screens <= 580px.
  // =====================

  function isMobile() { return window.innerWidth <= 580; }

  // Wrap the existing .box-title inside a .mobile-header + add chevron
  // Only called once per box (guarded by data attribute)
  function injectMobileHeader(boxEl) {
    if (!boxEl || boxEl.dataset.mobileInit) return;
    boxEl.dataset.mobileInit = 'true';

    const titleEl = boxEl.querySelector(':scope > .about-content > .box-title, :scope > .certs-content > .box-title, :scope > .box-title');
    // We need the DIRECT child box-title of the box, not inside content wrappers
    // So we look for the first .box-title that's a direct child:
    let directTitle = null;
    for (const child of boxEl.children) {
      if (child.classList.contains('box-title')) { directTitle = child; break; }
    }
    // If title is inside about-content / certs-content, move it out
    // (In the current HTML it IS inside .about-content / .certs-content)
    // So we grab it from there:
    const contentEl = boxEl.querySelector('.about-content, .certs-content');
    if (!contentEl) return;
    const titleInContent = contentEl.querySelector('.box-title');
    if (!titleInContent) return;

    // Move title out of content wrapper
    boxEl.insertBefore(titleInContent, contentEl);

    // Wrap title + chevron in .mobile-header
    const header = document.createElement('div');
    header.className = 'mobile-header';

    const chevron = document.createElement('span');
    chevron.className = 'mobile-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '\u2304'; // ⌄ down arrow

    titleInContent.parentNode.insertBefore(header, titleInContent);
    header.appendChild(titleInContent);
    header.appendChild(chevron);
  }

  function setupExpandBoxes() {
    if (!isMobile()) return;

    const aboutBox = document.querySelector('.about-box');
    const certsBox = document.querySelector('.certs-box');

    injectMobileHeader(aboutBox);
    injectMobileHeader(certsBox);

    // Attach click handlers once
    if (aboutBox && !aboutBox._tapBound) {
      aboutBox._tapBound = true;
      aboutBox.addEventListener('click', function(e) {
        if (!isMobile()) return;
        if (e.target.closest('a, button')) return;
        aboutBox.classList.toggle('expanded');
      });
    }

    if (certsBox && !certsBox._tapBound) {
      certsBox._tapBound = true;
      certsBox.addEventListener('click', function(e) {
        if (!isMobile()) return;
        // If tapping a cert card link, just expand (don't collapse)
        if (e.target.closest('.cert-card')) {
          certsBox.classList.add('expanded');
          return;
        }
        certsBox.classList.toggle('expanded');
      });
    }
  }

  setupExpandBoxes();

  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupExpandBoxes, 200);
  });
});
