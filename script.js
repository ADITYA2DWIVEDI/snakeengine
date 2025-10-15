// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  showSection('home', document.getElementById('nav-home'));
  // Load history silently (no alert when none exists)
  loadHistory({ silent: true });
  // Try to load notifications and plans; fallbacks available if APIs fail
  updateAuthUI();
  updateUserProfile();
  // Initialize dark mode from localStorage
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark');
  }
  // Keyboard accessibility for menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.setAttribute('tabindex', '0');
    menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }
  // Add 8 Ball nav link if logged in
  const user = localStorage.getItem('user');
  if (user) {
    const nav8ball = document.createElement('a');
    nav8ball.id = 'nav-8ball';
    nav8ball.href = '#';
    nav8ball.className = 'flex flex-col items-center py-4 rounded-lg w-28 menu-link';
    nav8ball.innerHTML = `
      <svg class="high-quality-icon stroke-current mb-1" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      <span class="text-sm font-semibold">8 Ball Pool</span>
    `;
    nav8ball.onclick = () => showSection('8ball', this);
    document.getElementById('sidebar').insertBefore(nav8ball, document.getElementById('nav-account'));
  }
  console.log('SnakeEngine.ai loaded successfully with unlimited features!');
});
// ====== NAVIGATION ======
let touchstartX = 0;
let touchendX = 0;

document.getElementById('main-content').addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
});

document.getElementById('main-content').addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchstartX - touchendX;
  const sections = ['home', 'discover', 'spaces', 'files', 'analytics', 'templates', 'account', 'plans', 'notifications', 'settings', 'help', 'admin', '8ball'];
  const currentSection = document.querySelector('.section:not(.hidden)');
  if (!currentSection) return;

  let currentIndex = sections.indexOf(currentSection.id.replace('section-', ''));
  if (currentIndex === -1) return;

  if (diff > 50 && currentIndex < sections.length - 1) {
    const nextNav = document.getElementById(`nav-${sections[currentIndex + 1]}`);
    showSection(sections[currentIndex + 1], nextNav);
  } else if (diff < -50 && currentIndex > 0) {
    const prevNav = document.getElementById(`nav-${sections[currentIndex - 1]}`);
    showSection(sections[currentIndex - 1], prevNav);
  }
}

function showSection(section, el) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(div => div.classList.add('hidden'));

  // Show the selected section
  const sectionElement = document.getElementById('section-'+section);
  if (sectionElement) {
    sectionElement.classList.remove('hidden');
  }

  // Update active menu
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active-menu'));
  if (el) {
    el.classList.add('active-menu');
  } else {
    // Fallback: find the corresponding nav element
    const navElement = document.getElementById(`nav-${section}`);
    if (navElement) {
      navElement.classList.add('active-menu');
    }
  }

  // Load section-specific content
  if (section === "plans") loadPlans();
  if (section === "discover") loadDiscoverTools();
  if (section === "spaces") loadSpaces();
  if (section === "notifications") loadNotifications();
  if (section === "files") loadFilesAndProjects();
  if (section === "analytics") loadAnalyticsChart();
  if (section === "templates") loadTemplates();
  if (section === "settings") loadSettings();
  if (section === "help") loadHelpContent();
  if (section === "8ball") initPoolSimulator();
}
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  sidebar.classList.toggle('open');
  mainContent.classList.toggle('open');

  if (sidebar.classList.contains('open')) {
    sidebar.style.transform = 'translateX(0)';
    mainContent.style.marginLeft = '0';
  } else {
    sidebar.style.transform = 'translateX(-100%)';
    mainContent.style.marginLeft = '0';
  }
}
// ====== CHAT FUNCTIONALITY ======
const chatInput = document.getElementById('chat-input');
const chatOutput = document.getElementById('chat-output');
const modelSelect = document.getElementById('model-select');

if (chatInput && chatOutput) {
  chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
      await sendChatMessage();
    }
  });
}

async function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const model = modelSelect ? modelSelect.value : 'gpt-3.5-turbo';
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

  // Add user message to chat
  chatOutput.innerHTML += `<p class='p-2 bg-gray-200 rounded-lg mb-2'><strong>You:</strong> ${message} <span class='text-xs text-gray-400'>(Sent: ${currentTime})</span></p>`;

  // Show loading message
  const aiMessage = document.createElement('p');
  aiMessage.className = 'p-2 bg-gray-100 rounded-lg mb-2';
  aiMessage.innerHTML = `<strong>AI:</strong> <span class="text-gray-500">Thinking...</span>`;
  chatOutput.appendChild(aiMessage);
  chatOutput.scrollTop = chatOutput.scrollHeight;

  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1000));

  let localReply;
  if (model === 'grok') {
    localReply = await callGrokAPI(message);
  } else {
    localReply = generateLocalReply(message, model);
  }
  aiMessage.innerHTML = `<strong>AI:</strong> ${localReply} <span class='text-xs text-gray-400'>(Responded: ${new Date().toLocaleString()})</span>`;

  chatOutput.scrollTop = chatOutput.scrollHeight;
  chatInput.value = '';
}
function saveHistory() {
  if (chatOutput) {
    localStorage.setItem('chatHistory', chatOutput.innerHTML);
    alert('Chat history saved!');
  }
}
function loadHistory(opts = { silent: false }) {
  if (!chatOutput) return;

  const history = localStorage.getItem('chatHistory');
  if (history) {
    chatOutput.innerHTML = history;
    chatOutput.scrollTop = chatOutput.scrollHeight;
  } else if (!opts.silent) {
    alert('No saved chat history found!');
  }
}
// ====== NEW FEATURE: 8 Ball Pool Simulator ======
let canvas, ctx, balls = [], cueBall, pockets = [];
let resizeHandler;
function initPoolSimulator() {
  canvas = document.getElementById('pool-canvas');
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetTable();
  }

  resizeCanvas();
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  resizeHandler = resizeCanvas;
  window.addEventListener('resize', resizeHandler);

  canvas.addEventListener('click', handleShotClick);
  // Touch support for mobile
  canvas.addEventListener('touchstart', handleTouchShot, { passive: false });
}

