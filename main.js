// ==========================================
// 1. CRITICAL UI (Runs Immediately)
// ==========================================
// We keep the cursor logic outside the load event so it feels instantly responsive.
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

// Let CSS handle hiding the cursor on mobile (@media pointer: coarse)
window.addEventListener("mousemove", (e) => {
  if (!dot || !outline) return;
  const { clientX: x, clientY: y } = e;
  dot.style.transform = `translate(${x}px, ${y}px)`;
  outline.animate(
    { transform: `translate(${x}px, ${y}px)` },
    { duration: 400, fill: "forwards" },
  );
});

// ==========================================
// 2. NON-CRITICAL SYSTEMS (Deferred to drop TBT)
// ==========================================
window.addEventListener("load", () => {
  // --- Progress Bar ---
  const progress = document.querySelector(".progress-bar");
  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    if (progress) progress.style.width = `${scrolled}%`;
  });

  // --- Elite Interaction (Magnetic & Scramble) ---
  const scrambleText = (el) => {
    const original = el.innerText;
    const chars = "X01_#/$%&@";
    let iteration = 0;
    const interval = setInterval(() => {
      el.innerText = original
        .split("")
        .map((l, i) =>
          i < iteration ? original[i] : chars[Math.floor(Math.random() * 10)],
        )
        .join("");
      if (iteration >= original.length) clearInterval(interval);
      iteration += 1 / 4;
    }, 30);
  };

  document.querySelectorAll(".nav-link, .tag, .logo-text").forEach((el) => {
    el.addEventListener("mouseenter", (e) => scrambleText(e.target));
  });

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    el.addEventListener(
      "mouseleave",
      () => (el.style.transform = `translate(0, 0)`),
    );
  });

  // --- System Observability & Clocks ---
  const latencyText = document.getElementById("latency-text");
  const cpu = document.getElementById("cpu-bar");
  const mem = document.getElementById("mem-bar");

  setInterval(() => {
    if (latencyText)
      latencyText.innerText = `${Math.floor(Math.random() * 10) + 18}ms`;
    if (cpu) cpu.style.width = `${Math.floor(Math.random() * 20) + 5}%`;
    if (mem) mem.style.width = `${Math.floor(Math.random() * 15) + 40}%`;
  }, 3000);

  const updateClock = () => {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, "0");
    const m = String(now.getUTCMinutes()).padStart(2, "0");
    const s = String(now.getUTCSeconds()).padStart(2, "0");
    const clockEl = document.getElementById("server-time");
    if (clockEl) clockEl.innerText = `${h}:${m}:${s}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // --- Log Stream (Intersection Observer) ---
  const logStream = document.getElementById("log-stream");
  const addLog = (method, path) => {
    if (!logStream) return;
    const entry = document.createElement("div");
    const latency = Math.floor(Math.random() * 40) + 5;
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    entry.className = `log-entry method-${method.toLowerCase()}`;
    entry.innerHTML = `[${timestamp}] ${method} ${path} - 200 OK (${latency}ms)`;
    logStream.prepend(entry);
    if (logStream.children.length > 5)
      logStream.removeChild(logStream.lastChild);
  };

  const logObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          addLog("GET", `/${entry.target.id}`);
        }
      });
    },
    { threshold: 0.5 },
  );
  document
    .querySelectorAll("section")
    .forEach((section) => logObserver.observe(section));

  document.querySelectorAll("button, .nav-link").forEach((el) => {
    el.addEventListener("click", (e) => {
      const destination = e.target.getAttribute("href") || "action";
      addLog("POST", `${destination}`);
    });
  });

  // --- God-Tier Form Transmission ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      btn.innerText = "ESTABLISHING HANDSHAKE...";
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
              <p style="color: var(--text-dim);">The architectural review has begun. I will respond shortly.</p>
            </div>
          `;
        } else {
          throw new Error();
        }
      } catch (error) {
        btn.innerText = "TRANSMISSION_FAILED. RE-TRY?";
        btn.style.opacity = "1";
        btn.disabled = false;
      }
    });
  }

  // --- Kernel Panic System ---
  let clickBuffer = [];
  document.addEventListener("click", () => {
    const now = Date.now();
    clickBuffer.push(now);
    clickBuffer = clickBuffer.filter((time) => now - time < 5000);
    if (clickBuffer.length > 10) triggerKernelPanic();
  });

  function triggerKernelPanic() {
    const overlay = document.getElementById("kernel-panic");
    if (!overlay) return;
    overlay.style.display = "flex";
    const terminal = document.getElementById("panic-terminal");
    const logs = [
      "STACK_TRACE: NullPointerException at 0x8823",
      "CRITICAL: Memory leak detected in /api/v1/buffer",
      "WARN: Circuit breaker TRIPPED",
      "SYSTEM_HALT: Dumping physical memory...",
      "STATUS: Kernel execution suspended.",
    ];
    if (terminal) {
      terminal.innerHTML = ""; // Clear existing logs
      logs.forEach((log, i) => {
        setTimeout(() => {
          const p = document.createElement("p");
          p.innerText = `> ${log}`;
          terminal.appendChild(p);
        }, i * 300);
      });
    }
    const input = document.getElementById("panic-input");
    if (input) {
      input.focus();
      // Remove old listeners to prevent stacking
      const new_input = input.cloneNode(true);
      input.parentNode.replaceChild(new_input, input);
      new_input.addEventListener("input", (e) => {
        const val = e.target.value.toUpperCase();
        if (val === "REBOOT") location.reload();
        if (val === "ROOT") {
          overlay.style.display = "none";
          unlockVault();
        }
      });
    }
  }

  // --- Access Vault (SUDO) ---
  const elevateBtn = document.getElementById("elevate-btn");
  if (elevateBtn) {
    elevateBtn.addEventListener("click", () => {
      const pass = prompt("ENTER SYSTEM PASSCODE (Hint: ROOT)");
      if (pass && pass.toUpperCase() === "ROOT") unlockVault();
    });
  }

  function unlockVault() {
    const elevatedSection = document.getElementById("elevated-links");
    if (elevatedSection) {
      elevatedSection.style.display = "block";
      addLog("AUTH", "/access/sudo-elevated-success");
    }
  }

  // --- Mobile Menu Logic ---
  const menuTrigger = document.getElementById("mobile-menu-trigger");
  const navMenu = document.querySelector(".nav-menu");

  if (menuTrigger && navMenu) {
    menuTrigger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const spans = menuTrigger.querySelectorAll("span");
      const isActive = navMenu.classList.contains("active");

      // Safely handle 2 or 3 spans depending on your HTML setup
      if (spans.length >= 2) {
        spans[0].style.transform = isActive
          ? "rotate(45deg) translate(5px, 5px)"
          : "";
        spans[spans.length - 1].style.transform = isActive
          ? "rotate(-45deg) translate(5px, -5px)"
          : "";
      }
      if (spans.length === 3) {
        spans[1].style.opacity = isActive ? "0" : "1";
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const spans = menuTrigger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "";
          span.style.opacity = "1";
        });
      });
    });
  }
});
