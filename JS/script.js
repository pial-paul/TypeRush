// Select DOM elements
const typingText = document.querySelector(".typing-text p"), // The paragraph with text to type
  inpField = document.querySelector(".wrapper .input-field"), // The input field where user types
  tryAgainBtn = document.querySelector(".content button"), // Button to restart the game
  timeTag = document.querySelector(".time span b"), // Displays the remaining time
  mistakeTag = document.querySelector(".mistake span"), // Displays the number of mistakes
  wpmTag = document.querySelector(".wpm span"), // Displays words per minute
  cpmTag = document.querySelector(".cpm span"); // Displays characters per minute

let timer, // Timer variable to store the interval
  maxTime = 60, // Max time for the typing test (in seconds)
  timeLeft = maxTime, // Remaining time for the test
  charIndex = (mistakes = isTyping = 0); // Variables for current character index, mistake count, and typing state

// Function to load a random paragraph from an array of paragraphs
function loadParagraph() {
  const ranIndex = Math.floor(Math.random() * paragraphs.length); // Select a random paragraph index
  typingText.innerHTML = ""; // Clear the existing text
  paragraphs[ranIndex].split("").forEach((char) => {
    let span = `<span>${char}</span>`; // Wrap each character in a span
    typingText.innerHTML += span; // Add each character to the typing area
  });
  typingText.querySelectorAll("span")[0].classList.add("active"); // Highlight the first character
  document.addEventListener("keydown", () => inpField.focus()); // Focus on input field when a key is pressed
  typingText.addEventListener("click", () => inpField.focus()); // Focus on input field when the typing text is clicked
}

// Function to initialize typing game
function initTyping() {
  let characters = typingText.querySelectorAll("span"); // Get all characters in the typing text
  let typedChar = inpField.value.split("")[charIndex]; // Get the current character typed by the user

  if (charIndex < characters.length - 1 && timeLeft > 0) {
    // If there's more text to type and time is left
    if (!isTyping) {
      // If the user hasn't started typing yet
      timer = setInterval(initTimer, 1000); // Start the timer
      isTyping = true; // Mark that typing has started
    }

    if (typedChar == null) {
      // If backspace is pressed
      if (charIndex > 0) {
        // Prevents going below index 0
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--; // Correct the mistake count if backspacing over an incorrect character
        }
        characters[charIndex].classList.remove("correct", "incorrect"); // Remove the correct/incorrect class
      }
    } else {
      // If a character is typed
      if (characters[charIndex].innerText == typedChar) {
        // If the typed character matches the target
        characters[charIndex].classList.add("correct"); // Mark the character as correct
      } else {
        // If the typed character is incorrect
        mistakes++; // Increase the mistake count
        characters[charIndex].classList.add("incorrect"); // Mark the character as incorrect
      }
      charIndex++; // Move to the next character
    }

    // Update the active character and remove active class from previous character
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    // Calculate words per minute (WPM)
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; // Prevents negative or infinite WPM

    // Update WPM, mistakes, and characters per minute (CPM)
    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
  } else {
    // If time runs out or the text is finished
    clearInterval(timer); // Stop the timer
    inpField.value = ""; // Clear the input field
  }
}

// Function to initialize the timer countdown
function initTimer() {
  if (timeLeft > 0) {
    // If there is still time left
    timeLeft--; // Decrease the time left
    timeTag.innerText = timeLeft; // Update the displayed time
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    ); // Update the WPM
    wpmTag.innerText = wpm; // Update the WPM display
  } else {
    // If time runs out
    clearInterval(timer); // Stop the timer
  }
}

// Function to reset the game
function resetGame() {
  loadParagraph(); // Load a new random paragraph
  clearInterval(timer); // Stop the timer
  timeLeft = maxTime; // Reset the time to the max value
  charIndex = mistakes = isTyping = 0; // Reset the game variables
  inpField.value = ""; // Clear the input field
  timeTag.innerText = timeLeft; // Update the displayed time
  wpmTag.innerText = 0; // Reset WPM display
  mistakeTag.innerText = 0; // Reset mistakes display
  cpmTag.innerText = 0; // Reset CPM display
}

// Start the game
loadParagraph();

// Event listener for input in the text field
inpField.addEventListener("input", initTyping);

// Event listener for the try again button
tryAgainBtn.addEventListener("click", resetGame);
