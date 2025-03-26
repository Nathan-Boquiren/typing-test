const passages = [
  `In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it. There was a man sent from God whose name was John. He came as a witness to testify concerning that light, so that through him all might believe. He himself was not the light; he came only as a witness to the light. The true light that gives light to everyone was coming into the world. He was in the world, and though the world was made through him, the world did not recognize him. He came to that which was his own, but his own did not receive him. Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God children born not of natural descent, nor of human decision or a husband's will, but born of God. The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth. (John testified concerning him. He cried out, saying, "This is the one I spoke about when I said, 'He who comes after me has surpassed me because he was before me.'") Out of his fullness we have all received grace in place of grace already given. For the law was given through Moses; grace and truth came through Jesus Christ. No one has ever seen God, but the one and only Son, who is himself God and is in closest relationship with the Father, has made him known.`,


];

const wordList = passages[Math.floor(Math.random() * passages.length)].split(/\s+/g);
const $$ = document.querySelectorAll.bind(document);

function addWords() {
  const wordSection = $$("#word-section")[0];
  wordSection.innerHTML = "";
  $$("#typebox")[0].value = "";

  for (let index = 0; index < wordList.length; index++) {
    const wordSpan = `<span>${wordList[index]}</span>`;
    wordSection.innerHTML += wordSpan;
  }

  wordSection.firstChild.classList.add("current-word");
}

const colorCurrentWord = "#dddddd";
const colorCorrectWord = "#93C572";
const colorIncorrectWord = "#e50000";

const wordData = {
  seconds: 60,
  correct: 0,
  incorrect: 0,
  total: 0,
  typed: 0,
};

function checkWord(word) {
  const wlen = word.value.length;
  const wval = word.value.trim();
  const current = $$(".current-word")[0];
  const currentSubstring = current.innerHTML.substring(0, wlen);
  const noMatch = wval !== currentSubstring;
  const emptyWords = wval === "" || currentSubstring === "";

  if (noMatch || emptyWords) {
    current.classList.add("incorrect-word-bg");
    return false;
  } else {
    current.classList.remove("incorrect-word-bg");
    return true;
  }
}

function submitWord(word) {
  const current = $$(".current-word")[0];

  if (checkWord(word)) {
    current.classList.remove("current-word");
    current.classList.add("correct-word-c");
    wordData.correct += 1;
  } else {
    current.classList.remove("current-word", "incorrect-word-bg");
    current.classList.add("incorrect-word-c");
    wordData.incorrect += 1;
  }

  wordData.total = wordData.correct + wordData.incorrect;
  current.nextSibling.classList.add("current-word");
}

function clearLine() {
  const wordSection = $$("#word-section")[0];
  const current = $$(".current-word")[0];
  const previous = current.previousSibling;
  const children = $$(".correct-word-c, .incorrect-word-c").length;

  if (current.offsetTop > previous.offsetTop) {
    for (let i = 0; i < children; i++) {
      wordSection.removeChild(wordSection.firstChild);
    }
  }
}

let typingTimer = null;
function isTimer(seconds) {
  const time = $$("#timer > span")[0].innerHTML;
  if (time === "0:00") {
    return false;
  }

  if (time === "1:00" && typingTimer === null) {
    typingTimer = window.setInterval(() => {
      if (seconds <= 0) {
        window.clearInterval(typingTimer);
      } else {
        seconds -= 1;
        const timePad = seconds < 10 ? "0" + seconds : seconds;
        $$("#timer > span")[0].innerHTML = `0:${timePad}`;
      }
    }, 1000);
  }

  return true;
}





function calculateWPM(data) {
  const { seconds, correct, incorrect, total, typed } = data;
  const minutes = seconds / 60;
  const wpm = Math.max(0, Math.ceil((typed / 5 - incorrect) / minutes));
  const accuracy = Math.ceil((correct / total) * 100);

  const results = `
    <ul id="results">
      <li>WPM: <span class="wpm-value">${wpm}</span></li>
      <li>Accuracy: <span class="wpm-value accuracy-value">${accuracy}%</span></li>
      <li id="results-stats">
        Total Words: <span>${total}</span> |
        Correct Words: <span>${correct}</span>
        <br>
        Incorrect Words: <span>${incorrect}</span> |
        Characters Typed: <span>${typed}</span>
      </li>
    </ul>
  `;

  // Set the height of word-section to auto after the test ends
  const wordSection = document.getElementById("word-section");
  wordSection.style.height = "auto";
  
  // Display results
  wordSection.innerHTML = results;

  // Add CSS class based on accuracy
  const wpmElement = document.querySelector("li:nth-child(1) .wpm-value"); // Fix to nth-child(1) if this is WPM
  if (wpmElement) {
      wpmElement.classList.add(accuracy > 80 ? "correct-word-c" : "incorrect-word-c");
  }

  // Trigger the confetti burst when results are shown
  createConfettiBurst();
}

function createConfettiBurst() {
  console.log("Confetti Burst Triggered!"); // Add this line for debugging
  for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      // Confetti logic
  }
}

function typingTest(e) {
  const SPACE = 32;
  e = e || window.event;
  const kcode = e.keyCode;
  const word = $$("#typebox")[0];

  if (word.value.match(/^\s/g)) {
    word.value = "";
    return;
  }

  const isGameover = !isTimer(wordData.seconds);
  if (isGameover) {
    calculateWPM(wordData);
    return;
  }

  checkWord(word);
  if (kcode === SPACE) {
    submitWord(word);
    clearLine();
    $$("#typebox")[0].value = "";
  }

  wordData.typed += 1;
}

function restartTest() {
  $$("#typebox")[0].value = "";
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  addWords();
});


/**
 * Adapted from https://github.com/anschwa/typing-test/
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Adam Schwartz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
