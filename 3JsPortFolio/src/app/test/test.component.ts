import { Component } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as THREE from 'three';
// import * as threeAddon from 'three-addons';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  constructor() {}

  ngOnInit(): void {
    this.renderGltf('../../assets/model.gltf');
  }
  newRender(): void {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer();
    renderer.useLegacyLights = false; // WebGLRenderer.physicallyCorrectLights = true is now WebGLRenderer.useLegacyLights = false
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();
    loader.load(
      '../../assets/model.gltf',
      function (gltf: any) {
        console.log(gltf);
        gltf.scene.traverse(function (child: any) {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.receiveShadow = true;
            m.castShadow = true;
          }
          if ((child as THREE.Light).isLight) {
            const l = child as THREE.SpotLight;
            l.castShadow = true;
            l.shadow.bias = -0.003;
            l.shadow.mapSize.width = 2048;
            l.shadow.mapSize.height = 2048;
          }
        });
        scene.add(gltf.scene);
      },
      (xhr: any) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error: any) => {
        console.log(error);
      }
    );

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    function animate() {
      requestAnimationFrame(animate);

      controls.update();

      render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    animate();
  }
  renderGltf(gltfFile: any): void {
    const canvas = document.getElementById('canvas-box');
    const scene = new THREE.Scene();

    const loader = new GLTFLoader();

    loader.load(
      // resource URL
      gltfFile,
      // called when the resource is loaded
      function (gltf: any) {
        scene.add(gltf.scene);
        console.log(gltf.scene);
        gltf.scene.traverse((obj: { type: string; doubleSided: boolean }) => {
          if (obj.type === 'Mesh') {
            obj.doubleSided = true;
            // or maybe
            // obj.material.side = THREE.DoubleSide;
          }
        });
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
      },
      // called while loading is progressing
      function (xhr: any) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // called when loading has errors
      function (error: any) {
        console.log('An error happened', error);
      }
    );

    console.log('scene', scene);

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      50,
      canvasSizes.width / canvasSizes.height,
      0.001,
      2000
    );
    camera.position.z = 100;

    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.useLegacyLights = false;
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      render();
    });
    function render() {
      renderer.render(scene, camera);
    }
    function animate() {
      requestAnimationFrame(animate);

      controls.update();

      render();
    }
    animate();
  }
}
