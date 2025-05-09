// rescuebot.js

const chatBox = document.getElementById('chatBox');
const chatButton = document.getElementById('botChatButton');
const chatInput = document.getElementById('chatInput');
const chatContent = document.getElementById('chatContent');
const userInput = document.getElementById('userInput');
const apiKey = "AIzaSyBx-3LSoYXKHVYhHY3WTlNIiETNdAh5j98";
let userLang = null;
let servicesData = "";
let botDataExtra = "";

chatButton.addEventListener('click', () => {
    chatBox.style.display = (chatBox.style.display === 'none') ? 'flex' : 'none';
});

document.getElementById('sendButton').addEventListener('click', async () => {
    const input = userInput.value.trim();
    if (!input) return;
    addMessage('You', input);
    const translatedInput = await translateText(input, 'en');
    const bestMatch = findBestMatch(translatedInput, servicesData + " " + botDataExtra);
    const fallback = "I'm sorry, I couldn't find an answer to that question.";
    addMessage('RescueBot', bestMatch || fallback);
    userInput.value = '';
});

document.getElementById('changeLangButton').addEventListener('click', () => {
    addMessage('RescueBot', "Please select your new language:");
    chatContent.innerHTML += `
      <div class="lang-buttons">
        <button onclick=\"setLanguage('en')\">🇬🇧 English</button>
        <button onclick=\"setLanguage('it')\">🇮🇹 Italian</button>
        <button onclick=\"setLanguage('es')\">🇪🇸 Spanish</button>
      </div>
    `;
    chatContent.scrollTop = chatContent.scrollHeight;
});

function setLanguage(lang) {
    userLang = lang;
    addMessage('RescueBot', `Great! You selected: ${lang.toUpperCase()}.`);
    addMessage('RescueBot', "Now you can ask me anything 👇");
    chatInput.style.display = 'flex';
}

function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msg.style.marginBottom = '10px';
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function findBestMatch(input, data) {
    const lines = data.split(/\n|\.|\!/);
    input = input.toLowerCase();
    for (let line of lines) {
        if (line.toLowerCase().includes(input) || input.includes(line.toLowerCase())) {
            return line.trim();
        }
    }
    return null;
}

async function translateText(text, targetLang) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ q: text, target: targetLang, format: 'text' }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data && data.data && data.data.translations && data.data.translations[0]) {
        return data.data.translations[0].translatedText;
    } else {
        throw new Error('Translation failed');
    }
}

function loadExtraData() {
    const localExtra = document.getElementById('botDataExtra');
    if (localExtra) {
        botDataExtra = localExtra.innerText.trim();
    }
}
