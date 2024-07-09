import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//camera.position.set( window.innerWidth / 4, window.innerHeight / 4, 0 );
camera.position.set(0, 7, 100);
camera.lookAt(0, 0, 0);


function update3dCamera() {
  camera.position.set(window.innerWidth / 4, 0, 0);
}

window.addEventListener("resize", update3dCamera);

const skyboxLoader = new THREE.CubeTextureLoader();
skyboxLoader.setPath('public/media/works/3d/');

const textureCube = skyboxLoader.load([
  'right.png', 'left.png',
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);

scene.background = textureCube;

const container = document.getElementById('canvas');

// create your renderer

const renderer = new THREE.WebGLRenderer({ antialias: true });
//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);

// apply the internal canvas of the renderer to the DOM

container.appendChild(renderer.domElement);

//const renderer = new THREE.WebGLRenderer();
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
/* controls.enableDamping = true;// an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.3;
//controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 30; */

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);

const points = [];
points.push(new THREE.Vector3(-3, -1.5, 0));
points.push(new THREE.Vector3(0, 2.5, 0));
points.push(new THREE.Vector3(3, -1.5, 0));
points.push(new THREE.Vector3(-3, -1.5, 0));

//scene.add( cube );

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
const material2 = new THREE.LineBasicMaterial({ color: 0xffff00, visible: true });
const line = new THREE.Line(geometry2, material2);

//scene.add( line );

//const light = new THREE.AmbientLight(0xffffff); // soft white light
const light = new THREE.PointLight(0xffff00, 3, 100); // soft white light
light.position.set( 0, 5, 0 );
scene.add(light);

const loader = new GLTFLoader();

loader.load('public/media/works/3d/campfire.glb', function (gltf) {
  let model = gltf.scene;
  model.rotation.y = 45 * Math.PI / 180;
  //model.rotation.x = 25 * Math.PI / 180;
  //model.position.x = 0;
  //model.rotation.x = 0;

  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = onWindowResize;

var canvas = document.querySelector('canvas');
fitToContainer(canvas);

function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}