// Add delays to the animation for each line
document.getElementById("line1").style.animationDelay = "0s";
document.getElementById("line2").style.animationDelay = "1s";
document.getElementById("line3").style.animationDelay = "2.2s";
document.getElementById("line4").style.animationDelay = "3.2s";

// Add and remove the 'typing-active' class for each line
function addTypingActive(line) {
  line.classList.add("typing-active");
}

function removeTypingActive(line) {
  line.classList.remove("typing-active");
  line.classList.add("animated"); // Remove blinking cursor
}

// Start typing with the active class
const lines = ["line1", "line2", "line3", "line4"];
lines.forEach((lineId) => {
  const line = document.getElementById(lineId);
  line.addEventListener("animationstart", function () {
    addTypingActive(line);
  });
  line.addEventListener("animationend", function () {
    removeTypingActive(line);
  });
});
