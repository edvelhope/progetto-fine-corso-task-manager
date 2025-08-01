<template>
  <div ref="container" class="logo-box"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as THREE from 'three';

const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const scene = new THREE.Scene();
  scene.background = null; // nessuno sfondo

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000); // 1:1 aspect ratio
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(150, 150); // piccola dimensione
  container.value?.appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  loader.load('/logo-taskline.png', (texture) => {
    const geometry = new THREE.PlaneGeometry(3, 3);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      mesh.rotation.y = Math.sin(t) * 0.3;
      mesh.rotation.x = Math.sin(t * 0.7) * 0.1;
      mesh.scale.setScalar(1 + 0.05 * Math.sin(t * 2));
      renderer.render(scene, camera);
    };

    animate();
  });
});
</script>

<style scoped>
.logo-box {
  width: 150px;
  height: 150px;
  margin: 1rem auto;
}
</style>

