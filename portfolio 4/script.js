(function () {
  "use strict";

  /* ---------- Tooltip system ---------- */
  const tooltip = document.getElementById("tooltip");

  // Any element with data-tip OR data-title gets a tooltip
  const tipTargets = document.querySelectorAll("[data-tip], [data-title]");

  function buildTipHTML(el) {
    const title = el.getAttribute("data-title");
    const tip = el.getAttribute("data-tip") || el.getAttribute("data-desc");
    let html = "";
    if (title) html += `<strong>${escapeHTML(title)}</strong>`;
    if (tip)   html += escapeHTML(tip);
    if (!html && title) html = `<strong>${escapeHTML(title)}</strong>`;
    return html;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showTooltip(el, x, y) {
    
    tooltip.innerHTML = buildTipHTML(el);
    tooltip.style.left = x + "px";
    tooltip.style.top  = y + "px";
    tooltip.classList.add("is-visible");
  }

  function hideTooltip() {
    tooltip.classList.remove("is-visible");
  }

  tipTargets.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      showTooltip(el, x, y);
    });
    el.addEventListener("mousemove", (e) => {
      // Smoothly track cursor for a more responsive feel
      showTooltip(el, e.clientX, e.clientY - 6);
    });
    el.addEventListener("mouseleave", hideTooltip);

    // Keyboard accessibility
    el.addEventListener("focus", () => {
      const rect = el.getBoundingClientRect();
      showTooltip(el, rect.left + rect.width / 2, rect.top);
    });
    el.addEventListener("blur", hideTooltip);
  });

  // Hide tooltip when scrolling/resizing
  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);

  /* ---------- Smooth scroll for nav anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- Touch: tap a hotspot once to preview, twice to navigate ---------- */
  // Lets mobile/tablet users see the description before being whisked away.
  let lastTapped = null;
  document.querySelectorAll(".hotspot").forEach((el) => {
    el.addEventListener("click", (e) => {
      // If the device supports hover, let click behave normally.
      if (window.matchMedia("(hover: hover)").matches) return;

      if (lastTapped !== el) {
        e.preventDefault();
        lastTapped = el;
        const rect = el.getBoundingClientRect();
        showTooltip(el, rect.left + rect.width / 2, rect.top);
        // Auto-clear after a moment so a fresh tap re-previews
        clearTimeout(el._tapTimer);
        el._tapTimer = setTimeout(() => {
          lastTapped = null;
          hideTooltip();
        }, 2200);
      } else {
        // second tap → navigate
        lastTapped = null;
        hideTooltip();
      }
    });
  });
})();