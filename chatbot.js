// ✅ Nebula Narrator Chatbot — FINAL with normalize for synonyms

let faqDatabase = [];

// Load FAQ JSON
async function loadFAQ() {
  const response = await fetch('data/faq.json');
  faqDatabase = await response.json();
  console.log(`Nebula Narrator: Loaded ${faqDatabase.length} Q&A pairs.`);
}

// ✅ Normalize words for synonyms
function normalize(word) {
  const synonyms = {
  "observe": "observ",
  "observing": "observ",
  "observation": "observ",
  "form": "form",
  "formed": "form",
  "formation": "form",
  "study": "study",
  "studying": "study",
  "explore": "explor",
  "exploring": "explor",
  "solar": "solar",
  "sun": "solar",
  "planet": "planet",
  "planets": "planet",
  "dwarf": "dwarf",
  "universe": "universe",
  "galaxy": "galaxy",
  "milky": "milkyway",
  "way": "milkyway",
  "stars": "star",
  "star": "star",
  "nebulae": "nebula",
  "nebula": "nebula",
  "space": "space",
  "satellite": "satellite",
  "telescope": "telescope",
  "gravity": "gravity",
  "gravitational": "gravity",
  "explosion": "explode",
  "explode": "explode",
  "exploding": "explode",
  "bigbang": "bigbang",
  "bang": "bigbang",
  "eclipse": "eclipse",
  "shadow": "shadow",
  "moon": "moon",
  "comet": "comet",
  "meteor": "meteor",
  "meteors": "meteor",
  "asteroid": "asteroid",
  "asteroids": "asteroid",
  "wind": "wind",
  "windy": "wind",
  "spacecraft": "spacecraft",
  "station": "station",
  "iss": "station",
  "orbit": "orbit",
  "orbiting": "orbit",
  "blackhole": "blackhole",
  "hole": "blackhole",
  "supernova": "supernova",
  "nova": "supernova",
  "matter": "matter",
  "dark": "dark",
  "distance": "distance",
  "distance": "distance",
  "far": "distance",
  "light": "light",
  "lightyears": "lightyear",
  "lightyear": "lightyear",
  "exoplanet": "exoplanet",
  "earth": "earth",
  "mars": "mars",
  "jupiter": "jupiter",
  "saturn": "saturn",
  "venus": "venus",
  "mercury": "mercury",
  "uranus": "uranus",
  "neptune": "neptune",
  "chandrayan": "chandrayaan",
  "chandrayaan": "chandrayaan",
  "isro": "isro",
  "luanr": "lunar",
  "lunaar": "lunar",
  "satilite": "satellite",
  "satelite": "satellite",
   "asteriod": "asteroid",
  "galaxi": "galaxy",
  "nebulla": "nebula",
  "oribit": "orbit",
  "eclpise": "eclipse",
  "ecplise": "eclipse",
  "blackhole": "blackhole",
  "blackholee": "blackhole",
  "chandrayan": "chandrayaan",
  "chandrayan1": "chandrayaan",
  "chandrayan2": "chandrayaan",
  "chandrayan3": "chandrayaan",
  "mangalyan": "mangalyaan",
  "mangalyan1": "mangalyaan",
  "aditya1": "aditya",
  "aditya-l1": "aditya",
  "astronot": "astronaut"


};

  return synonyms[word] || word;
}

// ✅ Smart matching with normalized words
function getFAQResponse(userInput) {
  const inputWords = userInput
    .toLowerCase()
    .split(/\s+/)
    .map(normalize);

  let bestMatch = null;
  let bestScore = 0;

  for (const pair of faqDatabase) {
    const questionWords = pair.question
      .toLowerCase()
      .split(/\s+/)
      .map(normalize);

    let score = 0;
    for (const word of inputWords) {
      if (questionWords.includes(word)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pair.answer;
    }
  }

  if (bestScore > 0) {
    return bestMatch;
  } else {
    return "🔭 Sorry, I don't have an answer for that yet. Try asking about planets, stars, ISRO or black holes!";
  }
}

// ✅ Setup Nebula Narrator chat interactions
function setupNebulaNarrator() {
  const logo = document.getElementById('nebula-bot-logo');
  const chatbox = document.getElementById('nebula-chatbox');
  const messages = document.getElementById('nebula-messages');
  const input = document.getElementById('nebula-input');
  const sendBtn = document.getElementById('nebula-send');

  // Open/close chat box
  logo.addEventListener('click', () => {
    chatbox.classList.toggle('hidden');
    input.focus();
  });

  function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage('You', userInput);
    const reply = getFAQResponse(userInput);
    appendMessage('Nebula Narrator', reply);
    input.value = '';
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// ✅ Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadFAQ().then(setupNebulaNarrator);
});
