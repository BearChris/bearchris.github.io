import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const cameraDistance = 16;
const cameraHeight = 12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

//camera.position.set( window.innerWidth / 4, window.innerHeight / 4, 0 );
camera.position.set(0, cameraHeight, cameraDistance);
camera.lookAt(0, 0, 0);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //controls.update();
}

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
renderer.setSize(window.innerWidth, window.innerHeight);

// apply the internal canvas of the renderer to the DOM

container.appendChild(renderer.domElement);

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
//controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 30; */

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

//const light = new THREE.AmbientLight(0xffffff); // soft white light
const light = new THREE.PointLight(0xffcc00, 3, 30); // soft white light
light.position.set(0, 0, 0);
scene.add(light);

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

function genRandNum(min, max, excludeMin, excludeMax) {
  let randomNumber;
  if (excludeMin || excludeMax) {
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomNumber >= excludeMin && randomNumber <= excludeMax);
    
    return randomNumber;
  }else{
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

//resize canvas
function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // set render target sizes here
  }
}

function animate() {
  requestAnimationFrame(animate);
  //resizeCanvasToDisplaySize();
  /* cube.rotation.x += 0.01;
  cube.rotation.y += 0.01; */

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

var canvas = document.querySelector('canvas');
function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  renderer.setSize($(container).width(), $(container).height());
  container.appendChild(renderer.domElement);
}
fitToContainer(canvas);

//window.addEventListener('resize', onResize());
