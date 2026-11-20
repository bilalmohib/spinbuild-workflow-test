const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-links');

function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

menu.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

const templates = {
  idea: {
    title: 'Every idea starts somewhere.',
    description: 'Give your first spark a little shape.',
    steps: [
      ['Capture the spark', 'Put the possibility into words.'],
      ['Find your focus', 'Choose the part that matters most.'],
      ['Take the first step', 'Turn your direction into an action.']
    ]
  },
  project: {
    title: 'A fresh project. A clearer path.',
    description: 'Make a little space for something worth building.',
    steps: [
      ['Define the outcome', 'Decide what a good result looks like.'],
      ['Map the milestones', 'Break the journey into manageable parts.'],
      ['Plan the next move', 'Choose one useful action to begin.']
    ]
  },
  release: {
    title: 'Ready for your next chapter.',
    description: 'Bring the finishing touches into focus.',
    steps: [
      ['Review the essentials', 'Make sure the important pieces are in place.'],
      ['Set the stage', 'Prepare a clear introduction for your work.'],
      ['Share what you made', 'Put the next possibility into motion.']
    ]
  }
};

const options = [...document.querySelectorAll('.template')];
const stepsElement = document.querySelector('#workflow-steps');
const runButton = document.querySelector('#run-demo');
const progress = document.querySelector('#demo-progress');
const runState = document.querySelector('#run-state');
let running = false;
let timers = [];

