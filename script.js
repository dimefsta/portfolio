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
});
