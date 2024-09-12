import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const cameraDistance = 16;
const cameraHeight = 12;
const scenes = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
const controls = new OrbitControls(camera, renderer.domElement);

//camera.position.set( window.innerWidth / 4, window.innerHeight / 4, 0 );
camera.position.set(0, cameraHeight, cameraDistance);
camera.lookAt(0, 0, 0);

function onWindowResize() {
  camera.aspect = window.innerWidth / (window.innerHeight / 1.8);
  renderer.setPixelRatio(canvas.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight / 1.8);
  camera.updateProjectionMatrix();
  //controls.update();
}

document.addEventListener('click', ({ target }) => {
  if (target.matches('#ar-btn')) {
    ar();
  }
});

//window.addEventListener('resize', onWindowResize);

//window.addEventListener("resize", resizeCanvasToDisplaySize);

const skyboxLoader = new THREE.CubeTextureLoader();
skyboxLoader.setPath('public/media/works/3d/');

const textureCube = skyboxLoader.load([
  'right.png', 'left.png',
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);

//scene.background = new THREE.Color(0xff0000);;
scene.background = textureCube;

const container = document.getElementById('canvas');

// create your renderer

//renderer.setPixelRatio(1);
camera.aspect = (window.innerWidth / (window.innerHeight / 1.8));
renderer.setSize(window.innerWidth, window.innerHeight / 1.8);
camera.updateProjectionMatrix();

// apply the internal canvas of the renderer to the DOM

//const renderer = new THREE.WebGLRenderer();
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );
/* controls.maxDistance = cameraDistance;
controls.minDistance = cameraDistance;
controls.minPolarAngle = Math.PI / 2.5;
controls.maxPolarAngle = Math.PI / 2.5; */
controls.maxPolarAngle = Math.PI / 2;
controls.update();
/* controls.enableDamping = true;// an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.3;
//controls.screenSpacePanning = false;*/
controls.minDistance = 5;
controls.maxDistance = 30;
controls.enablePan = false;

//const light = new THREE.AmbientLight(0xffffff); // soft white light
const light = new THREE.PointLight(0xffcc00, 3.9, 50); // soft white light
const sparkle = new THREE.PointLight(0xff5000, 3.9, 30); // soft white light
light.position.set(0, 0, 0);
scene.add(light);
scene.add(sparkle);

const loader = new GLTFLoader();

loader.load('public/media/works/3d/campfire-mud.glb', function (gltf) {
  let model = gltf.scene;
  model.rotation.y = 45 * Math.PI / 180;
  model.position.y = -5;
  //model.rotation.x = 25 * Math.PI / 180;
  //model.position.x = 0;

  scene.add(gltf.scene);


}, undefined, function (error) {

  console.error(error);

});
const smokemap = new THREE.TextureLoader().load('public/media/works/3d/smoke.png')
//const sMaterial = new THREE.SpriteMaterial({ map: smokemap });
//const sMaterial = new THREE.MeshBasicMaterial({ map: smokemap, alphaTest: 0.5, transparent:true });
const sMaterial = new THREE.MeshLambertMaterial({ map: smokemap, alphaTest: 0.3, transparent: true });
const sGeometry = new THREE.PlaneGeometry(1, 1);

//fire particle
// Create an array to store the particles
let smokes = [];

