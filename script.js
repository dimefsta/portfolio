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
      hour12: false,
    });
  }
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('el-GR', {
      timeZone: 'Europe/Athens',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
setInterval(updateClock, 1000);
updateClock();
