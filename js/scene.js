/* ─── THREE.JS NEURAL NETWORK HERO ──────────────────────────────────────── */
(function () {
  'use strict';

  const canvas = document.getElementById('c3');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 90;

  /* ── Node geometry ── */
  const NODE_COUNT = 140;
  const nodes = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * 220,
      y: (Math.random() - 0.5) * 130,
      z: (Math.random() - 0.5) * 70,
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.018,
      vz: (Math.random() - 0.5) * 0.009,
      phase: Math.random() * Math.PI * 2
    });
  }

  const nodePosArr = new Float32Array(NODE_COUNT * 3);
  const nodeSizeArr = new Float32Array(NODE_COUNT);
  const nodeColorArr = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodePosArr[i * 3]     = nodes[i].x;
    nodePosArr[i * 3 + 1] = nodes[i].y;
    nodePosArr[i * 3 + 2] = nodes[i].z;
    nodeSizeArr[i]        = Math.random() * 2.5 + 0.8;
    // Mix green and purple
    const t = Math.random();
    nodeColorArr[i * 3]     = t * 0.48;
    nodeColorArr[i * 3 + 1] = (1 - t) * 0.9 + t * 0.36;
    nodeColorArr[i * 3 + 2] = t * 0.98;
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
  nodeGeo.setAttribute('aSize',    new THREE.BufferAttribute(nodeSizeArr, 1));
  nodeGeo.setAttribute('aColor',   new THREE.BufferAttribute(nodeColorArr, 3));

  const nodeMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        float pulse = 0.5 + 0.5 * sin(uTime * 0.9 + position.x * 0.04 + position.y * 0.03);
        vAlpha = 0.35 + 0.45 * pulse;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * pulse * (220.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float glow = exp(-d * 4.0);
        float edge = 1.0 - smoothstep(0.3, 0.5, d);
        gl_FragColor = vec4(vColor, (glow * 0.6 + edge * 0.4) * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodePoints);

  /* ── Connection lines ── */
  const MAX_DIST = 38;
  const lineVerts = [];
  const lineAlphas = [];
  const lineColorData = [];
  const connections = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < MAX_DIST) {
        const t = 1 - dist / MAX_DIST;
        connections.push({ i, j, t });
        lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
        lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        lineAlphas.push(t * 0.3, 0);
        // Green lines (mostly)
        lineColorData.push(0, 0.9, 0.63, 0, 0.9, 0.63);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  const linePosBuffer = new THREE.BufferAttribute(new Float32Array(lineVerts), 3);
  linePosBuffer.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('position', linePosBuffer);
  lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColorData), 3));

  const lineAlphaBuffer = new THREE.BufferAttribute(new Float32Array(lineAlphas), 1);
  lineAlphaBuffer.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('alpha', lineAlphaBuffer);

  const lineMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float alpha;
      attribute vec3 color;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vAlpha = alpha;
        vColor = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegs);

  /* ── Ambient glow mesh (large blurred sphere) ── */
  const glowGeo = new THREE.SphereGeometry(55, 24, 24);
  const glowMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform float uTime;
      void main() {
        float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float pulse = 0.5 + 0.5 * sin(uTime * 0.4);
        float a = pow(rim, 3.0) * 0.06 * pulse;
        gl_FragColor = vec4(0.0, 0.9, 0.63, a);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowMesh);

  /* ── Mouse parallax ── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── Animation loop ── */
  let time = 0;
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.007;
    frame++;

    /* Smooth parallax */
    targetX += (mouseX - targetX) * 0.028;
    targetY += (mouseY - targetY) * 0.028;
    scene.rotation.y = targetX * 0.14;
    scene.rotation.x = targetY * 0.09;

    /* Orbital drift */
    scene.rotation.z = Math.sin(time * 0.12) * 0.025;

    /* Update shader uniforms */
    nodeMat.uniforms.uTime.value = time;
    lineMat.uniforms.uTime.value = time;
    glowMat.uniforms.uTime.value = time;

    /* Update node positions (gentle drift) — every other frame for perf */
    if (frame % 2 === 0) {
      const pos = nodeGeo.attributes.position.array;
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        /* Soft boundary */
        if (Math.abs(n.x) > 110) n.vx *= -1;
        if (Math.abs(n.y) > 65)  n.vy *= -1;
        if (Math.abs(n.z) > 35)  n.vz *= -1;
        pos[i * 3]     = n.x;
        pos[i * 3 + 1] = n.y;
        pos[i * 3 + 2] = n.z;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      /* Update line positions */
      const lp = lineGeo.attributes.position.array;
      const la = lineGeo.attributes.alpha.array;
      for (let c = 0; c < connections.length; c++) {
        const { i, j, t } = connections[c];
        const base = c * 6;
        lp[base]     = nodes[i].x; lp[base + 1] = nodes[i].y; lp[base + 2] = nodes[i].z;
        lp[base + 3] = nodes[j].x; lp[base + 4] = nodes[j].y; lp[base + 5] = nodes[j].z;
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + i * 0.3 + j * 0.17);
        la[c * 2]     = t * 0.35 * pulse;
        la[c * 2 + 1] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.alpha.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ── */
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
