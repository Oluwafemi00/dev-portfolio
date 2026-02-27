# 🌐 Femi Oladele | Software Engineer Portfolio

[![Live Deployment](https://img.shields.io/badge/Live_Deployment-Operational-27c93f?style=for-the-badge)](https://oluwafemi00.github.io/dev-portfolio/)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla_JS-c5a059?style=for-the-badge)]()

[![Performance](https://img.shields.io/badge/Lighthouse-98%25-success?style=for-the-badge)]()

A high-performance, zero-dependency digital portfolio and engineering log engineered to showcase backend architecture, API design, and full-stack capabilities.

## The Architecture

This project was built deliberately without heavy frontend frameworks (like React or Vue) to demonstrate absolute control over the Document Object Model (DOM), browser APIs, and the Critical Rendering Path.

By utilizing a **Gold & Slate** design system, the interface mimics a high-end command center, prioritizing readability, structural hierarchy, and system observability.

## Core Features

- **Bento Grid Layout:** CSS Grid architecture optimized for dynamic content flow across all viewport sizes.
- **System Observability UI:** Real-time simulated latency tracking and resource monitoring (CPU/MEM) integrated into the navigation layer.
- **Live Request Logger:** An `IntersectionObserver` based logger that tracks DOM section entries and visualizes them as HTTP request streams in the footer.
- **Access Control Vault:** A role-based access control (RBAC) simulation requiring a `SUDO` passcode to decrypt private contact endpoints.
- **Kernel Panic Defense:** A click-rate limiter that acts as a circuit breaker. Rapid-fire requests trigger a "FATAL_EXCEPTION" overlay, requiring a manual terminal reboot command.
- **Native PDF Engine:** The resume subsystem utilizes strict `@media print` CSS directives to generate an ATS-compliant, text-searchable PDF directly from the browser's native print API, bypassing the need for bloated third-party libraries.

## Tech Stack

- **Structure:** HTML5 (Semantic & Accessible)
- **Styling:** CSS3 (Custom Properties, Flexbox/Grid, CSS Animations, Glassmorphism)
- **Logic:** Vanilla JavaScript (ES6+, DOM Manipulation, Asynchronous Fetch)
- **Data Transmission:** Formspree API (Asynchronous payload routing)
- **Typography:** Inter & Playfair Display
- **Icons:** FontAwesome 6
