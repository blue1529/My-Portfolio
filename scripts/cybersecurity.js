
/* --------- Matrix rain effect --------- */
(function () {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d', { alpha: true });

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const characters = 'アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charArr = characters.split('');
  const fontSize = Math.max(12, Math.floor(window.innerWidth / 100));
  const columns = Math.floor(window.innerWidth / fontSize);
  const drops = Array.from({ length: columns }).map(() => Math.random() * -50);

  ctx.font = `${fontSize}px monospace`;

  let running = true;
  let animationId;

  function draw() {
    if (!running) return;
    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = '#0aff70';
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      ctx.fillText(text, x, y);

      if (y > window.innerHeight + Math.random() * 1000) {
        drops[i] = Math.random() * -50;
      } else {
        drops[i] += Math.random() * 0.8 + 0.6;
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  // start animation
  animationId = requestAnimationFrame(draw);

  // stop and hide after 4 seconds
  setTimeout(() => {
    canvas.classList.add('matrix-fadeout'); // CSS fadeout
    setTimeout(() => {
      running = false;
      cancelAnimationFrame(animationId);
      canvas.style.display = "none"; // fully remove canvas
    }, 1000); // wait for fade transition
  }, 4000);
})();
