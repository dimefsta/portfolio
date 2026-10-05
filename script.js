/* =====================
   EMAIL OBFUSCATION
   Reconstructed at runtime — invisible to basic scrapers in source
   ===================== */
function buildEmail() {
  var u = 'just_di.e';
  var d = 'just-die';
  var t = 'com';
  return u + '@' + d + '.' + t;
}

function applyEmailLinks() {
  var email = buildEmail();
  var hireBox   = document.querySelector('.please-box[data-email-target]');
  var emailIcon = document.querySelector('.social-icon[data-email-target]');
  if (hireBox)   hireBox.setAttribute('href',       'mailto:' + email);
  if (emailIcon) emailIcon.setAttribute('href',      'mailto:' + email);
  if (emailIcon) emailIcon.setAttribute('aria-label','Send email to ' + email);
  if (hireBox)   hireBox.setAttribute('aria-label',  'Hire me — send an email to ' + email);
}

/* =====================
   TYPEWRITER FADE-IN
   ===================== */
document.addEventListener('DOMContentLoaded', function () {
  applyEmailLinks();

  var lines = [
    { id: 'line1', delay: 300 },
    { id: 'line2', delay: 700 },
    { id: 'line3', delay: 1100 },
    { id: 'line4', delay: 1500 },
  ];
  lines.forEach(function (item) {
    var el = document.getElementById(item.id);
    if (!el) return;
    setTimeout(function () {
      el.style.transition = 'opacity 600ms ease, transform 600ms ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, item.delay);
  });

  /* Dynamic cert count */
  var certItems    = document.querySelectorAll('#certs-list .cert-card');
  var count        = certItems.length;
  var desktopCount = document.getElementById('cert-count-desktop');
  if (desktopCount) desktopCount.textContent = '(' + count + ')';

  /* Cert modal triggers */
  document.querySelectorAll('.cert-clickable[data-cert-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openCertModal(btn.dataset.certSrc, btn.dataset.certTitle, btn);
    });
  });
});

/* =====================
   CLOCK + DATE + TIMEZONE (ATHENS)
   ===================== */
var MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function updateClock() {
  var timeEl  = document.getElementById('timezone-time');
  var dayEl   = document.getElementById('timezone-date-day');
  var monthEl = document.getElementById('timezone-date-month');
  var yearEl  = document.getElementById('timezone-date-year');
  var zoneEl  = document.getElementById('timezone-zone');
  var now     = new Date();

  // 24h format for Athens time
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  // Safe locale-independent date extraction via Intl formatToParts
  try {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Athens',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZoneName: 'short'
    });
    var parts = dtf.formatToParts(now);
    var dayVal = '', monthVal = '', yearVal = '', tzVal = '';
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type === 'day') dayVal = parts[i].value;
      else if (parts[i].type === 'month') monthVal = parts[i].value.toUpperCase();
      else if (parts[i].type === 'year') yearVal = parts[i].value;
      else if (parts[i].type === 'timeZoneName') tzVal = parts[i].value;
    }
    if (dayEl)   dayEl.textContent   = dayVal;
    if (monthEl) monthEl.textContent = monthVal;
    if (yearEl)  yearEl.textContent  = yearVal;
    if (zoneEl) {
      // Dynamic EET vs EEST based on Athens daylight saving
      var isSummer = tzVal === 'EEST' || tzVal.indexOf('+3') !== -1;
      zoneEl.textContent = isSummer ? 'EEST (UTC+3)' : 'EET (UTC+2)';
    }
  } catch (err) {
    if (zoneEl) zoneEl.textContent = 'Europe/Athens';
  }
}

var _clockInterval;
function startClock() { if (!_clockInterval) _clockInterval = setInterval(updateClock, 1000); }
function stopClock()  { clearInterval(_clockInterval); _clockInterval = null; }
document.addEventListener('visibilitychange', function () {
  document.hidden ? stopClock() : (updateClock(), startClock());
});
updateClock();
startClock();

/* =====================
   ACCESSIBLE MODAL FOCUS MANAGEMENT
   ===================== */
var _lastFocusedElement = null;

function trapFocus(modalEl, e) {
  if (e.key !== 'Tab') return;
  var focusables = modalEl.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusables || focusables.length === 0) return;
  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

/* =====================
   CERT MODAL
   ===================== */
function openCertModal(src, title, triggerEl) {
  _lastFocusedElement = triggerEl || document.activeElement;
  var modal   = document.getElementById('cert-modal');
  var img     = document.getElementById('cert-modal-img');
  var loading = document.getElementById('cert-modal-loading');
  if (!modal) return;

  img.style.display     = 'none';
  loading.style.display = 'block';
  loading.textContent   = 'Loading...';
  img.src               = '';

  var titleEl = document.getElementById('cert-modal-title');
  if (titleEl) titleEl.textContent = title;
  img.alt = title;

  modal.classList.add('open');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  var mainEl = document.getElementById('main-content');
  if (mainEl) mainEl.setAttribute('inert', '');

  var sheetModal = document.getElementById('bento-sheet-modal');
  if (sheetModal && sheetModal.classList.contains('open')) {
    sheetModal.setAttribute('inert', '');
  }

  var closeBtn = modal.querySelector('.cert-modal-close');
  if (closeBtn) closeBtn.focus();

  img.onload  = function () { loading.style.display = 'none'; img.style.display = 'block'; };
  img.onerror = function () { loading.textContent   = 'Could not load image.'; };
  img.src = src;
}

