(function () {
  "use strict";


  const tooltip = document.getElementById("tooltip");

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
      
      showTooltip(el, e.clientX, e.clientY - 6);
    });
    el.addEventListener("mouseleave", hideTooltip);

   
    el.addEventListener("focus", () => {
      const rect = el.getBoundingClientRect();
      showTooltip(el, rect.left + rect.width / 2, rect.top);
    });
    el.addEventListener("blur", hideTooltip);
  });


  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);


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


  let lastTapped = null;
  document.querySelectorAll(".hotspot").forEach((el) => {
    el.addEventListener("click", (e) => {
     
      if (window.matchMedia("(hover: hover)").matches) return;

      if (lastTapped !== el) {
        e.preventDefault();
        lastTapped = el;
        const rect = el.getBoundingClientRect();
        showTooltip(el, rect.left + rect.width / 2, rect.top);
        
        clearTimeout(el._tapTimer);
        el._tapTimer = setTimeout(() => {
          lastTapped = null;
          hideTooltip();
        }, 2200);
      } else {
        
        lastTapped = null;
        hideTooltip();
      }
    });
  });

    
  const hourHand   = document.querySelector(".hand-hour");
  const minuteHand = document.querySelector(".hand-minute");
  const secondHand = document.querySelector(".hand-second");

  function updateClock() {
    if (!hourHand) return;
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    secondHand.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${m * 6}deg)`;
    hourHand.style.transform   = `translateX(-50%) rotate(${h * 30}deg)`;
  }
  updateClock();
  setInterval(updateClock, 1000);

 
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
})();