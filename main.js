// Initialization
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
const latencyText = document.getElementById("latency-text");
const progress = document.querySelector(".progress-bar");

// 1. Unified Cursor & Progress
window.addEventListener("mousemove", (e) => {
  const { clientX: x, clientY: y } = e;
  dot.style.transform = `translate(${x}px, ${y}px)`;
  outline.animate(
    { transform: `translate(${x}px, ${y}px)` },
    { duration: 400, fill: "forwards" },
  );
});

window.addEventListener("scroll", () => {
  const scrolled =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  progress.style.width = `${scrolled}%`;
});

// 2. Elite Interaction (Magnetic & Scramble)
const scrambleText = (el) => {
  const original = el.innerText;
  const chars = "X01\_#/$%&@";
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

// 3. System Observability (Real-time Simulation)
setInterval(() => {
  if (latencyText)
    latencyText.innerText = `${Math.floor(Math.random() * 10) + 18}ms`;
  const cpu = document.getElementById("cpu-bar");
  const mem = document.getElementById("mem-bar");
  if (cpu) cpu.style.width = `${Math.floor(Math.random() * 20) + 5}%`;
  if (mem) mem.style.width = `${Math.floor(Math.random() * 15) + 40}%`;
}, 3000);

// God-Tier Form Transmission Logic
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    const originalText = btn.innerText;

    // UI Feedback: Start Transmission
    btn.innerText = "ESTABLISHING HANDSHAKE...";
    btn.style.opacity = "0.5";
    btn.disabled = true;

    const data = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // Success Animation
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
const updateClock = () => {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, "0");
  const m = String(now.getUTCMinutes()).padStart(2, "0");
  const s = String(now.getUTCSeconds()).padStart(2, "0");

  const timeString = `${h}:${m}:${s}`;
  const clockEl = document.getElementById("server-time");
  if (clockEl) clockEl.innerText = timeString;
};

// Update every second
setInterval(updateClock, 1000);
updateClock(); // Initial call
const logStream = document.getElementById("log-stream");

const addLog = (method, path) => {
  const entry = document.createElement("div");
  const latency = Math.floor(Math.random() * 40) + 5;
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];

  entry.className = `log-entry method-${method.toLowerCase()}`;
  entry.innerHTML = `[${timestamp}] ${method} ${path} - 200 OK (${latency}ms)`;

  logStream.prepend(entry); // Add to top (which is bottom due to flex-reverse)

  // Keep only the last 5 logs to save memory
  if (logStream.children.length > 5) {
    logStream.removeChild(logStream.lastChild);
  }
};

// Log section entries using Intersection Observer
const observerOptions = { threshold: 0.5 };
const logObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      addLog("GET", `/${entry.target.id}`);
    }
  });
}, observerOptions);

document
  .querySelectorAll("section")
  .forEach((section) => logObserver.observe(section));

// Log button clicks
document.querySelectorAll("button, .nav-link").forEach((el) => {
  el.addEventListener("click", (e) => {
    const destination = e.target.getAttribute("href") || "action";
    addLog("POST", `${destination}`);
  });
});
let clickBuffer = [];
const PANIC_THRESHOLD = 10;
const PANIC_WINDOW = 5000; // 5 seconds

document.addEventListener("click", () => {
  const now = Date.now();
  clickBuffer.push(now);

  // Filter clicks within the 5-second window
  clickBuffer = clickBuffer.filter((time) => now - time < PANIC_WINDOW);

  if (clickBuffer.length > PANIC_THRESHOLD) {
    triggerKernelPanic();
  }
});

function triggerKernelPanic() {
  const overlay = document.getElementById("kernel-panic");
  overlay.style.display = "flex";

  const terminal = document.getElementById("panic-terminal");
  const logs = [
    "STACK_TRACE: NullPointerException at 0x8823",
    "CRITICAL: Memory leak detected in /api/v1/buffer",
    "WARN: Circuit breaker TRIPPED",
    "SYSTEM_HALT: Dumping physical memory...",
    "STATUS: Kernel execution suspended.",
  ];

  logs.forEach((log, i) => {
    setTimeout(() => {
      const p = document.createElement("p");
      p.innerText = `> ${log}`;
      terminal.appendChild(p);
    }, i * 300);
  });

  // Handle Recovery
  const input = document.getElementById("panic-input");
  input.focus();
  input.addEventListener("input", (e) => {
    if (e.target.value.toUpperCase() === "REBOOT") {
      location.reload();
    }
  });
}
// Link to the Kernel Panic Reboot logic
const panicInput = document.getElementById("panic-input");
const elevatedSection = document.getElementById("elevated-links");
const standardLinks = document.getElementById("standard-links");

if (panicInput) {
  panicInput.addEventListener("input", (e) => {
    const val = e.target.value.toUpperCase();

    if (val === "ROOT") {
      // Unlock private contact via Terminal
      document.getElementById("kernel-panic").style.display = "none";
      unlockVault();
    }
  });
}

// Manual SUDO Button
document.getElementById("elevate-btn").addEventListener("click", () => {
  const pass = prompt("ENTER SYSTEM PASSCODE (Hint: ROOT)");
  if (pass && pass.toUpperCase() === "ROOT") {
    unlockVault();
  }
});

function unlockVault() {
  const elevatedSection = document.getElementById("elevated-links");

  // Show the hidden links without hiding the old ones
  if (elevatedSection) {
    elevatedSection.style.display = "block";

    // Log the event in your new log-stream!
    if (typeof addLog === "function") {
      addLog("AUTH", "/access/sudo-elevated-success");
    }
  }
}

// Ensure the button works
const elevateBtn = document.getElementById("elevate-btn");
if (elevateBtn) {
  elevateBtn.addEventListener("click", () => {
    const pass = prompt("ENTER SYSTEM PASSCODE (Hint: ROOT)");
    if (pass && pass.toUpperCase() === "ROOT") {
      unlockVault();
    }
  });
}

// Mobile Menu Logic
const menuTrigger = document.getElementById("mobile-menu-trigger");
const navMenu = document.querySelector(".nav-menu");

if (menuTrigger) {
  menuTrigger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    // Simple burger to X animation
    const spans = menuTrigger.querySelectorAll("span");
    spans[0].style.transform = navMenu.classList.contains("active")
      ? "rotate(45deg) translate(5px, 5px)"
      : "";
    spans[1].style.transform = navMenu.classList.contains("active")
      ? "rotate(-45deg) translate(5px, -5px)"
      : "";
  });
}

// Close menu on link click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("active"));
});

// Disable custom cursor on mobile to prevent lag
if ("ontouchstart" in window) {
  document.querySelector(".cursor-dot").style.display = "none";
  document.querySelector(".cursor-outline").style.display = "none";
}