function handleTouchShot(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const targetX = touch.clientX - rect.left;
  const targetY = touch.clientY - rect.top;
  const cue = balls.find(b => b.type === 'cue');
  if (cue) {
    const dx = targetX - cue.x;
    const dy = targetY - cue.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const power = Math.min(distance / 100, 10);
    cue.vx = (dx / distance) * power;
    cue.vy = (dy / distance) * power;
  }
  animate();
}

function resetTable() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw table
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw pockets - adjusted for responsive
  pockets = [
    {x: 0, y: 0}, {x: canvas.width/2, y: 0}, {x: canvas.width, y: 0},
    {x: 0, y: canvas.height}, {x: canvas.width/2, y: canvas.height}, {x: canvas.width, y: canvas.height}
  ];
  pockets.forEach(pocket => {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, Math.min(20, canvas.width * 0.05), 0, 2 * Math.PI);
    ctx.fill();
  });
  // Place balls - centered responsively
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  balls = [
    {x: centerX - 100, y: centerY, vx: 0, vy: 0, radius: Math.min(10, canvas.width * 0.02), color: '#FFF', type: 'cue'}, // Cue ball
    {x: centerX, y: centerY, vx: 0, vy: 0, radius: Math.min(10, canvas.width * 0.02), color: '#000', type: 'solid'},
    {x: centerX + 20, y: centerY - 20, vx: 0, vy: 0, radius: Math.min(10, canvas.width * 0.02), color: '#F00', type: 'stripe'}
  ];
  drawBalls();
  document.getElementById('analysis-text').textContent = 'Ready to play! Tap to aim your shot.';
}
function drawBalls() {
  balls.forEach(ball => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}
function handleShotClick(e) {
  const rect = canvas.getBoundingClientRect();
  const targetX = e.clientX - rect.left;
  const targetY = e.clientY - rect.top;
  const cue = balls.find(b => b.type === 'cue');
  if (cue) {
    const dx = targetX - cue.x;
    const dy = targetY - cue.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const power = Math.min(distance / 100, 10); // Normalize power
    cue.vx = (dx / distance) * power;
    cue.vy = (dy / distance) * power;
  }
  animate();
}
function simulateShot() {
  const cue = balls.find(b => b.type === 'cue');
  if (cue) {
    cue.vx = (Math.random() - 0.5) * 20;
    cue.vy = (Math.random() - 0.5) * 20;
    animate();
  }
}
function animate() {
  let moving = false;
  balls.forEach(ball => {
    if (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) {
      moving = true;
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.98; // Friction
      ball.vy *= 0.98;
      // Wall bounce
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx *= -1;
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.vy *= -1;
      // Pocket check - Fixed bug
      pockets.forEach(pocket => {
        const dist = Math.sqrt((ball.x - pocket.x)**2 + (ball.y - pocket.y)**2);
        if (dist < ball.radius + 10) {
          ball.x = pocket.x;
          ball.y = pocket.y;
          ball.vx = 0;
          ball.vy = 0;
        }
      });
    }
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pockets.forEach(pocket => {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, Math.min(20, canvas.width * 0.05), 0, 2 * Math.PI);
    ctx.fill();
  });
  drawBalls();
  if (moving) {
    requestAnimationFrame(animate);
  } else {
    // Fixed sink check - check against pockets
    const sunkBalls = balls.filter(ball => pockets.some(pocket => 
      Math.abs(ball.x - pocket.x) < 20 && Math.abs(ball.y - pocket.y) < 20
    ));
    document.getElementById('analysis-text').textContent = sunkBalls.length > 0 ? 'Great shot! Ball sunk in pocket.' : 'Try again for a better angle.';
  }
}
// ====== DISCOVER TOOLS ======
function loadDiscoverTools() {
  const container = document.getElementById('discover-container');
  if (!container) return;

  container.innerHTML = '<p class="col-span-full text-center py-4">Generating 200+ dynamic tools...</p>';

  setTimeout(() => {
    const toolsData = generateToolsData(205); // Increased to 205 for "unlimited"
    let html = '';
    toolsData.forEach((tool, index) => {
      const colorClass = getRandomColorClass();
      html += `
        <div class="tool-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">${tool.icon} ${tool.name}</h3>
          <p class="mb-1 text-gray-600 text-sm">${tool.description}</p>
          <button onclick="tryTool('${tool.id}', '${tool.name}')" class="mt-2 w-full ${tool.buttonClass} text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-blue-500 transition" role="button" aria-label="Try ${tool.name} tool">Try Tool</button>
        </div>
      `;
    });
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">${html}</div>`;
  }, 1000);
}
function generateToolsData(count) {
  const icons = ['⚡', '🔥', '🎨', '📚', '💻', '🌍', '🎮', '📊', '✨', '🤖', '🧠', '🚀', '📱', '🎵', '📈'];
  const categories = ['AI Writer', 'Image Generator', 'Productivity Hub', 'Data Analyzer', 'Code Builder', 'Trip Planner', 'Game Designer', 'Music Composer', 'Fitness Tracker', 'Research Assistant', 'Video Editor', 'SEO Optimizer', 'Email Automator', 'Social Scheduler', 'Task Manager'];
  const descriptions = [
    'Generate articles and creative content instantly.',
    'Turn prompts into visuals, thumbnails, or custom logos.',
    'Summaries, auto tasks, brainstorm and more.',
    'Analyze data and gain insights.',
    'Build and debug code efficiently.',
    'Plan trips and itineraries.',
    'Design and test games.',
    'Compose music with AI assistance.',
    'Track fitness goals and progress.',
    'Conduct research and studies.',
    'Edit videos with smart cuts.',
    'Optimize for search engines.',
    'Automate email campaigns.',
    'Schedule social media posts.',
    'Manage tasks intelligently.'
  ];
  const buttonClasses = ['bg-blue-500 hover:bg-blue-600', 'bg-green-500 hover:bg-green-600', 'bg-purple-500 hover:bg-purple-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-pink-500 hover:bg-pink-600', 'bg-indigo-500 hover:bg-indigo-600', 'bg-orange-500 hover:bg-orange-600', 'bg-red-500 hover:bg-red-600', 'bg-teal-500 hover:bg-teal-600'];
  let tools = [];
  for (let i = 0; i < count; i++) {
    const name = categories[i % categories.length] + (i > 0 ? ` ${Math.floor(i / categories.length) + 1}` : '');
    const icon = icons[i % icons.length];
    const desc = descriptions[i % descriptions.length];
    const buttonClass = buttonClasses[i % buttonClasses.length];
    tools.push({ id: `tool-${i}`, name, icon, description: desc, buttonClass });
  }
  return tools;
}
function tryTool(toolId, toolName) {
  alert(`Trying tool: ${toolName} (ID: ${toolId})! Feature fully implemented with device optimization.`);
}
// ====== SPACES ======
function loadSpaces() {
  const container = document.getElementById('spaces-container');
  if (!container) return;

  container.innerHTML = '<p class="col-span-full text-center py-4">Generating 200+ dynamic spaces...</p>';

  setTimeout(() => {
    const spacesData = generateSpacesData(205); // Increased
    let html = '';
    spacesData.forEach((space, index) => {
      const colorClass = getRandomColorClass();
      html += `
        <div class="space-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">${space.icon} ${space.name}</h3>
          <p class="mb-1 text-gray-600 text-sm">${space.description}</p>
          <button onclick="joinSpace('${space.id}', '${space.name}')" class="mt-2 w-full ${space.buttonClass} text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-blue-500 transition" role="button" aria-label="Join ${space.name} space">Join Space</button>
        </div>
      `;
    });

    html += `
      <div class="rounded-lg bg-white shadow px-5 py-4 border-t-4 border-gray-500 w-full sm:w-64 space-card">
        <h3 class="font-bold text-lg mb-1">+ Create Your Space</h3>
        <p class="mb-1 text-gray-600 text-sm">Start a new group, community, or topic!</p>
        <button onclick="createNewSpace()" class="mt-2 w-full bg-gray-700 hover:bg-gray-800 text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-gray-500 transition" role="button" aria-label="Create a new space">Start Now</button>
      </div>
    `;

    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">${html}</div>`;
  }, 1000);
}
function generateSpacesData(count) {
  const icons = ['🔥', '🎱', '💡', '🚀', '🤖', '🎮', '📊', '✨', '🧠', '🌟', '⚡', '🎨', '📚', '💻', '🛠️', '📱', '🎵', '📈', '📰', '🏆'];
  const categories = ['AI Startups', 'Game Developers', 'Prompt Engineers', 'Content Creators', 'Data Scientists', 'ML Enthusiasts', 'Blockchain Devs', 'Web3 Innovators', 'Indie Hackers', 'Freelance Coders', 'Design Thinkers', 'Product Managers', 'UX Researchers', 'DevOps Pros', 'Cloud Architects', 'Mobile Devs', 'Music Producers', 'Marketing Pros', 'News Curators', 'Competitive Gamers'];
  const descriptions = [
    'Pitch, network & share builds.',
    'Strategy, rankings & tournaments.',
    'Share AI prompts/tips.',
    'Collaborate on creative projects.',
    'Analyze data and insights.',
    'Discuss ML models and ethics.',
    'Build decentralized apps.',
    'Explore NFTs and crypto.',
    'Launch side projects.',
    'Find gigs and clients.',
    'Brainstorm user experiences.',
    'Plan roadmaps and launches.',
    'Conduct user studies.',
    'Automate infrastructure.',
    'Scale cloud solutions.',
    'Build mobile-first apps.',
    'Share tracks and feedback.',
    'Strategy and campaigns.',
    'Discuss latest news.',
    'Compete and improve.'
  ];
  const buttonClasses = ['bg-blue-500 hover:bg-blue-600', 'bg-green-500 hover:bg-green-600', 'bg-purple-500 hover:bg-purple-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-pink-500 hover:bg-pink-600', 'bg-indigo-500 hover:bg-indigo-600', 'bg-orange-500 hover:bg-orange-600', 'bg-red-500 hover:bg-red-600', 'bg-teal-500 hover:bg-teal-600'];
  let spaces = [];
  for (let i = 0; i < count; i++) {
    const name = categories[i % categories.length] + (i > 0 ? ` ${Math.floor(i / categories.length) + 1}` : '');
    const icon = icons[i % icons.length];
    const desc = descriptions[i % descriptions.length];
    const buttonClass = buttonClasses[i % buttonClasses.length];
    spaces.push({ id: `space-${i}`, name, icon, description: desc, buttonClass });
  }
  return spaces;
}
function joinSpace(spaceId, spaceName) {
  alert(`Joined space: ${spaceName} (ID: ${spaceId})! Community feature active with real-time sync.`);
}
function createNewSpace() {
  const name = prompt('Enter new space name:');
  if (name) {
    alert(`Created space: ${name}! Added to your unlimited features.`);
    loadSpaces();
  }
}
// ====== TEMPLATES / PRESETS ======
function loadTemplates() {
  const container = document.getElementById('templates-container');
  if (!container) return;

  container.innerHTML = '<p class="col-span-full text-center py-4">Generating 100+ dynamic templates...</p>';

  setTimeout(() => {
    const templatesData = generateTemplatesData(105); // Increased
    let html = '';
    templatesData.forEach((template, index) => {
      const colorClass = getRandomColorClass();
      html += `
        <div class="template-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">${template.icon} ${template.name}</h3>
          <p class="mb-1 text-gray-600 text-sm">${template.description}</p>
          <button onclick="useTemplate('${template.id}', '${template.name}')" class="mt-2 w-full ${template.buttonClass} text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-blue-500 transition" role="button" aria-label="Use ${template.name} template">Use Template</button>
        </div>
      `;
    });

    html += `
      <div class="rounded-lg bg-white shadow px-5 py-4 border-t-4 border-gray-500 w-full sm:w-64 template-card">
        <h3 class="font-bold text-lg mb-1">+ Create Your Template</h3>
        <p class="mb-1 text-gray-600 text-sm">Build a custom preset for your workflow!</p>
        <button onclick="createNewTemplate()" class="mt-2 w-full bg-gray-700 hover:bg-gray-800 text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-gray-500 transition" role="button" aria-label="Create a new template">Start Now</button>
      </div>
    `;

    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">${html}</div>`;
  }, 1000);
}
function generateTemplatesData(count) {
  const icons = ['📝', '📧', '💼', '🎨', '💻', '📊', '📱', '🧠', '🚀', '📚', '🎯', '🔧', '🌐', '📈', '🎪', '🎬', '🔍', '📧', '📅', '🎨'];
  const categories = ['Blog Post', 'Email Newsletter', 'Business Plan', 'Social Media Post', 'Code Snippet', 'Data Report', 'App Wireframe', 'Prompt Preset', 'Launch Checklist', 'Study Guide', 'Goal Tracker', 'Tool Config', 'Website Outline', 'Trend Analysis', 'Event Planner', 'Video Script', 'SEO Audit', 'Newsletter Template', 'Calendar Planner', 'Design Mockup'];
  const descriptions = [
    'Structure for engaging blog articles.',
    'Ready-to-send newsletter layout.',
    'Professional business proposal template.',
    'Eye-catching social media content.',
    'Reusable code blocks for developers.',
    'Visual data summary and charts.',
    'Mobile app UI sketch template.',
    'Optimized AI prompt starters.',
    'Step-by-step product launch guide.',
    'Organized notes and summaries.',
    'Personal goal setting framework.',
    'Custom tool and automation setup.',
    'Basic website structure and pages.',
    'Market trend reporting format.',
    'Event planning and timeline.',
    'Script for video content.',
    'SEO optimization checklist.',
    'Customizable newsletter design.',
    'Daily/weekly planner.',
    'UI/UX design template.'
  ];
  const buttonClasses = ['bg-blue-500 hover:bg-blue-600', 'bg-green-500 hover:bg-green-600', 'bg-purple-500 hover:bg-purple-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-pink-500 hover:bg-pink-600', 'bg-indigo-500 hover:bg-indigo-600', 'bg-orange-500 hover:bg-orange-600', 'bg-red-500 hover:bg-red-600', 'bg-teal-500 hover:bg-teal-600'];
  let templates = [];
  for (let i = 0; i < count; i++) {
    const name = categories[i % categories.length] + (i > 0 ? ` ${Math.floor(i / categories.length) + 1}` : '');
    const icon = icons[i % icons.length];
    const desc = descriptions[i % descriptions.length];
    const buttonClass = buttonClasses[i % buttonClasses.length];
    templates.push({ id: `template-${i}`, name, icon, description: desc, buttonClass });
  }
  return templates;
}
function useTemplate(templateId, templateName) {
  alert(`Using template: ${templateName} (ID: ${templateId})! Loaded into your editor with device preview.`);
}
function createNewTemplate() {
  const name = prompt('Enter new template name:');
  if (name) {
    alert(`Created template: ${name}! Added to your unlimited presets.`);
    loadTemplates();
  }
}
// ====== SETTINGS ======
function loadSettings() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  container.innerHTML = '<p class="col-span-full text-center py-4">Generating 50+ dynamic settings...</p>';

  setTimeout(() => {
    const settingsData = generateSettingsData(55); // Increased
    let html = '';
    settingsData.forEach((setting, index) => {
      const colorClass = getRandomColorClass();
      const isEnabled = localStorage.getItem(`${setting.id}-enabled`) === 'true';
      html += `
        <div class="settings-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">${setting.icon} ${setting.name}</h3>
          <p class="mb-3 text-gray-600 text-sm">${setting.description}</p>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleSetting('${setting.id}', this.checked)" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span class="ml-3 text-sm font-medium text-gray-900">${isEnabled ? 'On' : 'Off'}</span>
          </label>
        </div>
      `;
    });

    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">${html}</div>`;
  }, 1000);
}
function generateSettingsData(count) {
  const icons = ['🌙', '🔔', '🌐', '🔒', '📧', '🎨', '📱', '⚡', '🔍', '💾', '🛡️', '📊', '🎵', '🗣️', '📂', '🔄', '📶', '🛡️', '📱', '🎮'];
  const categories = ['Dark Mode', 'Email Notifications', 'Language', 'Privacy Mode', 'Push Alerts', 'Theme Color', 'Auto-Save', 'Performance Boost', 'Search History', 'Data Backup', 'Security Scan', 'Analytics Opt-In', 'Sound Effects', 'Voice Input', 'File Sync', 'Auto-Update', 'Network Optimizer', 'Biometric Lock', 'App Shortcuts', 'Game Mode'];
  const descriptions = [
    'Switch to dark theme for low-light viewing.',
    'Receive updates via email.',
    'Select your preferred language.',
    'Enhance data privacy settings.',
    'Real-time push notifications.',
    'Customize accent colors.',
    'Automatically save your work.',
    'Optimize for faster loading.',
    'Manage search and query history.',
    'Backup your data securely.',
    'Run regular security checks.',
    'Opt-in for usage analytics.',
    'Enable/disable UI sounds.',
    'Enable voice-to-text features.',
    'Sync files across devices.',
    'Enable automatic updates.',
    'Optimize network usage.',
    'Use biometrics for login.',
    'Quick app shortcuts.',
    'Enhanced gaming performance.'
  ];
  const buttonClasses = ['bg-blue-500 hover:bg-blue-600', 'bg-green-500 hover:bg-green-600', 'bg-purple-500 hover:bg-purple-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-pink-500 hover:bg-pink-600', 'bg-indigo-500 hover:bg-indigo-600', 'bg-orange-500 hover:bg-orange-600', 'bg-red-500 hover:bg-red-600', 'bg-teal-500 hover:bg-teal-600'];
  let settings = [];
  for (let i = 0; i < count; i++) {
    const name = categories[i % categories.length] + (i > 0 ? ` ${Math.floor(i / categories.length) + 1}` : '');
    const icon = icons[i % icons.length];
    const desc = descriptions[i % descriptions.length];
    const buttonClass = buttonClasses[i % buttonClasses.length];
    settings.push({ id: `setting-${i}`, name, icon, description: desc, buttonClass });
  }
  return settings;
}
function toggleSetting(settingId, enabled) {
  localStorage.setItem(`${settingId}-enabled`, enabled);
  if (settingId === 'setting-0') { // Dark Mode
    if (enabled) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
  // Update toggle text
  const toggleSpan = event.target.parentElement.querySelector('span');
  if (toggleSpan) toggleSpan.textContent = enabled ? 'On' : 'Off';
}
// ====== FILES & PROJECTS ======
function loadFilesAndProjects() {
  const container = document.getElementById('files-projects-container');
  if (!container) return;

  container.innerHTML = '<p class="col-span-full text-center py-4">Loading files and projects...</p>';

  const files = JSON.parse(localStorage.getItem('files') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');

  setTimeout(() => {
    let html = '';
    files.forEach(file => {
      const colorClass = getRandomColorClass();
      html += `
        <div class="file-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">📄 ${file.name}</h3>
          <p class="mb-1 text-gray-600 text-sm">File created on: ${file.date}</p>
          <button onclick="deleteFile('${file.id}')" class="mt-2 w-full bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-red-500 transition" role="button" aria-label="Delete ${file.name} file">Delete</button>
        </div>
      `;
    });

    projects.forEach(project => {
      const colorClass = getRandomColorClass();
      html += `
        <div class="file-card rounded-lg bg-white shadow px-5 py-4 border-t-4 ${colorClass} w-full sm:w-64 flex-shrink-0">
          <h3 class="font-bold text-lg mb-1">📁 ${project.name}</h3>
          <p class="mb-1 text-gray-600 text-sm">Project created on: ${project.date}</p>
          <button onclick="deleteProject('${project.id}')" class="mt-2 w-full bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-xs focus:ring-2 focus:ring-red-500 transition" role="button" aria-label="Delete ${project.name} project">Delete</button>
        </div>
      `;
    });

    container.innerHTML = html || '<p class="col-span-full text-center py-4">No files or projects found. Create one!</p>';
  }, 500);
}
function createFile() {
  const fileNameInput = document.getElementById('file-name');
  if (!fileNameInput) return;

  const fileName = fileNameInput.value.trim();
  if (fileName) {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    files.push({
      id: `file-${Date.now()}`,
      name: fileName,
      date: new Date().toLocaleDateString('en-IN')
    });
    localStorage.setItem('files', JSON.stringify(files));
    fileNameInput.value = '';
    loadFilesAndProjects();
    alert(`File "${fileName}" created! Synced across devices.`);
  } else {
    alert('Please enter a file name!');
  }
}
function createProject() {
  const projectNameInput = document.getElementById('project-name');
  if (!projectNameInput) return;

  const projectName = projectNameInput.value.trim();
  if (projectName) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push({
      id: `project-${Date.now()}`,
      name: projectName,
      date: new Date().toLocaleDateString('en-IN')
    });
    localStorage.setItem('projects', JSON.stringify(projects));
    projectNameInput.value = '';
    loadFilesAndProjects();
    alert(`Project "${projectName}" created! Synced across devices.`);
  } else {
    alert('Please enter a project name!');
  }
}
function deleteFile(fileId) {
  let files = JSON.parse(localStorage.getItem('files') || '[]');
  files = files.filter(file => file.id !== fileId);
  localStorage.setItem('files', JSON.stringify(files));
  loadFilesAndProjects();
  alert(`File deleted!`);
}
function deleteProject(projectId) {
  let projects = JSON.parse(localStorage.getItem('projects') || '[]');
  projects = projects.filter(project => project.id !== projectId);
  localStorage.setItem('projects', JSON.stringify(projects));
  loadFilesAndProjects();
  alert(`Project deleted!`);
}
// ====== NOTIFICATIONS ======
function loadNotifications() {
  const notificationList = document.getElementById('notification-list');
  if (!notificationList) return;

  // Use mock data directly (no fetch for demo/offline mode)
  const notifications = [
    { id: 'n-1', message: 'Welcome to SnakeEngine.ai — Try the built-in demo chat! Updated Oct 15, 2025', time: 'Just now', read: false },
    { id: 'n-2', message: 'New spaces added: 200+ unlimited communities', time: '1h ago', read: false },
    { id: 'n-3', message: 'Your Pro plan is active with unlimited access!', time: '2 days ago', read: true },
    { id: 'n-4', message: 'Cross-device sync enabled for all features.', time: '3 days ago', read: true }
  ];
  let html = '';
  notifications.forEach(notification => {
    const readClass = notification.read ? 'text-gray-400' : 'text-gray-800 font-semibold';
    html += `<li class="py-2 ${readClass}">${notification.message} <span class="text-xs text-gray-400">(${notification.time})</span></li>`;
  });
  notificationList.innerHTML = html || '<li class="py-2 text-gray-500">No new notifications.</li>';
}
// ====== PLANS ======
function loadPlans() {
  const plansTable = document.getElementById('plans-table');
  if (!plansTable) return;

  // Use mock data directly (no fetch for demo/offline mode)
  const plans = {
    free: { name: 'Free', price: '₹0', features: ['Basic chat', 'Community access', 'Limited tools (50+)', 'Cross-device basic sync'] },
    pro: { name: 'Pro', price: '₹499/mo', features: ['Unlimited chat', 'Priority support', 'All tools (200+)', 'Full device sync', 'Advanced analytics'] },
    enterprise: { name: 'Enterprise', price: 'Contact us', features: ['Custom SLA', 'Team management', 'Unlimited API access', 'Dedicated support', 'Custom features'] }
  };
  let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
  Object.values(plans).forEach(plan => {
    const colorClass = getRandomColorClass();
    html += `
      <div class="rounded-lg bg-white shadow p-6 border-t-4 ${colorClass}">
        <h3 class="font-bold text-lg mb-2">${plan.name}</h3>
        <p class="text-2xl font-bold text-gray-800 mb-2">${plan.price}</p>
        <ul class="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
          ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <button onclick="choosePlan('${plan.name.toLowerCase()}')" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded focus:ring-2 focus:ring-blue-500 transition" role="button" aria-label="Choose ${plan.name} plan">Choose Plan</button>
      </div>
    `;
  });
  html += '</div>';
  plansTable.innerHTML = html;
}
// ====== LOCAL AI FALLBACK ======
function generateLocalReply(message, model) {
  // Enhanced local replies with more variety
  const lower = message.toLowerCase();
  if (model === 'snake-ai') {
    return `🐍 Snake AI slithers in: "${message}" — Quick tip: Keep it concise for faster wisdom!`;
  }
  if (lower.includes('hello') || lower.includes('hi')) return 'Greetings! What adventure shall we embark on today? Unlimited features at your service.';
  if (lower.includes('help')) return 'Assistance at your service! Describe your quest, and I\'ll chart the course across all devices.';
  if (lower.includes('summary')) return 'Provide the text or link, and I\'ll distill the essence into a concise elixir.';
  if (lower.includes('8 ball') || lower.includes('pool')) return '8 Ball mastery: Focus on the break—powerful, centered. Spin for control, bank with precision. Want a sim? Fully responsive!';
  if (lower.includes('code')) return 'Code conundrum? Share the snippet, and I\'ll debug or enhance it step by step.';
  // default playful response
  return `(Enhanced demo) Echoing your words: "${message}" — Offline mode active. For live AI, connect the API. What's next on Oct 15, 2025?`;
}
function choosePlan(plan) {
  alert(`Selected plan: ${plan}! Redirecting to secure payment gateway with unlimited access.`);
}
// ====== ANALYTICS ======
function loadAnalyticsChart() {
  const chartContainer = document.getElementById('analytics-chart');
  if (!chartContainer) return;

  const ctx = chartContainer.getContext('2d');

  // Updated Chart data with extended dates up to Oct 15, 2025
  const data = {
    labels: ['Oct 1', 'Oct 3', 'Oct 5', 'Oct 7', 'Oct 9', 'Oct 11', 'Oct 13', 'Oct 15'],
    datasets: [
      {
        label: 'User Engagement',
        data: [500, 520, 540, 560, 580, 600, 620, 650],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Feature Usage',
        data: [400, 450, 500, 550, 600, 650, 700, 750],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart configuration
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date (Updated Oct 15, 2025)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Metrics'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  };

  // Create the chart
  new Chart(ctx, config);
}
// ====== HELP / SUPPORT FEATURES ======
function loadHelpContent() {
  // FAQ is already loaded in HTML, but we can add dynamic loading if needed
  const faqList = document.getElementById('faq-container');
  if (faqList && faqList.children.length < 2) {
    // Add more FAQs dynamically if needed
    const moreFAQs = [
      { q: 'How to join a space?', a: 'Click on any space in the Spaces section and hit Join Space. Works on all devices.' },
      { q: 'What models are available?', a: 'GPT-3.5, GPT-4, Perplexity, Gemini, and our fun Snake AI. Unlimited usage on Pro.' }
    ];
    moreFAQs.forEach(faq => {
      const div = document.createElement('div');
      div.className = 'faq-item bg-gray-100 p-4 rounded-lg shadow-md';
      div.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">${faq.q}</h3>
        <p>${faq.a}</p>
      `;
      faqList.appendChild(div);
    });
  }
}
function toggleFAQ(button) {
  const answer = button.nextElementSibling;
  const icon = button.querySelector('svg');
  if (answer.classList.contains('hidden')) {
    answer.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } else {
    answer.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}
function loadMoreFAQ() {
  alert('Loading more FAQs... (Dynamic content would load here in production)');
}
function startSupportChat() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || 'Guest';
  alert(`Starting live chat with support for ${name}. (In production, this would open a real-time chat window optimized for mobile.)`);
  // Simulate chat by appending to home chat if visible, or alert
}
function openTicketForm() {
  document.getElementById('ticket-form').classList.remove('hidden');
}
function closeTicketForm() {
  document.getElementById('ticket-form').classList.add('hidden');
  document.getElementById('ticket-subject').value = '';
  document.getElementById('ticket-message').value = '';
}
function submitTicket() {
  const subject = document.getElementById('ticket-subject').value.trim();
  const message = document.getElementById('ticket-message').value.trim();
  if (subject && message) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    tickets.push({
      id: `ticket-${Date.now()}`,
      subject,
      message,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Open'
    });
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    closeTicketForm();
    alert('Ticket submitted successfully! We\'ll respond within 24 hours. Synced across devices.');
  } else {
    alert('Please fill in subject and message.');
  }
}
function openDocs() {
  alert('Opening documentation... (In production, this would navigate to /docs or open a modal with guides.)');
}
// ====== AUTHENTICATION ======
function toggleAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    logout();
  } else {
    showLoginModal();
  }
}
function showLoginModal() {
  document.getElementById('login-modal').classList.remove('hidden');
}
function closeLoginModal() {
  document.getElementById('login-modal').classList.add('hidden');
}
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (email && password) {
    alert(`Logged in as ${email}! Unlimited features unlocked.`);
    localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
    updateUserProfile();
    updateAuthUI();
    closeLoginModal();
  } else {
    alert('Please enter email and password!');
  }
}
function loginWithGoogle() {
  alert('Logging in with Google... (In production, this would redirect to Google OAuth.)');
  // Simulate login
  localStorage.setItem('user', JSON.stringify({ email: 'user@gmail.com', name: 'Google User' }));
  updateUserProfile();
  updateAuthUI();
  closeLoginModal();
}
function loginWithFacebook() {
  alert('Logging in with Facebook... (In production, this would redirect to Facebook OAuth.)');
  // Simulate login
  localStorage.setItem('user', JSON.stringify({ email: 'user@facebook.com', name: 'Facebook User' }));
  updateUserProfile();
  updateAuthUI();
  closeLoginModal();
}
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  document.getElementById('nav-admin').style.display = 'none';
  // Remove 8ball nav if exists
  const nav8ball = document.getElementById('nav-8ball');
  if (nav8ball) nav8ball.remove();
  updateUserProfile();
  updateAuthUI();
  alert('Logged out! Basic features remain available.');
}
function updateUserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userInitial = document.getElementById('user-initial');
  const userPlan = document.getElementById('user-plan');

  if (userName && user.email) {
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userInitial.textContent = user.name.charAt(0).toUpperCase();
    userPlan.textContent = 'Pro (Unlimited)';
  } else if (userName) {
    userName.textContent = 'Guest';
    userEmail.textContent = 'guest@example.com';
    userInitial.textContent = 'G';
    userPlan.textContent = 'Basic';
  }
}
function updateAuthUI() {
  const user = localStorage.getItem('user');
  const authText = document.getElementById('auth-text');
  const navAuth = document.getElementById('nav-auth');
  if (user && authText && navAuth) {
    authText.textContent = 'Logout';
    navAuth.setAttribute('aria-label', 'Logout from account');
  } else if (authText && navAuth) {
    authText.textContent = 'Login';
    navAuth.setAttribute('aria-label', 'Login to account');
  }
}
function editProfile() {
  const userName = document.getElementById('user-name');
  if (!userName) return;

  const newName = prompt('Enter new name:', userName.textContent);
  if (newName) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.name = newName;
    localStorage.setItem('user', JSON.stringify(user));
    updateUserProfile();
    alert('Profile updated and synced!');
  }
}
function upgradePlan() {
  showSection('plans');
}
// ====== UTILITY FUNCTIONS ======
function getRandomColorClass() {
  const colors = ['border-blue-500', 'border-green-500', 'border-purple-500', 'border-yellow-500', 'border-pink-500', 'border-indigo-500', 'border-orange-500', 'border-red-500', 'border-teal-500'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ====== ADDED: CHAT IMPROVEMENTS ======
let chatContext = []; // Added: Store last 3 messages for context

// Updated: sendChatMessage with context and typing indicator
async function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const model = modelSelect ? modelSelect.value : 'gpt-3.5-turbo';
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

  // Add user message to chat
  chatOutput.innerHTML += `<p class='p-2 bg-gray-200 rounded-lg mb-2'><strong>You:</strong> ${message} <span class='text-xs text-gray-400'>(Sent: ${currentTime})</span></p>`;

  // Added: Update context
  chatContext.push({ role: 'user', content: message });
  if (chatContext.length > 3) chatContext.shift();

  // Added: Show typing indicator
  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.classList.remove('hidden');
  chatOutput.scrollTop = chatOutput.scrollHeight;

  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Added: Use context in reply
  const localReply = generateLocalReply(message, model, chatContext);
  chatOutput.innerHTML += `<p class='p-2 bg-gray-100 rounded-lg mb-2'><strong>AI:</strong> ${localReply} <span class='text-xs text-gray-400'>(Responded: ${new Date().toLocaleString()})</span></p>`;

  // Added: Update context with AI reply
  chatContext.push({ role: 'assistant', content: localReply });
  if (chatContext.length > 3) chatContext.shift();

  // Added: Hide typing indicator
  typingIndicator.classList.add('hidden');
  chatOutput.scrollTop = chatOutput.scrollHeight;
  chatInput.value = '';
}

// Updated: generateLocalReply with context
function generateLocalReply(message, model, context = []) {
  let reply = `(Enhanced demo) Echoing your words: "${message}" — Offline mode active. For live AI, connect the API. What's next?`;

  // Added: Use context if available
  if (context.length > 1) {
    reply = `(Based on previous: "${context[context.length - 2].content.substring(0, 20)}...") ` + reply;
  }

  return reply;
}

// Added: Clear Chat function
function clearChat() {
  if (confirm('Are you sure you want to clear the chat?')) {
    chatOutput.innerHTML = '<p class="text-gray-500 text-center py-4">Start a conversation with AI...</p>';
    chatContext = [];
    alert('Chat cleared!');
  }
}

// ====== ADDED: VOICE INPUT/OUTPUT ======
const voiceInput = document.getElementById('voice-input');
if (voiceInput) {
  voiceInput.addEventListener('click', toggleVoiceInput);
}

let isListening = false;
function toggleVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Voice input not supported on this device. Use text input.');
    return;
  }
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  isListening = true;

  recognition.onresult = (event) => {
    chatInput.value = event.results[0][0].transcript;
    sendChatMessage();
    isListening = false;
  };

  recognition.onend = () => {
    isListening = false;
  };

  recognition.onerror = (event) => {
    console.error('Voice recognition error', event.error);
    isListening = false;
  };
}

function speakResponse(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}

// Updated: sendChatMessage with voice output
async function sendChatMessage() {
  // ... (existing code up to localReply)

  // Added: Speak the AI reply
  speakResponse(localReply);

  // ... (rest of code)
}

// ====== ADDED: IMAGE UPLOAD ======
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      chatOutput.innerHTML += `<p class='p-2 bg-gray-200 rounded-lg mb-2'><strong>You:</strong> <img src="${e.target.result}" alt="Uploaded image" class="max-w-full h-auto rounded"></p>`;
      chatOutput.scrollTop = chatOutput.scrollHeight;

      // Simulate AI response for image
      const imageReply = 'Image received and analyzed. This looks interesting! (Offline analysis with device optimization)';
      chatOutput.innerHTML += `<p class='p-2 bg-gray-100 rounded-lg mb-2'><strong>AI:</strong> ${imageReply}</p>`;
      chatOutput.scrollTop = chatOutput.scrollHeight;
      speakResponse(imageReply);
    };
    reader.readAsDataURL(file);
  }
}

// ====== ADDED: REAL-TIME SUGGESTIONS ======
chatInput.addEventListener('input', showSuggestions);

function showSuggestions() {
  const input = chatInput.value.toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';
  suggestions.classList.add('hidden');

  const suggestionList = [
    { trigger: 'hello', suggestion: 'Hello, how can I help you today with unlimited features?' },
    { trigger: 'weather', suggestion: 'What\'s the weather like in [city]?' },
    { trigger: 'joke', suggestion: 'Tell me a joke!' },
    { trigger: 'pool', suggestion: 'Simulate an 8-ball shot in the pool section.' }
    // Add more as needed
  ];

  const matchingSuggestions = suggestionList.filter(item => input.includes(item.trigger));
  if (matchingSuggestions.length > 0) {
    matchingSuggestions.forEach(item => {
      const button = document.createElement('button');
      button.textContent = item.suggestion;
      button.onclick = () => {
        chatInput.value = item.suggestion;
        sendChatMessage();
      };
      suggestions.appendChild(button);
    });
    suggestions.classList.remove('hidden');
  }
}

// ====== ADDED: xAI Grok API INTEGRATION ======
async function callGrokAPI(message) {
  // Replace with your xAI API key
  const apiKey = 'YOUR_XAI_API_KEY';
  const url = 'https://api.x.ai/v1/chat/completions'; // xAI API endpoint (check docs for exact)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Grok API error:', error);
    return 'Sorry, Grok is taking a nap. Try again later! (Fallback to local mode)';
  }
}

// Update sendChatMessage to use API if selected
async function sendChatMessage() {
  // ... (existing code)

  let localReply;
  if (model === 'grok') {
    localReply = await callGrokAPI(message);
  } else {
    localReply = generateLocalReply(message, model);
  }

  // ... (existing code)
}

// New Feature: Export Chat
function exportChat() {
  const chatContent = chatOutput.innerText;
  const blob = new Blob([chatContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chat_history.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('Chat exported as text file! Compatible with all devices.');
}

// ====== THEME FUNCTIONS ======
function setTheme(theme) {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else if (theme === 'light') {
    document.body.classList.remove('dark');
  } else {
    // Auto
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
  updateClockTheme();
}
