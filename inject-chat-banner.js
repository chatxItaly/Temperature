const fs = require('fs');
const path = require('path');

const TARGET_FILE = 'index.html';
const MARKER = 'https://chatxitaly.github.io/1x1/';

const SCRIPT_TO_INJECT = `<script>
(function() {
  var style = document.createElement('style');
  style.textContent = \`
    .chat-italiane-btn {
      display: block; width: 100%; max-width: 600px;
      margin: 32px auto 0; padding: 34px 12px;
      box-sizing: border-box; background: #0757c9;
      color: #39ef7e; text-align: center;
      text-decoration: none; font-family: Arial, sans-serif;
      font-size: 30px; font-weight: bold;
      border: 6px solid #021f58; border-radius: 12px;
      box-shadow: 0 7px 0 #01143b, 0 10px 22px rgba(0,0,0,.45);
      text-shadow: 0 2px 2px rgba(0,0,0,.35);
      transition: background .15s ease, transform .15s ease;
    }
    .chat-italiane-btn:hover { background: #0868ec; }
    .chat-italiane-btn:active { transform: translateY(5px); box-shadow: 0 2px 0 #01143b; }
    @media (max-width: 420px) {
      .chat-italiane-btn { padding: 38px 5px; font-size: 28px; }
    }
  \`;
  document.head.appendChild(style);
  var banner = document.createElement('a');
  banner.href = 'https://chatxitaly.github.io/1x1/';
  banner.target = '_blank';
  banner.rel = 'noopener noreferrer';
  banner.className = 'chat-italiane-btn';
  banner.innerHTML = '&#x1F1EE;&#x1F1F9; VISITA LE CHAT ITALIANE &#x1F1EE;&#x1F1F9;';
  document.body.appendChild(banner);
})();
</script>`;

function main() {
  let filePath = path.resolve(TARGET_FILE);
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve('dist', TARGET_FILE);
  }
  if (!fs.existsSync(filePath)) {
    console.error('❌ index.html non trovato');
    process.exit(1);
  }
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html
    .replace(/https:\/\/https:\/\/chatxitaly\.github\.io\/1x1\/{1,2}/g, MARKER)
    .replace(/https:\/\/chatxitaly\.github\.io\/1x1\/{2,}/g, MARKER);

  if (html.includes(MARKER)) {
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log('ℹ️  Banner già presente: link verificato/corretto.');
    return;
  }
  const bodyCloseRegex = /<\/body>/i;
  if (bodyCloseRegex.test(html)) {
    html = html.replace(bodyCloseRegex, SCRIPT_TO_INJECT + '\n</body>');
  } else {
    html = html.trimEnd() + '\n' + SCRIPT_TO_INJECT + '\n';
  }
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('✅ Banner iniettato in:', path.relative(process.cwd(), filePath));
}

main();