function closeCertModal() {
  var modal = document.getElementById('cert-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  var sheetModal = document.getElementById('bento-sheet-modal');
  var isSheetOpen = sheetModal && sheetModal.classList.contains('open');

  if (sheetModal) {
    sheetModal.removeAttribute('inert');
  }

  if (!isSheetOpen) {
    var mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.removeAttribute('inert');
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }

  if (_lastFocusedElement && typeof _lastFocusedElement.focus === 'function') {
    _lastFocusedElement.focus();
    _lastFocusedElement = null;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('cert-modal');
  if (modal) {
    var closeBtn = modal.querySelector('.cert-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCertModal);
    }
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeCertModal();
    });
    modal.addEventListener('keydown', function (e) {
      trapFocus(modal, e);
    });
  }
});

/* =====================
   BENTO SHEET MODAL (MOBILE EXPANSION)
   Clones content and strips all IDs to prevent duplicate DOM IDs
   ===================== */
function openBentoSheet(type, triggerEl) {
  _lastFocusedElement = triggerEl || document.activeElement;
  var modal   = document.getElementById('bento-sheet-modal');
  var titleEl = document.getElementById('bento-sheet-title');
  var bodyEl  = document.getElementById('bento-sheet-body');
  if (!modal || !titleEl || !bodyEl) return;

  var title = '';
  var sourceEl = null;

  if (type === 'about') {
    title = 'About Me';
    sourceEl = document.getElementById('about-content');
  } else if (type === 'projects') {
    title = 'Projects (7)';
    sourceEl = document.getElementById('project-body');
  } else if (type === 'certs') {
    title = 'Certifications (17)';
    sourceEl = document.getElementById('certs-content');
  } else if (type === 'languages') {
    title = 'Languages';
    sourceEl = document.getElementById('lang-list');
  } else if (type === 'welcome') {
    title = 'Dimitris Efstathiou';
    sourceEl = document.querySelector('.welcome-content');
  }

  titleEl.textContent = title;
  bodyEl.innerHTML = '';

  if (sourceEl) {
    // Clone node tree and strip all IDs to prevent duplicate DOM IDs
    var clone = sourceEl.cloneNode(true);
    if (clone.id) clone.removeAttribute('id');
    var elementsWithId = clone.querySelectorAll('[id]');
    for (var i = 0; i < elementsWithId.length; i++) {
      elementsWithId[i].removeAttribute('id');
    }
    while (clone.firstChild) {
      bodyEl.appendChild(clone.firstChild);
    }
  }

  // Re-attach cert-clickable triggers if certificates were loaded in the sheet
  if (type === 'certs') {
    bodyEl.querySelectorAll('.cert-clickable[data-cert-src]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openCertModal(btn.dataset.certSrc, btn.dataset.certTitle, btn);
      });
    });
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  var mainEl = document.getElementById('main-content');
  if (mainEl) mainEl.setAttribute('inert', '');

  var closeBtn = document.getElementById('bento-sheet-close');
  if (closeBtn) closeBtn.focus();
}

function closeBentoSheet() {
  var modal = document.getElementById('bento-sheet-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  var mainEl = document.getElementById('main-content');
  if (mainEl) mainEl.removeAttribute('inert');

  document.body.style.overflow = '';
  if (_lastFocusedElement && typeof _lastFocusedElement.focus === 'function') {
    _lastFocusedElement.focus();
    _lastFocusedElement = null;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Bento tile tap listeners
  document.querySelectorAll('.box[data-bento-expand]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      if (window.innerWidth > 600) return; // Only active on mobile
      
      // If user tapped a direct interactive link or button inside the box, let it execute normally
      var clickedLink = e.target.closest('a');
      var clickedBtn  = e.target.closest('button');
      if ((clickedLink && clickedLink !== box) || (clickedBtn && clickedBtn !== box)) {
        return;
      }
      
      var type = box.getAttribute('data-bento-expand');
      if (type) {
        openBentoSheet(type, box);
      }
    });
  });

  // Close sheet handlers
  var closeBtn = document.getElementById('bento-sheet-close');
  var backdrop = document.getElementById('bento-sheet-backdrop');
  var sheetModal = document.getElementById('bento-sheet-modal');

  if (closeBtn) closeBtn.addEventListener('click', closeBentoSheet);
  if (backdrop) backdrop.addEventListener('click', closeBentoSheet);
  if (sheetModal) {
    sheetModal.addEventListener('keydown', function (e) {
      trapFocus(sheetModal, e);
    });
  }
});

/* Global Escape key listener to close open modals hierarchically */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var certModal = document.getElementById('cert-modal');
    if (certModal && certModal.classList.contains('open')) {
      closeCertModal();
      return;
    }
    var sheetModal = document.getElementById('bento-sheet-modal');
    if (sheetModal && sheetModal.classList.contains('open')) {
      closeBentoSheet();
    }
  }
});
