import { Component } from '@angular/core';

import * as THREE from 'three';

declare var require: any;

// import * as threeAddon from 'three-addons';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  constructor() {}

  ngOnInit(): void {
    this.renderGltf('./assets/model.gltf');
  }

  renderGltf(gltfFile: any): void {

    const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');

    const canvas = document.getElementById('canvas-box');
    const scene = new THREE.Scene();
    const material = new THREE.MeshToonMaterial();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const loader = new GLTFLoader();

    loader.load(
      // resource URL
      gltfFile,
      // called when the resource is loaded
      function (gltf: any) {
        scene.add(gltf.scene);

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
        console.log('An error happened');
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
    camera.position.z = 1;
    scene.add(camera);

    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });
    renderer.render(scene, camera);

    // const clock = new THREE.Clock();

    // const animateGeometry = () => {
    //   const elapsedTime = clock.getElapsedTime();

    //   // Update animaiton objects
    //   box.rotation.x = elapsedTime;
    //   box.rotation.y = elapsedTime;
    //   box.rotation.z = elapsedTime;

    //   torus.rotation.x = -elapsedTime;
    //   torus.rotation.y = -elapsedTime;
    //   torus.rotation.z = -elapsedTime;

    //   // Render
    // renderer.render(scene, camera);

    //   // Call tick again on the next frame
    //   window.requestAnimationFrame(animateGeometry);
    // };

    // animateGeometry();
  }
}
