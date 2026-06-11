/* =====================
   TYPEWRITER
   ===================== */
document.addEventListener('DOMContentLoaded', function () {
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
setInterval(updateClock, 1000);
updateClock();

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
var _mobileInitMap = new WeakMap();
var _resizeTimer;

function initMobile() {
  if (window.innerWidth > 580) {
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
    { box: document.querySelector('.about-box'),     toggle: 'about-content' },
    { box: document.querySelector('.certs-box'),     toggle: 'certs-content' },
    { box: document.querySelector('.contact-box'),   toggle: 'contact-body' },
    { box: document.querySelector('.project-box'),   toggle: 'project-body' },
    { box: document.querySelector('.languages-box'), toggle: 'lang-list' },
  ];

  boxes.forEach(function (item) {
    if (!item.box || _mobileInitMap.has(item.box)) return;
    _mobileInitMap.set(item.box, true);
    item.box.addEventListener('click', function (e) {
      if (window.innerWidth > 580) return;
      if (e.target.closest('a, button, .cert-clickable')) return;
      item.box.classList.toggle('expanded');
    });
  });
}

document.addEventListener('DOMContentLoaded', initMobile);

window.addEventListener('resize', function () {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(initMobile, 150);
});
