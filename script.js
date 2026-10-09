/* ==========================================
   GODDEN TECH GLOBAL
   EXTREME 3D EXPERIENCE
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const intro = document.getElementById("intro");
  const website = document.getElementById("website");

  const loadingBar = document.getElementById("loadingBar");
  const loadingText = document.getElementById("loadingText");

  const skipButton = document.getElementById("skipIntro");
  const soundToggle = document.getElementById("soundToggle");

  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  const canvas = document.getElementById("particles");
  const context = canvas.getContext("2d");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const INTRO_DURATION = reducedMotion ? 1000 : 7000;

  let introStartedAt = performance.now();
  let introFinished = false;
  let soundEnabled = false;
  let animationFrame = null;

  let audioContext = null;

  const messages = [
    "INITIALIZING EXPERIENCE...",
    "ACTIVATING ENERGY SYSTEM...",
    "LOADING BRAND IDENTITY...",
    "PREPARING YOUR EXPERIENCE...",
    "WELCOME TO GODDEN TECH GLOBAL."
  ];


  /* ==========================================
     PARTICLE SYSTEM
     ========================================== */

  let particles = [];

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    createParticles();
  }

  function createParticles() {
    const count = Math.min(
      110,
      Math.floor((window.innerWidth * window.innerHeight) / 9500)
    );

    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        radius: Math.random() * 2 + 0.4,

        speedX: (Math.random() - 0.5) * 0.7,
        speedY: Math.random() * -0.7 - 0.1,

        opacity: Math.random() * 0.7 + 0.1,

        twinkle: Math.random() * 0.03 + 0.005
      });
    }
  }

  function drawParticles() {
    if (introFinished) {
      return;
    }

    context.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    particles.forEach((particle) => {

      particle.x += particle.speedX;
      particle.y += particle.speedY;

      particle.opacity +=
        Math.sin(performance.now() * particle.twinkle) * 0.003;

      if (particle.opacity < 0.1) {
        particle.opacity = 0.1;
      }

      if (particle.opacity > 0.8) {
        particle.opacity = 0.8;
      }

      if (particle.y < -10) {
        particle.y = window.innerHeight + 10;
        particle.x = Math.random() * window.innerWidth;
      }

      if (particle.x < -10) {
        particle.x = window.innerWidth + 10;
      }

      if (particle.x > window.innerWidth + 10) {
        particle.x = -10;
      }

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        `rgba(255, 25, 55, ${particle.opacity})`;

      context.shadowBlur = 12;
      context.shadowColor = "#ff1029";
      context.fill();

      context.shadowBlur = 0;


      // Draw fine energy connections near the centre.
      const distance = Math.hypot(
        particle.x - centerX,
        particle.y - centerY
      );

      if (distance < 170) {
        context.beginPath();

        context.moveTo(particle.x, particle.y);

        context.lineTo(
          centerX + (particle.x - centerX) * 0.15,
          centerY + (particle.y - centerY) * 0.15
        );

        context.strokeStyle =
          "rgba(255, 16, 41, 0.08)";

        context.lineWidth = 0.6;
        context.stroke();
      }

    });

    animationFrame = requestAnimationFrame(drawParticles);
  }


  /* ==========================================
     OPTIONAL SOUND EFFECTS
     ========================================== */

  function playTone(frequency, duration, volume = 0.025) {
    if (!soundEnabled) {
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sawtooth";

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );

      gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);

    } catch (error) {
      console.warn("Audio effects unavailable:", error);
    }
  }


  soundToggle.addEventListener("click", async () => {

    soundEnabled = !soundEnabled;

    soundToggle.textContent = soundEnabled
      ? "SOUND: ON"
      : "SOUND: OFF";

    soundToggle.setAttribute(
      "aria-pressed",
      String(soundEnabled)
    );

    if (soundEnabled) {
      playTone(180, 0.3, 0.035);
    } else if (audioContext) {
      await audioContext.suspend();
    }

  });


  /* ==========================================
     INTRO PROGRESS
     ========================================== */

  function updateIntro() {

    if (introFinished) {
      return;
    }

    const elapsed = performance.now() - introStartedAt;

    const progress = Math.min(
      100,
      Math.floor((elapsed / INTRO_DURATION) * 100)
    );

    loadingBar.style.width = progress + "%";

    const messageIndex = Math.min(
      messages.length - 1,
      Math.floor(progress / 25)
    );

    loadingText.textContent =
      messages[messageIndex] + " " + progress + "%";

    if (progress >= 100) {
      finishIntro();
      return;
    }

    requestAnimationFrame(updateIntro);
  }


  /* ==========================================
     ENTER WEBSITE
     ========================================== */

  function finishIntro() {

    if (introFinished) {
      return;
    }

    introFinished = true;

    cancelAnimationFrame(animationFrame);

    loadingBar.style.width = "100%";

    loadingText.textContent =
      "WELCOME TO GODDEN TECH GLOBAL. 100%";

    intro.classList.add("hidden");

    website.classList.add("visible");

    document.body.classList.remove("intro-active");

    // Remove the intro after its exit transition.
    window.setTimeout(() => {
      intro.style.display = "none";
    }, 1000);

    if (soundEnabled) {
      playTone(440, 0.25, 0.025);

      window.setTimeout(() => {
        playTone(660, 0.35, 0.02);
      }, 180);
    }

    revealObserver.observeElements();
  }


  skipButton.addEventListener("click", finishIntro);


  /* ==========================================
     MOBILE NAVIGATION
     ========================================== */

  menuToggle.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";

  });


  navigation.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      navigation.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.textContent = "☰";

    });

  });


  /* ==========================================
     SCROLL REVEAL
     ========================================== */

  const revealObserver = {

    observer: null,

    observeElements() {

      if (reducedMotion || !("IntersectionObserver" in window)) {
        document.querySelectorAll(
          ".category-card, .product-card, .about-content"
        ).forEach((element) => {
          element.classList.add("in-view");
        });

        return;
      }

      if (!this.observer) {

        this.observer = new IntersectionObserver(
          (entries, observer) => {

            entries.forEach((entry) => {

              if (entry.isIntersecting) {
                entry.target.classList.add("in-view");

                observer.unobserve(entry.target);
              }

            });

          },
          {
            threshold: 0.12
          }
        );

      }

      document.querySelectorAll(
        ".category-card, .product-card, .about-content"
      ).forEach((element) => {

        if (!element.classList.contains("in-view")) {

          element.classList.add("reveal");

          this.observer.observe(element);

        }

      });

    }

  };


  /* ==========================================
     3D PHONE MOUSE EFFECT
     ========================================== */

  const phone = document.querySelector(".phone");

  if (phone && !reducedMotion) {

    const heroVisual = document.querySelector(".hero-visual");

    heroVisual.addEventListener("pointermove", (event) => {

      if (event.pointerType === "touch") {
        return;
      }

      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = -24 + (x - 0.5) * 18;
      const rotateX = 5 + (0.5 - y) * 12;

      phone.style.transform =
        `translateY(-5px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

    });

    heroVisual.addEventListener("pointerleave", () => {

      phone.style.transform = "";

    });

  }


  /* ==========================================
     FOOTER YEAR
     ========================================== */

  document.getElementById("year").textContent =
    new Date().getFullYear();


  /* ==========================================
     INITIALIZE
     ========================================== */

  document.body.classList.add("intro-active");

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  if (!reducedMotion) {
    drawParticles();
  }

  introStartedAt = performance.now();

  updateIntro();

});
