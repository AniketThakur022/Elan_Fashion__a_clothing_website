// HOMEPAGE — 3D silk shader, story scroll, lookbook, products

(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ===== 3D Silk Shader Hero =====
  const canvas = document.getElementById('heroCanvas');
  if (canvas && typeof THREE !== 'undefined') {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uScroll: { value: 0 },
      uColorA: { value: new THREE.Color(0x100c0a) },
      uColorB: { value: new THREE.Color(0x6b2737) },
      uColorC: { value: new THREE.Color(0xd9b787) },
      uColorD: { value: new THREE.Color(0x281814) }
    };

    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment shader — flowing silk with simplex noise
    const fragmentShader = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uScroll;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform vec3 uColorD;

      // Simplex noise (Ashima)
      vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Multi-octave fractal noise
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * snoise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        // Aspect correct uvs
        vec2 p = uv;
        p.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.08;
        vec2 mouse = (uMouse - 0.5) * 0.4;

        // Layered silk: warp the plane with noise, then sample again
        vec2 q = vec2(
          fbm(p * 1.4 + t + mouse),
          fbm(p * 1.4 + vec2(5.2, 1.3) + t)
        );
        vec2 r = vec2(
          fbm(p * 2.0 + 4.0 * q + vec2(1.7, 9.2) + t * 1.3),
          fbm(p * 2.0 + 4.0 * q + vec2(8.3, 2.8) + t * 1.6)
        );

        float n = fbm(p * 1.8 + 4.0 * r);

        // Map noise to silk band patterns
        float band = sin(p.y * 4.0 + n * 6.0 + uScroll * 1.5) * 0.5 + 0.5;
        float band2 = sin(p.x * 2.0 - n * 4.0 + uTime * 0.15) * 0.5 + 0.5;

        // Color blending — ink → wine → gold with banding
        float t1 = smoothstep(-0.2, 0.7, n + band * 0.3);
        float t2 = smoothstep(0.45, 1.05, n + band * 0.4);
        vec3 col = mix(uColorA, uColorB, t1);
        col = mix(col, uColorC, t2 * 0.85);
        col = mix(col, uColorD, smoothstep(0.0, 0.7, 1.0 - band2));

        // Light vignette
        float v = smoothstep(1.5, 0.4, length(uv - 0.5) * 1.5);
        col *= 0.7 + 0.45 * v;

        // Golden highlight tracking mouse
        float hl = smoothstep(0.55, 0.0, length((uv - uMouse) * vec2(uResolution.x/uResolution.y, 1.0)));
        col += vec3(0.55, 0.4, 0.22) * hl * 0.28;

        // Film grain
        float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233)) + uTime) * 43758.5453) - 0.5) * 0.04;
        col += grain;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    let targetMouse = { x: 0.5, y: 0.5 };
    document.addEventListener('mousemove', (e) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - (e.clientY / window.innerHeight);
    });

    let scroll = 0;
    window.addEventListener('scroll', () => {
      scroll = window.scrollY / window.innerHeight;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animate() {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.x += (targetMouse.x - uniforms.uMouse.value.x) * 0.04;
      uniforms.uMouse.value.y += (targetMouse.y - uniforms.uMouse.value.y) * 0.04;
      uniforms.uScroll.value = scroll;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== Hero text reveal =====
  setTimeout(() => {
    document.querySelectorAll('.hero .split-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-in'), i * 220 + 100);
    });
    const eyebrows = document.querySelectorAll('.hero .reveal');
    eyebrows.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), i * 200 + 800));
  }, 1700);

  // ===== Hero parallax on scroll =====
  gsap.to('.hero__content', {
    y: 80,
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // ===== Story Scroll-driven slides =====
  const storySlides = document.querySelectorAll('.story__slide');
  const storyCaps = document.querySelectorAll('.story__caption');
  const storyNum = document.getElementById('storyNum');
  const storyBar = document.getElementById('storyBar');

  function setStoryStep(idx) {
    storySlides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    storyCaps.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    if (storyNum) storyNum.textContent = String(idx + 1).padStart(2, '0');
  }
  setStoryStep(0);

  ScrollTrigger.create({
    trigger: '.story__sticky',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const total = storySlides.length;
      const idx = Math.min(total - 1, Math.floor(self.progress * total));
      setStoryStep(idx);
      if (storyBar) storyBar.style.width = (self.progress * 100) + '%';
    }
  });

  // ===== Manifesto text reveal =====
  ScrollTrigger.create({
    trigger: '.manifesto__text',
    start: 'top 80%',
    onEnter: () => {
      document.querySelectorAll('.manifesto__text .split-line').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-in'), i * 180);
      });
    }
  });

  ScrollTrigger.create({
    trigger: '.statement__text',
    start: 'top 70%',
    onEnter: () => {
      document.querySelectorAll('.statement__text .split-line').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-in'), i * 200);
      });
    }
  });

  // ===== Featured products =====
  const grid = document.getElementById('featuredGrid');
  if (grid && window.PRODUCTS) {
    const featured = [
      'aria-slip',
      'monolith-trench',
      'tailored-blazer',
      'bias-maxi'
    ].map(id => window.PRODUCTS.find(p => p.id === id)).filter(Boolean);

    grid.innerHTML = featured.map(p => `
      <a class="product-card reveal" href="product.html?id=${p.id}">
        <div class="product-card__media">
          ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
          <div class="product-card__img product-card__img--main" style="background-image:url('${p.images[0]}')"></div>
          <div class="product-card__img product-card__img--alt" style="background-image:url('${p.images[1] || p.images[0]}')"></div>
          <span class="product-card__quick">View Piece →</span>
        </div>
        <div class="product-card__info">
          <div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__cat">${p.category} · ${p.color}</div>
          </div>
          <div class="product-card__price">${window.formatPrice(p.price)}</div>
        </div>
      </a>
    `).join('');

    // Observe newly added cards
    document.querySelectorAll('.featured__grid .reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      obs.observe(el);
    });
  }

  // ===== Lookbook horizontal scroll =====
  const strip = document.getElementById('lookbookStrip');
  if (strip) {
    const total = () => strip.scrollWidth - window.innerWidth + 64;
    ScrollTrigger.create({
      trigger: '.lookbook',
      start: 'top top+=10%',
      end: () => `+=${total()}`,
      pin: true,
      scrub: 1.1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(strip, { x: -self.progress * total() });
      }
    });
  }

  // ===== Marquee duplicate =====
  document.querySelectorAll('.marquee__track').forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // ===== Refresh ScrollTrigger after images / fonts =====
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
