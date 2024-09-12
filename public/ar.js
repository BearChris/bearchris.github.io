import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let arContainer;
let arCamera, arScene, arRenderer;
let arController;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let models = [];

//init();

function init() {
    
    arContainer = document.getElementById('arcanvas');
    document.body.appendChild(arContainer);

    arScene = new THREE.Scene();

            arCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
            light.position.set(0.5, 1, 0.25);
            arScene.add(light);

            //

            arRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            arRenderer.setPixelRatio(window.devicePixelRatio);
            arRenderer.setSize(window.innerWidth, window.innerHeight);
            arRenderer.setAnimationLoop(animate);
            arRenderer.xr.enabled = true;
            arContainer.appendChild(arRenderer.domElement);

            //

            document.body.appendChild(ARButton.createButton(arRenderer, { requiredFeatures: ['hit-test'] }));

            //

            const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
            // Initialize the GLTFLoader
            const loader = new GLTFLoader();

            function onSelect() {

                if (reticle.visible) {

                    /* const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
                    const mesh = new THREE.Mesh(geometry, material);
                    reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
                    mesh.scale.y = Math.random() * 2 + 1;
                    arScene.add(mesh); */
                    loader.load('public/media/works/3d/shin-head.glb', (gltf) => {
                        let model = gltf.scene;
        
                        // Decompose the reticle matrix to position and orient the model
                        reticle.matrix.decompose(model.position, model.quaternion, model.scale);
        
                        // Optionally adjust the scale of the model
                        model.scale.set(0.1, 0.1, 0.1); // Scale to fit your arScene
                        // Add the model to the arScene
                        arScene.add(model);
                        models.push(model);
                    }, undefined, (error) => {
                        console.error('Error loading model:', error);
                    });
                }

            }

            arController = arRenderer.xr.getController(0);
            arController.addEventListener('select', onSelect);
            arScene.add(arController);

            reticle = new THREE.Mesh(
                new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
                new THREE.MeshBasicMaterial()
            );
            reticle.matrixAutoUpdate = false;
            reticle.visible = false;
            arScene.add(reticle);

            //

            window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    arCamera.aspect = window.innerWidth / window.innerHeight;
    arCamera.updateProjectionMatrix();

    arRenderer.setSize(window.innerWidth, window.innerHeight);
    /* arRenderer.setSize($(arContainer).width(), $(arContainer).height()); */
}
//rotate models
function spinModels() {
    models.forEach((model) => {
      //model.rotation.copy(camera.rotation);
      model.rotation.y += 0.01;
    });
  }

function animate(timestamp, frame) {

    if (frame) {

        const referenceSpace = arRenderer.xr.getReferenceSpace();
        const session = arRenderer.xr.getSession();

        if (hitTestSourceRequested === false) {

            session.requestReferenceSpace('viewer').then(function (referenceSpace) {

                session.requestHitTestSource({ space: referenceSpace }).then(function (source) {

                    hitTestSource = source;

                });

            });

            session.addEventListener('end', function () {

                hitTestSourceRequested = false;
                hitTestSource = null;

            });

            hitTestSourceRequested = true;

        }

        if (hitTestSource) {

            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {

                const hit = hitTestResults[0];

                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

            } else {

                reticle.visible = false;

            }

        }
        spinModels();
    }

    arRenderer.render(arScene, arCamera);

}

//if support ar
navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (!supported) { return; }
    // 'immersive-ar' sessions are supported.
    // Page should advertise AR support to the user.
    document.getElementById('ar-btn').style.display = "block"
  });

document.addEventListener('click', ({ target }) => {
    if (target.matches('#ar-btn')) {
        init();
    }
});