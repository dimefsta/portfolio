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
  /* Hire Me box */
  var hireBox = document.querySelector('.please-box[data-email-target]');
  if (hireBox) hireBox.setAttribute('href', 'mailto:' + email);
  /* Email social icon */
  var emailIcon = document.querySelector('.social-icon[data-email-target]');
  if (emailIcon) emailIcon.setAttribute('href', 'mailto:' + email);
  /* aria-label update */
  if (emailIcon) emailIcon.setAttribute('aria-label', 'Send email to ' + email);
  if (hireBox)  hireBox.setAttribute('aria-label',  'Hire me — send an email to ' + email);
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
      el.style.opacity = '1';
    }, item.delay);
  });

  /* Dynamic cert count */
  var certItems = document.querySelectorAll('#certs-list .cert-card');
  var count = certItems.length;
  var desktopCount = document.getElementById('cert-count-desktop');
  var mobileCount  = document.getElementById('cert-count-mobile');
  if (desktopCount) desktopCount.textContent = '(' + count + ')';
  if (mobileCount)  mobileCount.textContent  = '(' + count + ')';

  /* Cert clickable buttons — data-driven, no inline onclick */
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

  var now = new Date();
  var athens = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Athens' }));

  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
  if (dayEl)   dayEl.textContent   = String(athens.getDate()).padStart(2, '0');
  if (monthEl) monthEl.textContent = MONTHS_SHORT[athens.getMonth()];
  if (yearEl)  yearEl.textContent  = athens.getFullYear();
}

/* Pause clock when tab is hidden — saves battery on mobile */
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
  img.onerror = function () { loading.textContent = 'Could not load image.'; };
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
   MOBILE TAP-TO-EXPAND
   ===================== */
var MOBILE_BREAKPOINT = 580;
var _mobileInitMap = new WeakMap();
var _resizeTimer;

function initMobile() {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    document.querySelectorAll('.mobile-header').forEach(function (h) { h.style.display = 'none'; });
    document.querySelectorAll(
      '[id$="-title-desktop"], #about-title-desktop, #lang-title-desktop, #certs-title-desktop, #projects-title-desktop'
    ).forEach(function (el) { el.style.display = ''; });
    ['about-content', 'contact-body', 'project-body', 'certs-content', 'lang-list'].forEach(function (cls) {
      var el = document.querySelector('.' + cls);
      if (el) { el.style.maxHeight = ''; el.style.overflow = ''; }
    });
    return;
  }

  ['about-title-desktop', 'lang-title-desktop', 'certs-title-desktop', 'projects-title-desktop'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var contactDesktop = document.getElementById('contact-desktop-title');
  if (contactDesktop) contactDesktop.style.display = 'none';

  document.querySelectorAll('.mobile-header').forEach(function (h) { h.style.display = 'flex'; });

  var boxes = [
    { box: document.querySelector('.about-box'),     header: document.querySelector('.about-box .mobile-header') },
    { box: document.querySelector('.certs-box'),     header: document.querySelector('.certs-box .mobile-header') },
    { box: document.querySelector('.contact-box'),   header: document.querySelector('.contact-box .mobile-header') },
    { box: document.querySelector('.project-box'),   header: document.querySelector('.project-box .mobile-header') },
    { box: document.querySelector('.languages-box'), header: document.querySelector('.languages-box .mobile-header') },
  ];

  boxes.forEach(function (item) {
    if (!item.box || _mobileInitMap.has(item.box)) return;
    _mobileInitMap.set(item.box, true);

    if (item.header) {
      item.header.setAttribute('role', 'button');
      item.header.setAttribute('tabindex', '0');
      item.header.setAttribute('aria-expanded', 'false');
    }

    item.box.addEventListener('click', function (e) {
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      if (e.target.closest('a, button, .cert-clickable')) return;
      var expanded = item.box.classList.toggle('expanded');
      if (item.header) item.header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    if (item.header) {
      item.header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.box.click();
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', initMobile);

window.addEventListener('resize', function () {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(initMobile, 150);
});
