/* =====================
   EMAIL OBFUSCATION
   Reconstructed at runtime — invisible to scrapers in source
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
   TYPEWRITER
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
      el.style.transition = 'opacity 600ms ease';
      el.style.opacity    = '1';
    }, item.delay);
  });

  /* Dynamic cert count */
  var certItems    = document.querySelectorAll('#certs-list .cert-card');
  var count        = certItems.length;
  var desktopCount = document.getElementById('cert-count-desktop');
  var mobileCount  = document.getElementById('cert-count-mobile');
  if (desktopCount) desktopCount.textContent = '(' + count + ')';
  if (mobileCount)  mobileCount.textContent  = '(' + count + ')';

  /* Cert modal triggers */
  document.querySelectorAll('.cert-clickable[data-cert-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openCertModal(btn.dataset.certSrc, btn.dataset.certTitle);
    });
  });
});

/* =====================
   CLOCK + DATE
   ===================== */
var MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function updateClock() {
  var timeEl  = document.getElementById('timezone-time');
  var dayEl   = document.getElementById('timezone-date-day');
  var monthEl = document.getElementById('timezone-date-month');
  var yearEl  = document.getElementById('timezone-date-year');
  var now     = new Date();
  var athens  = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Athens' }));
  if (timeEl)  timeEl.textContent  = now.toLocaleTimeString('el-GR', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  if (dayEl)   dayEl.textContent   = String(athens.getDate()).padStart(2, '0');
  if (monthEl) monthEl.textContent = MONTHS_SHORT[athens.getMonth()];
  if (yearEl)  yearEl.textContent  = athens.getFullYear();
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
   CERT MODAL
   ===================== */
function openCertModal(src, title) {
  var modal   = document.getElementById('cert-modal');
  var img     = document.getElementById('cert-modal-img');
  var loading = document.getElementById('cert-modal-loading');
  img.style.display     = 'none';
  loading.style.display = 'block';
  loading.textContent   = 'Loading...';
  img.src               = '';
  document.getElementById('cert-modal-title').textContent = title;
  img.alt = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.querySelector('.cert-modal-close').focus();
  img.onload  = function () { loading.style.display = 'none'; img.style.display = 'block'; };
  img.onerror = function () { loading.textContent   = 'Could not load image.'; };
  img.src = src;
}

function closeCertModal() {
  document.getElementById('cert-modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeCertModal();
});

/* =====================
   MOBILE ACCORDION
   ─────────────────────
   Breakpoint matches CSS: 600px.
   Listeners are attached ONCE per header (data-mobileListenerAttached).
   On resize to desktop → remove .expanded from all boxes.
   On resize to mobile  → restore mobile-header visibility.
   ===================== */
var MOBILE_BP = 600;
var _resizeTimer;

/* All accordion box descriptors */
var BOXES = [
  { boxSel: '.about-box',     headerSel: '.about-box .mobile-header' },
  { boxSel: '.contact-box',   headerSel: '.contact-box .mobile-header' },
  { boxSel: '.project-box',   headerSel: '.project-box .mobile-header' },
  { boxSel: '.languages-box', headerSel: '.languages-box .mobile-header' },
  { boxSel: '.certs-box',     headerSel: '.certs-box .mobile-header' },
];

/* Desktop-only title IDs that should hide on mobile */
var DESKTOP_TITLE_IDS = [
  'about-title-desktop',
  'lang-title-desktop',
  'certs-title-desktop',
  'projects-title-desktop',
  'contact-desktop-title',
];

function isMobile() {
  return window.innerWidth <= MOBILE_BP;
}

function toggleBox(box, header) {
  var expanded = box.classList.toggle('expanded');
  header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function initMobile() {
  var mobile = isMobile();

  /* Show / hide desktop titles */
  DESKTOP_TITLE_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.display = mobile ? 'none' : '';
  });

  /* Show / hide mobile headers */
  BOXES.forEach(function (desc) {
    var header = document.querySelector(desc.headerSel);
    if (header) header.style.display = mobile ? 'flex' : 'none';
  });

  if (!mobile) {
    /* DESKTOP RESET: remove expanded class so CSS shows all content normally */
    BOXES.forEach(function (desc) {
      var box = document.querySelector(desc.boxSel);
      if (box) {
        box.classList.remove('expanded');
      }
    });
    return;
  }

  /* MOBILE: attach click listeners (only once per header) */
  BOXES.forEach(function (desc) {
    var box    = document.querySelector(desc.boxSel);
    var header = document.querySelector(desc.headerSel);
    if (!box || !header) return;

    /* Attach listener only once */
    if (header.dataset.mobileListenerAttached === '1') return;
    header.dataset.mobileListenerAttached = '1';

    header.setAttribute('role',         'button');
    header.setAttribute('tabindex',     '0');
    header.setAttribute('aria-expanded','false');

    header.addEventListener('click', function (e) {
      /* Guard: only act on mobile — ignore stale events on desktop */
      if (!isMobile()) return;
      e.stopPropagation();
      toggleBox(box, header);
    });

    header.addEventListener('keydown', function (e) {
      if (!isMobile()) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBox(box, header);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initMobile);

window.addEventListener('resize', function () {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(initMobile, 150);
});