function selectTemplate(key) {
  const template = templates[key];
  options.forEach(option => {
    const selected = option.dataset.template === key;
    option.classList.toggle('active', selected);
    option.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#workflow-title').textContent = template.title;
  document.querySelector('#workflow-description').textContent = template.description;
  stepsElement.replaceChildren();
  template.steps.forEach(([title, description], index) => {
    const item = document.createElement('li');
    const number = document.createElement('span');
    number.className = 'step-number';
    number.textContent = `0${index + 1}`;
    const text = document.createElement('div');
    const heading = document.createElement('b');
    heading.textContent = title;
    const detail = document.createElement('small');
    detail.textContent = description;
    text.append(heading, detail);
    const state = document.createElement('span');
    state.className = 'step-status';
    state.setAttribute('aria-label', 'Waiting');
    item.append(number, text, state);
    stepsElement.append(item);
  });
  progress.textContent = 'Ready to explore.';
  runState.textContent = 'Ready when you are';
  runButton.innerHTML = 'Run sample workflow <span aria-hidden="true">→</span>';
}

options.forEach(option => option.addEventListener('click', () => {
  if (!running) selectTemplate(option.dataset.template);
}));

runButton.addEventListener('click', () => {
  if (running) return;
  running = true;
  timers.forEach(clearTimeout);
  timers = [];
  runButton.disabled = true;
  options.forEach(option => { option.disabled = true; });
  runButton.textContent = 'Running sample…';
  runState.textContent = 'Demo in progress';
  const items = [...stepsElement.children];
  items.forEach(item => {
    item.classList.remove('done', 'running');
    item.querySelector('.step-status').setAttribute('aria-label', 'Waiting');
  });
  const runStep = index => {
    if (index === items.length) {
      running = false;
      runButton.disabled = false;
      options.forEach(option => { option.disabled = false; });
      runButton.innerHTML = 'Run it again <span aria-hidden="true">↻</span>';
      runState.textContent = 'Sample complete';
      progress.textContent = 'All three sample steps complete. Nothing was saved.';
      return;
    }
    const item = items[index];
    item.classList.add('running');
    item.querySelector('.step-status').setAttribute('aria-label', 'In progress');
    progress.textContent = `Step ${index + 1} of 3: ${item.querySelector('b').textContent}`;
    timers.push(setTimeout(() => {
      item.classList.remove('running');
      item.classList.add('done');
      item.querySelector('.step-status').setAttribute('aria-label', 'Complete');
      runStep(index + 1);
    }, 900));
  };
  runStep(0);
});

/* Optional visual enhancement: native HTML remains visible until the first
   successful render. No external dependency is required for navigation/demo. */
const stage = document.querySelector('.product-stage');
const canvas = document.querySelector('#product-canvas');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let disposeScene = () => {};
let sceneInitialized = false;
let pageActive = true;

async function initScene() {
  if (sceneInitialized || motion.matches || !pageActive) return;
  sceneInitialized = true;
  let renderer;
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');
    if (!pageActive) return;
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: window.innerWidth > 680 });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0xf5f5f3, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 2.7, 11.8);
    camera.lookAt(0, 1.1, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9ba493, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(-3, 7, 6);
    scene.add(light);

    const laptop = new THREE.Group();
    scene.add(laptop);
    laptop.position.y = 0.2;
    const metal = new THREE.MeshStandardMaterial({ color: 0xbec4bb, metalness: 0.72, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x20251f, roughness: 0.5 });
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x424940, roughness: 0.8 });
    const geometries = [];
    function box(w, h, d, material, x, y, z, parent = laptop) {
      const geometry = new THREE.BoxGeometry(w, h, d);
      geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    }
    box(7.15, 0.12, 4.05, metal, 0, 0, 0);
    box(1.9, 0.01, 0.85, metal, 0, 0.068, 1.15);
    box(6.35, 0.015, 1.75, dark, 0, 0.069, -0.35);
    const keyGeometry = new THREE.BoxGeometry(0.32, 0.028, 0.26);
    geometries.push(keyGeometry);
    const keys = new THREE.InstancedMesh(keyGeometry, keyMaterial, 68);
    const matrix = new THREE.Matrix4();
    let keyIndex = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 17; col++) {
        matrix.makeTranslation((col - 8) * 0.36, 0.09, -0.96 + row * 0.36);
        keys.setMatrixAt(keyIndex++, matrix);
      }
    }
    laptop.add(keys);
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.12, -1.91);
    screenGroup.rotation.x = -0.14;
    laptop.add(screenGroup);
    box(7.03, 4.25, 0.1, metal, 0, 2.125, 0, screenGroup);
    box(6.9, 4.12, 0.025, dark, 0, 2.125, 0.063, screenGroup);

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1440;
    textureCanvas.height = 860;
    const ctx = textureCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    function rect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    function text(value, x, y, size = 20, color = '#263226', weight = 400) {
      ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(value, x, y);
    }
    rect(0, 0, 1440, 860, '#fbfcf8');
    rect(0, 0, 1440, 85, '#ffffff');
    rect(0, 85, 270, 775, '#edf1e9');
    text('◈ spinbuild', 36, 53, 30, '#246345', 650);
    text('Workspace / A new beginning', 530, 49, 19, '#72796e');
    rect(1350, 28, 28, 28, '#c4d6bd');
    text('WORKSPACE', 32, 146, 15, '#737c6c', 600);
    rect(18, 178, 234, 57, '#dce7d6');
    text('Overview', 45, 214, 20, '#246345', 600);
    text('Workflows', 45, 290, 20, '#68715f');
    text('Activity', 45, 367, 20, '#68715f');
    text('ILLUSTRATIVE CONCEPT', 31, 807, 12, '#6a7561');
    text('YOUR WORKSPACE, SIMPLIFIED', 330, 166, 15, '#6f7a66', 600);
    text('Good things start here.', 328, 240, 49, '#263226', 600);
    text('A little structure. A lot of possibility.', 331, 282, 22, '#737b6e');
    rect(330, 330, 485, 135, '#f0f3ec');
    rect(835, 330, 540, 135, '#edf3e9');
    text('PROJECT', 355, 369, 14, '#747d6c', 600);
    text('A new beginning', 355, 424, 28, '#263226', 550);
    text('STATUS', 861, 369, 14, '#747d6c', 600);
    text('Ready to run', 861, 424, 28, '#246345', 550);
    text('YOUR PATH FORWARD', 330, 522, 15, '#747d6c', 600);
    const labels = ['Imagine', 'Create', 'Launch'];
    labels.forEach((label, index) => {
      const x = 330 + index * 365;
      rect(x, 552, 310, 170, index === 1 ? '#246345' : '#e7eee1');
      const color = index === 1 ? '#ffffff' : '#246345';
      text(`0${index + 1}`, x + 25, 593, 18, color);
      text(label, x + 25, 674, 31, color, 550);
      if (index < 2) text('→', x + 327, 648, 26, '#7b8873');
    });
    text('●  Everything in its right place.', 331, 793, 20, '#6b7862');
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const screenMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const displayGeometry = new THREE.PlaneGeometry(6.65, 3.97);
    geometries.push(displayGeometry);
    const display = new THREE.Mesh(displayGeometry, screenMaterial);
    display.position.set(0, 2.125, 0.08);
    screenGroup.add(display);

    let visible = true;
    let frame = 0;
    let target = 0;
    let current = 0;
    let stopped = false;
    function render() {
      if (stopped) return;
      current += (target - current) * 0.065;
      laptop.rotation.y = -0.11 + current * 0.2;
      laptop.rotation.x = 0.02 + current * 0.035;
      renderer.render(scene, camera);
    }
    function loop() {
      frame = 0;
      if (!visible || document.hidden || stopped) return;
      render();
      if (Math.abs(target - current) > 0.001) frame = requestAnimationFrame(loop);
    }
    function schedule() {
      if (!frame && visible && !document.hidden && !stopped) frame = requestAnimationFrame(loop);
    }
    function resize() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 680 ? 12.4 : 11.8;
      camera.updateProjectionMatrix();
      render();
    }
    function scroll() {
      const rect = stage.getBoundingClientRect();
      target = THREE.MathUtils.clamp((window.innerHeight * 0.5 - rect.top) / window.innerHeight, -0.3, 1);
      schedule();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    });
    intersectionObserver.observe(stage);
    const onVisibility = () => schedule();
    const onContextLost = event => {
      event.preventDefault();
      disposeScene();
    };
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onContextLost);
    resize();
    stage.classList.add('has-3d');
    scroll();
    disposeScene = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometries.forEach(geometry => geometry.dispose());
      [metal, dark, keyMaterial, screenMaterial].forEach(material => material.dispose());
      texture.dispose();
      renderer.dispose();
      stage.classList.remove('has-3d');
    };
    if (motion.matches || !pageActive) disposeScene();
  } catch {
    renderer?.dispose();
    stage.classList.remove('has-3d');
  }
}

const lazyScene = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    lazyScene.disconnect();
    initScene();
  }
}, { rootMargin: '150px' });
lazyScene.observe(stage);

motion.addEventListener('change', () => {
  if (motion.matches) {
    disposeScene();
    sceneInitialized = false;
  } else {
    initScene();
  }
});

window.addEventListener('pagehide', () => {
  pageActive = false;
  timers.forEach(clearTimeout);
  disposeScene();
});

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    pageActive = true;
    sceneInitialized = false;
    running = false;
    runButton.disabled = false;
    options.forEach(option => { option.disabled = false; });
    const active = options.find(option => option.classList.contains('active'));
    selectTemplate(active?.dataset.template || 'idea');
    initScene();
  }
});