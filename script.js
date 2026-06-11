/* =====================
   TYPEWRITER
   ===================== */
document.addEventListener('DOMContentLoaded', function() {
  var lines = [
    { id: 'line1', delay: 300 },
    { id: 'line2', delay: 700 },
    { id: 'line3', delay: 1100 },
    { id: 'line4', delay: 1500 },
  ];
  lines.forEach(function(item) {
    var el = document.getElementById(item.id);
    if (!el) return;
    setTimeout(function() {
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
