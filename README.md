# Aura Startpage

A high-performance, minimalist start page extension for the Brave browser. Built as a local Manifest V3 extension with 0ms load latency, zero tracking, and deep design craftsmanship.

![Aura Startpage Preview](https://img.shields.io/badge/Manifest-V3-blue) ![Brave Browser](https://img.shields.io/badge/Browser-Brave%20%2F%20Chromium-orange) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Zero Latency**: 100% offline, zero network requests, instant loading on every new tab (`Ctrl + T`).
- **Precision 6x2 Layout**: 12 curated shortcuts for daily productivity and AI workflows.
- **Dynamic Themes**:
  - **Midnight Navy**: NightTab dark canvas with clean monochrome white icons blooming on hover.
  - **Navy Signature**: Original dark navy canvas with signature brand colors at rest.
  - **Prism Gradients**: Full multi-stop vibrant brand gradients across all icons.
  - **Cyberpunk Neon**: OLED pitch black with electric magenta and cyan gradients.
  - **Titanium Stealth**: Pure achromatic matte graphite aesthetic.
- **Smooth Physics & Motion**:
  - 6px lift with luminous brand accent bloom on hover (`cubic-bezier(0.2, 0.85, 0.32, 1.2)`).
  - 40ms snappy tactile compression (`scale(0.95)`) on click.
- **Accessible & Clean**:
  - Full 2D keyboard arrow navigation (`Left`, `Right`, `Up`, `Down`).
  - Opens all links in new tab (`target="_blank"`).
- **Discreet Theme Toolbar**: Floating bottom-right theme switcher with persistent settings via `localStorage`.

---

## Shortcuts Included

| Row | Service | URL | Icon Style |
|:---:|:---|:---|:---|
| **1** | X | `https://x.com` | Official X Vector |
| **1** | Instagram | `https://instagram.com` | Camera Outline |
| **1** | YouTube | `https://youtube.com` | YouTube Play |
| **1** | YouTube Music | `https://music.youtube.com` | Circular Record Play |
| **1** | LinkedIn | `https://linkedin.com` | Official LinkedIn Mark |
| **1** | LMS+ | `https://lmsplus.xyz/lms/monitor` | Authentic Foul Anchor with Coiled Rope |
| **2** | Grok | `https://grok.com` | xAI Grok Glyph |
| **2** | Gemini | `https://gemini.google.com` | 4-point Sparkle |
| **2** | ChatGPT | `https://chatgpt.com` | OpenAI Rosette |
| **2** | NotebookLM | `https://notebooklm.google.com` | Google NotebookLM Book |
| **2** | Claude | `https://claude.ai` | Anthropic Claude Starburst |
| **2** | Perplexity | `https://perplexity.ai` | Perplexity Asterisk |

---

## Installation in Brave

1. Open Brave and go to `brave://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** (top-left button).
4. Select this directory (`sami-startpage`).
5. Open a new tab (`Ctrl + T`).

---

## Customization

Shortcuts and URLs can be easily customized in `scripts/config.js`.
