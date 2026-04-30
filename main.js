// ==========================================
// 1. CUSTOM CURSOR — Runs immediately
// ==========================================
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  if (!dot || !outline) return;
  const { clientX: x, clientY: y } = e;
  dot.style.transform = `translate(${x}px, ${y}px)`;
  outline.animate(
    { transform: `translate(${x}px, ${y}px)` },
    { duration: 380, fill: "forwards" },
  );
});

// Cursor scale on hoverable elements
document
  .querySelectorAll("a, button, .bento-item, .pillar-item, .image-frame")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => outline?.classList.add("hovered"));
    el.addEventListener("mouseleave", () =>
      outline?.classList.remove("hovered"),
    );
  });

// ==========================================
// 2. DEFERRED SYSTEMS
// ==========================================
window.addEventListener("load", () => {
  // --- Scroll progress bar ---
  const progress = document.querySelector(".progress-bar");
  const onScroll = () => {
    const scrolled =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    if (progress) progress.style.width = `${scrolled}%`;

    // Navbar shrink
    const navbar = document.querySelector(".navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Scroll reveal ---
  // Automatically add .reveal class to key section children
  const revealTargets = document.querySelectorAll(
    ".bento-item, .pillar-item, .api-doc-card, .terminal-premium, .access-vault, #contact-form",
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger siblings in same parent
    const siblings = Array.from(el.parentElement.children).filter((c) =>
      c.classList.contains("reveal"),
    );
    const idx = siblings.indexOf(el);
    if (idx > 0) el.classList.add(`reveal-delay-${Math.min(idx, 4)}`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  // --- Text scramble on nav + logo + tags ---
  const scramble = (el) => {
    const original = el.dataset.originalText || el.innerText;
    el.dataset.originalText = original;
    const chars = "X01_#/$%&@";
    let iteration = 0;
    clearInterval(el._scrambleInterval);
    el._scrambleInterval = setInterval(() => {
      el.innerText = original
        .split("")
        .map((l, i) =>
          i < iteration ? original[i] : chars[Math.floor(Math.random() * 10)],
        )
        .join("");
      if (iteration >= original.length) {
        clearInterval(el._scrambleInterval);
        el.innerText = original; // Restore cleanly
      }
      iteration += 1 / 3;
    }, 28);
  };

  document.querySelectorAll(".nav-link, .logo-text").forEach((el) => {
    el.addEventListener("mouseenter", () => scramble(el));
  });

  // --- Magnetic buttons ---
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  // --- System monitor bars ---
  const cpu = document.getElementById("cpu-bar");
  const mem = document.getElementById("mem-bar");
  setInterval(() => {
    if (cpu) cpu.style.width = `${Math.floor(Math.random() * 20) + 5}%`;
    if (mem) mem.style.width = `${Math.floor(Math.random() * 15) + 40}%`;
  }, 3200);

  // --- UTC Clock ---
  const updateClock = () => {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, "0");
    const m = String(now.getUTCMinutes()).padStart(2, "0");
    const s = String(now.getUTCSeconds()).padStart(2, "0");
    const el = document.getElementById("server-time");
    if (el) el.innerText = `${h}:${m}:${s}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // --- Log stream ---
  const logStream = document.getElementById("log-stream");
  const addLog = (method, path) => {
    if (!logStream) return;
    const entry = document.createElement("div");
    const latency = Math.floor(Math.random() * 40) + 5;
    const ts = new Date().toISOString().split("T")[1].split(".")[0];
    entry.className = `log-entry method-${method.toLowerCase()}`;
    entry.textContent = `[${ts}] ${method} ${path} — 200 OK (${latency}ms)`;
    logStream.prepend(entry);
    if (logStream.children.length > 6)
      logStream.removeChild(logStream.lastChild);
  };

  const logObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.target.id) addLog("GET", `/${e.target.id}`);
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll("section").forEach((s) => logObserver.observe(s));

  document.querySelectorAll("button, .nav-link").forEach((el) => {
    el.addEventListener("click", (e) => {
      const dest =
        e.target.getAttribute("href") ||
        e.target.innerText.toLowerCase().replace(/\s/g, "_");
      addLog("POST", `/${dest}`);
    });
  });

  // --- Contact form ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      btn.textContent = "ESTABLISHING HANDSHAKE...";
      btn.style.opacity = "0.5";
      btn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactForm.innerHTML = `
            <div class="success-state">
              <div class="terminal-loader">
                <p class="command">> encrypting_payload...</p>
                <p class="command">> routing_to_gateway...</p>
                <p class="status">● DATA_TRANSMITTED_SUCCESSFULLY</p>
              </div>
              <h3 class="italic-serif" style="font-size: 2rem; margin-top: 20px;">Inquiry Received.</h3>
              <p style="color: var(--text-mid); margin-top: 0.5rem;">I'll review your message and respond promptly.</p>
            </div>
          `;
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = "TRANSMISSION_FAILED. RE-TRY?";
        btn.style.opacity = "1";
        btn.disabled = false;
      }
    });
  }

  // --- Kernel panic (10 clicks in 5s) ---
  let clickBuffer = [];
  document.addEventListener("click", () => {
    const now = Date.now();
    clickBuffer.push(now);
    clickBuffer = clickBuffer.filter((t) => now - t < 5000);
    if (clickBuffer.length > 10) triggerKernelPanic();
  });

  function triggerKernelPanic() {
    const overlay = document.getElementById("kernel-panic");
    if (!overlay) return;
    overlay.style.display = "flex";
    clickBuffer = [];
    const terminal = document.getElementById("panic-terminal");
    const logs = [
      "STACK_TRACE: NullPointerException at 0x8823",
      "CRITICAL: Memory leak detected in /api/v1/buffer",
      "WARN: Circuit breaker TRIPPED",
      "SYSTEM_HALT: Dumping physical memory...",
      "STATUS: Kernel execution suspended.",
    ];
    if (terminal) {
      terminal.innerHTML = "";
      logs.forEach((log, i) => {
        setTimeout(() => {
          const p = document.createElement("p");
          p.textContent = `> ${log}`;
          terminal.appendChild(p);
        }, i * 300);
      });
    }
    const input = document.getElementById("panic-input");
    if (input) {
      input.focus();
      const fresh = input.cloneNode(true);
      input.parentNode.replaceChild(fresh, input);
      fresh.addEventListener("input", (e) => {
        const val = e.target.value.toUpperCase();
        if (val === "REBOOT") location.reload();
        if (val === "ROOT") {
          overlay.style.display = "none";
          unlockVault();
        }
      });
    }
  }

  // --- SUDO access vault ---
  const elevateBtn = document.getElementById("elevate-btn");
  if (elevateBtn) {
    elevateBtn.addEventListener("click", () => {
      const pass = prompt("ENTER SYSTEM PASSCODE (Hint: ROOT)");
      if (pass?.toUpperCase() === "ROOT") unlockVault();
    });
  }

  function unlockVault() {
    const section = document.getElementById("elevated-links");
    if (section) {
      section.style.display = "block";
      addLog("AUTH", "/access/sudo-elevated-success");
    }
  }

  // --- Mobile menu ---
  const menuTrigger = document.getElementById("mobile-menu-trigger");
  const navMenu = document.querySelector(".nav-menu");

  if (menuTrigger && navMenu) {
    menuTrigger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const spans = menuTrigger.querySelectorAll("span");
      const isActive = navMenu.classList.contains("active");
      if (spans.length >= 2) {
        spans[0].style.transform = isActive
          ? "rotate(45deg) translate(5px, 5px)"
          : "";
        spans[spans.length - 1].style.transform = isActive
          ? "rotate(-45deg) translate(5px, -5px)"
          : "";
      }
      if (spans.length === 3) spans[1].style.opacity = isActive ? "0" : "1";
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuTrigger.querySelectorAll("span").forEach((s) => {
          s.style.transform = "";
          s.style.opacity = "1";
        });
      });
    });
  }

  // --- Performance metrics in footer ---
  const navEntry = performance.getEntriesByType("navigation")[0];
  if (navEntry) {
    const ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
    const domTime = Math.round(
      navEntry.domContentLoadedEventEnd - navEntry.startTime,
    );
    const ltEl = document.getElementById("load-time");
    const dtEl = document.getElementById("dom-ready");
    if (ltEl) ltEl.textContent = `TTFB: ${ttfb}ms`;
    if (dtEl) dtEl.textContent = `DOM: ${domTime}ms`;
  }
}); // end load

// ==========================================
// 3. TERMINAL TYPING — Intersection-triggered
// ==========================================
function initTerminalTyping() {
  const terminalBody = document.querySelector(".terminal-body");
  if (!terminalBody) return;

  const lines = Array.from(terminalBody.children);
  const lineData = lines.map((line) => {
    const html = line.innerHTML;
    const text = line.textContent;
    const isCmd = line.classList.contains("command");
    line.innerHTML = "";
    return { element: line, html, text, isCmd };
  });

  let currentLine = 0;

  function processNextLine() {
    if (currentLine >= lineData.length) return;
    const { element, html, text, isCmd } = lineData[currentLine];

    if (isCmd) {
      let charIdx = 0;
      element.classList.add("typing-cursor");
      const iv = setInterval(() => {
        element.textContent = text.slice(0, ++charIdx);
        if (charIdx === text.length) {
          clearInterval(iv);
          element.classList.remove("typing-cursor");
          currentLine++;
          setTimeout(processNextLine, 180);
        }
      }, 36);
    } else {
      element.innerHTML = html;
      currentLine++;
      setTimeout(processNextLine, 560);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        processNextLine();
        observer.disconnect();
      }
    },
    { threshold: 0.4 },
  );

  observer.observe(terminalBody);
}

initTerminalTyping();