// Function to generate a particle at a specific position
function generateParticle(position) {
  // Create your particle geometry and material
  let sClone = new THREE.Mesh(sGeometry, sMaterial);
  const smoke = SkeletonUtils.clone(sClone);
  smoke.position.copy(position);
  smoke.position.x = genRandNum(-1.2, 1.2);
  smoke.position.y = genRandNum(-3, -1);
  smoke.position.z = genRandNum(-1.2, 1.2);
  smoke.rotation.y = Math.PI / Math.random();
  smoke.rotation.z = Math.PI / Math.random();
  smoke.scale.x = 5;
  scene.add(smoke);

  // Define the particle's lifespan (in milliseconds)
  let lifespan = 500; // 2 seconds

  // Schedule the removal of the particle after lifespan
  setTimeout(() => {
    scene.remove(smoke);
    smokes.splice(smokes.indexOf(smoke), 1);
  }, lifespan);

  smokes.push(smoke);
}
/* function generateParticle(position) {
    // Create your particle geometry and material
    let smoke = new THREE.Sprite(sMaterial);
    smoke.position.copy(position);
    smoke.position.x = genRandNum(-1.2, 1.2);
    smoke.position.y = genRandNum(-3, -1);
    smoke.position.z = genRandNum(-1.2, 1.2);
    smoke.rotation.y = Math.PI / Math.random();
    smoke.rotation.z = Math.PI / Math.random();
    scene.add(smoke);

    // Define the particle's lifespan (in milliseconds)
    let lifespan = 1000; // 2 seconds

    // Schedule the removal of the particle after lifespan
    setTimeout(() => {
        scene.remove(smoke);
        smokes.splice(smokes.indexOf(smoke), 1);
    }, lifespan);

    smokes.push(smoke);
} */

// Generate 3 particles at specific positions
//generateParticle(new THREE.Vector3(0, 0, 0));

function genRandNum(min, max, excludeMin, excludeMax) {
  let randomNumber;
  if (excludeMin || excludeMax) {
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomNumber >= excludeMin && randomNumber <= excludeMax);

    return randomNumber;
  } else {
    return randomNumber = Math.random() * (max - min + 1) + min;
  }
}

const treesLoader = new GLTFLoader();

treesLoader.load('public/media/works/3d/campfire-tree.glb', function (gltf) {
  let model = gltf.scene;
  let max = 210, eMax = 15;
  let min = -210, eMin = -15;
  let maxY = -3.9;
  let sizeMax = 1.1, sizeMin = 0.9;
  for (let i = 0; i < 50; i++) {
    const treeClone = SkeletonUtils.clone(model);
    let x = genRandNum(min, max, eMin, eMax);
    let z = genRandNum(min, max, eMin, eMax);
    treeClone.position.set(x, maxY, z);
    treeClone.rotation.y = Math.PI / Math.random();
    let sv = genRandNum(sizeMin, sizeMax);
    let sh = genRandNum(sizeMin, sizeMax);
    treeClone.scale.set(sv, sh, sv)
    scene.add(treeClone);
  }


}, undefined, function (error) {

  console.error(error);

});

//camera.position.z = 15;

//update smoke
function updateSmoke() {
  smokes.forEach((smoke) => {
    //smoke.rotation.copy(camera.rotation);
    smoke.position.y += 0.5;
    smoke.rotation.z += 0.01; // Adjust the rotation speed as needed
    smoke.scale.x -= 0.3;
  });
}

scenes.push( scene );

function animate() {
  requestAnimationFrame(animate);
  //resizeCanvasToDisplaySize();
  /* cube.rotation.x += 0.01;
  cube.rotation.y += 0.01; */
  generateParticle(new THREE.Vector3(0, 0, 0));
  sparkle.distance = genRandNum(5, 25);
  sparkle.position.x = genRandNum(-3, 3);
  sparkle.position.z = genRandNum(-3, 3);
  updateSmoke();
  renderer.render(scene, camera);

}

animate();

/* function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
} */

//window.onresize = onWindowResize;
renderer.setPixelRatio(window.devicePixelRatio)

var canvas = document.getElementById('canvas');
function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  camera.aspect = (window.innerWidth / (window.innerHeight / 1.8));
  camera.updateProjectionMatrix();
  renderer.setSize($(container).width(), $(container).height());

  //renderer.setSize(window.innerWidth, window.innerHeight);
}
container.appendChild(renderer.domElement);
fitToContainer(canvas);

window.addEventListener('resize', () => fitToContainer(canvas));
