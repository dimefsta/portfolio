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
      el.style.transition = 'opacity 600ms ease, transform 600ms ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
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
  if (!modal) return;
  img.style.display     = 'none';
  loading.style.display = 'block';
  loading.textContent   = 'Loading...';
  img.src               = '';
  document.getElementById('cert-modal-title').textContent = title;
  img.alt = title;
  modal.classList.add('open');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
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
  document.body.style.overflow = '';
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
  }
});

/* =====================
   BENTO SHEET MODAL (MOBILE EXPANSION)
   ===================== */
function openBentoSheet(type) {
  var modal   = document.getElementById('bento-sheet-modal');
  var titleEl = document.getElementById('bento-sheet-title');
  var bodyEl  = document.getElementById('bento-sheet-body');
  if (!modal || !titleEl || !bodyEl) return;

  var title = '';
  var contentHtml = '';

  if (type === 'about') {
    title = 'About Me';
    var aboutContent = document.getElementById('about-content');
    contentHtml = aboutContent ? aboutContent.innerHTML : '';
  } else if (type === 'projects') {
    title = 'Projects (7)';
    var projBody = document.getElementById('project-body');
    contentHtml = projBody ? projBody.innerHTML : '';
  } else if (type === 'certs') {
    title = 'Certifications (16)';
    var certsList = document.getElementById('certs-content');
    contentHtml = certsList ? certsList.innerHTML : '';
  } else if (type === 'languages') {
    title = 'Languages';
    var langList = document.getElementById('lang-list');
    contentHtml = langList ? langList.innerHTML : '';
  } else if (type === 'welcome') {
    title = 'Dimitris Efstathiou';
    var welcomeContent = document.querySelector('.welcome-content');
    contentHtml = welcomeContent ? welcomeContent.innerHTML : '';
  }

  titleEl.textContent = title;
  bodyEl.innerHTML = contentHtml;

  // Re-attach cert-clickable triggers if certificates were loaded in the sheet
  if (type === 'certs') {
    bodyEl.querySelectorAll('.cert-clickable[data-cert-src]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openCertModal(btn.dataset.certSrc, btn.dataset.certTitle);
      });
    });
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeBentoSheet() {
  var modal = document.getElementById('bento-sheet-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Bento tile tap listeners
  document.querySelectorAll('.box[data-bento-expand]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      if (window.innerWidth > 600) return; // Only active on mobile
      
      // If user tapped a direct interactive element inside the box, let it execute
      var clickedLink = e.target.closest('a');
      var clickedBtn  = e.target.closest('button');
      if ((clickedLink && clickedLink !== box) || (clickedBtn && clickedBtn !== box)) {
        return;
      }
      
      var type = box.getAttribute('data-bento-expand');
      if (type) {
        openBentoSheet(type);
      }
    });
  });

  // Close sheet handlers
  var closeBtn = document.getElementById('bento-sheet-close');
  var backdrop = document.getElementById('bento-sheet-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeBentoSheet);
  if (backdrop) backdrop.addEventListener('click', closeBentoSheet);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeCertModal();
    closeBentoSheet();
  }
});
