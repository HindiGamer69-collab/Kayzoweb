/**
 * KAYZO — AESTHETIC BIOLINK PORTFOLIO
 * Interactive Lamp Switch, Faststart Video with Audio, and 3s End-Cut Looper.
 */

document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('bgVideo');
  const lampOverlay = document.getElementById('lampOverlay');
  const lampStage = document.getElementById('lampStage');
  const pullCord = document.getElementById('pullCord');
  const scrollWrapper = document.getElementById('scrollWrapper');
  const scrollCue = document.getElementById('scrollCue');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const iconUnmuted = document.getElementById('iconUnmuted');
  const iconMuted = document.getElementById('iconMuted');
  const sparklesCanvas = document.getElementById('sparklesCanvas');

  let isAudioPlaying = false;
  let isLampTurnedOn = false;

  // Lock scrolling before the lamp is clicked
  document.body.classList.add('locked-scroll');

  // ============================================================
  // 1. SYNTHESIZED TACTILE LAMP SWITCH SOUND
  // ============================================================
  function playLampClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Mechanical switch click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      console.warn('Audio context click:', e);
    }
  }

  // ============================================================
  // 2. AESTHETIC LAMP SWITCH ON (REVEAL PORTFOLIO)
  // ============================================================
  function turnOnLampAndEnter() {
    if (isLampTurnedOn) return;
    isLampTurnedOn = true;

    // 1. Play tactile switch sound
    playLampClickSound();

    // 2. Animate pull chain
    pullCord?.classList.add('pulled');
    setTimeout(() => {
      pullCord?.classList.remove('pulled');
    }, 200);

    // 3. Lamp illuminates!
    lampStage?.classList.add('lamp-on');

    // 4. Short glow moment before opening into video background
    setTimeout(() => {
      lampOverlay?.classList.add('turned-on');
      scrollWrapper?.classList.add('revealed');
      document.body.classList.remove('locked-scroll');

      // Start playing video with audio unmuted
      if (bgVideo) {
        bgVideo.muted = false;
        bgVideo.volume = 1.0;
        bgVideo.currentTime = 0;

        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isAudioPlaying = true;
              updateAudioIcon(true);
            })
            .catch((err) => {
              console.warn('Autoplay with sound blocked by browser, falling back to muted:', err);
              bgVideo.muted = true;
              bgVideo.play();
              isAudioPlaying = false;
              updateAudioIcon(false);
            });
        }
      }
    }, 320);
  }

  lampStage?.addEventListener('click', (e) => {
    e.stopPropagation();
    turnOnLampAndEnter();
  });

  lampOverlay?.addEventListener('click', turnOnLampAndEnter);

  // Smooth scroll click for scroll-cue arrow
  scrollCue?.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('serversSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ============================================================
  // 3. CUT LAST 3 SECONDS OF THE VIDEO (SEAMLESS LOOP)
  // ============================================================
  function handleVideoLoop() {
    if (bgVideo && bgVideo.duration && !bgVideo.paused) {
      const cutTime = Math.max(0, bgVideo.duration - 3.0);
      if (bgVideo.currentTime >= cutTime) {
        bgVideo.currentTime = 0;
      }
    }
    requestAnimationFrame(handleVideoLoop);
  }

  bgVideo?.addEventListener('loadedmetadata', () => {
    requestAnimationFrame(handleVideoLoop);
  });

  // Backup timeupdate event
  bgVideo?.addEventListener('timeupdate', () => {
    if (bgVideo && bgVideo.duration) {
      const cutTime = Math.max(0, bgVideo.duration - 3.0);
      if (bgVideo.currentTime >= cutTime) {
        bgVideo.currentTime = 0;
        bgVideo.play();
      }
    }
  });

  // ============================================================
  // 4. AUDIO TOGGLE (TOP-LEFT BUTTON 🔊)
  // ============================================================
  function updateAudioIcon(unmuted) {
    if (unmuted) {
      iconUnmuted?.classList.remove('hidden');
      iconMuted?.classList.add('hidden');
    } else {
      iconUnmuted?.classList.add('hidden');
      iconMuted?.classList.remove('hidden');
    }
  }

  audioToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!bgVideo) return;

    if (bgVideo.muted) {
      bgVideo.muted = false;
      bgVideo.volume = 1.0;
      bgVideo.play();
      isAudioPlaying = true;
      updateAudioIcon(true);
    } else {
      bgVideo.muted = true;
      isAudioPlaying = false;
      updateAudioIcon(false);
    }
  });

  // ============================================================
  // 5. SPARKLES ANIMATION OVER USERNAME
  // ============================================================
  if (sparklesCanvas) {
    const ctx = sparklesCanvas.getContext('2d');
    let width, height;
    const particles = [];
    const maxParticles = 20;

    function resizeCanvas() {
      const parent = sparklesCanvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width + 80;
      height = rect.height + 50;
      sparklesCanvas.width = width;
      sparklesCanvas.height = height;
    }

    class Sparkle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.speed = Math.random() * 0.02 + 0.01;
        this.driftX = (Math.random() - 0.5) * 0.3;
        this.driftY = (Math.random() - 0.5) * 0.3;
        this.glow = Math.random() * 8 + 3;
      }

      update() {
        this.alpha += Math.sin(Date.now() * this.speed) * 0.03;
        this.x += this.driftX;
        this.y += this.driftY;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.alpha <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.alpha))})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = this.glow;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point twinkle star
        if (this.size > 1.6) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.85})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 2, this.y);
          ctx.lineTo(this.x + this.size * 2, this.y);
          ctx.moveTo(this.x, this.y - this.size * 2);
          ctx.lineTo(this.x, this.y + this.size * 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Sparkle());
    }

    function animateSparkles() {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(animateSparkles);
    }

    animateSparkles();
  }
});
