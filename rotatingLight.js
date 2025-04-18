let scene, camera, renderer;
let lightRed, lightGreen;

function init() {
  // Cena
  scene = new THREE.Scene();

  // Câmera
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 10;

  // Renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff); // Fundo branco
  document.body.appendChild(renderer.domElement);

  // Plano grande visível
  const geometry = new THREE.PlaneGeometry(40, 40);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,  // Reage à luz
    shininess: 100,
    side: THREE.DoubleSide
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  // Luz vermelha
  lightRed = new THREE.PointLight(0xff0000, 2, 100);
  scene.add(lightRed);

  // Luz azul
  lightAzul = new THREE.PointLight(0x0000ff, 2, 100);
  scene.add(lightAzul);

  // Luz ambiente fraca para ajudar a ver o plano mesmo sem luz direta
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  window.addEventListener('resize', onResize, false);

  animate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const t = Date.now() * 0.001;

  // Movimento circular
  const radius = 6;
  const z = 3;

  lightRed.position.set(
    radius * Math.cos(t),
    radius * Math.sin(t),
    z
  );

  lightAzul.position.set(
    radius * Math.cos(-t),
    radius * Math.sin(-t),
    z
  );

  renderer.render(scene, camera);
}

init();
