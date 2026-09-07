(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // --- Scroll progress bar + sticky header shadow ---
  const progress = document.getElementById("scroll-progress");
  const header = document.querySelector(".site-header");

  function onScroll() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    progress.style.width = pct + "%";
    header.classList.toggle("scrolled", doc.scrollTop > 8);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    siteNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // --- Typed rotating role text ---
  const typedEl = document.getElementById("typed-role");
  const roles = ["Data Scientist", "Geospatial Specialist", "Forest Analytics Expert"];
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      function tick() {
        const word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            return setTimeout(tick, 1400);
          }
        } else {
          charIndex--;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 40 : 70);
      }
      tick();
    }
  }

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // --- Count-up stats ---
  const countEls = document.querySelectorAll("[data-count-to]");
  function animateCount(el) {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const countIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => countIo.observe(el));
  } else {
    countEls.forEach(animateCount);
  }

  // --- Skill bar fill on reveal ---
  const skillBars = document.querySelectorAll(".skill-bar");
  function fillSkillBar(bar) {
    const target = parseInt(bar.dataset.target, 10);
    const fill = bar.querySelector(".skill-fill");
    const pct = bar.querySelector(".skill-pct");
    if (reduceMotion) {
      fill.style.width = target + "%";
      pct.textContent = target + "%";
      return;
    }
    fill.style.width = target + "%";
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      pct.textContent = Math.round(target * t) + "%";
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const skillIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            fillSkillBar(entry.target);
            skillIo.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((bar) => skillIo.observe(bar));
  } else {
    skillBars.forEach(fillSkillBar);
  }

  // --- Portfolio data + render + filter ---
  const projects = [
    {
      title: "Web Mercator vs. Equal Earth",
      category: "gis",
      image: "assets/img/portfolio/equalearth1.png",
      summary: "Interactive world data explorer — population density, forest cover, CO₂ emissions, and urbanization as animated time-series choropleths — morphing between Web Mercator and the equal-area Equal Earth projection.",
      tags: ["D3.js", "Map projections", "Time-series choropleth", "World Bank data"],
      live: "https://pratyush-dh.github.io/projects/equal-earth-projection-benchmark/",
      source: "https://github.com/pratyush-dh/projects/tree/main/equal-earth-projection-benchmark",
    },
    {
      title: "Potato Disease Identification",
      category: "ml",
      image: "assets/img/portfolio/potatodisease2.jpg",
      summary: "Predicts potato leaf disease (early/late blight) from a leaf image. Trained via Teachable Machine on a Kaggle potato dataset and deployed as a web app.",
      tags: ["TensorFlow.js", "Kaggle", "HTML/CSS"],
      live: "https://pratyush-dh.github.io/diseasepotato.html",
      source: "https://github.com/pratyush-dh/pratyush-dh.github.io/blob/main/diseasepotato.html",
    },
    {
      title: "Satellite Image Classification (LULC)",
      category: "ml",
      image: "assets/img/portfolio/lulc1.jpg",
      summary: "Classified a Landsat 8 image of Kathmandu Valley with a fully-connected neural network at 86% accuracy; preprocessing in ArcMap, classification with TensorFlow, GDAL, and Keras Tuner.",
      tags: ["ArcMap", "Python", "GDAL", "TensorFlow"],
      details: "lulcDetails.html",
      source: "https://github.com/pratyush-dh/satellite-image-classification-using-python",
    },
    {
      title: "Swimming Pool Detection (YOLOv5)",
      category: "ml",
      image: "assets/img/portfolio/swimmingpool3.jpg",
      summary: "Transfer learning on a pretrained YOLOv5 model to detect swimming pools in satellite imagery, with training/validation data exported from the Google satellite basemap via ArcMap.",
      tags: ["YOLOv5", "PyTorch", "ArcMap", "Roboflow"],
      details: "swimmingpoolDetails.html",
      source: "https://github.com/pratyush-dh/swimming-pool-detection",
    },
    {
      title: "Myagdi Topographic Map",
      category: "gis",
      image: "assets/img/portfolio/myagdi1.jpg",
      summary: "Topographic map of Myagdi district, Nepal, with tourist areas and stream networks. Aspect map and DEM obtained via Google Earth Engine, rendered in ArcMap 10.8.2.",
      tags: ["Cartography", "ArcMap", "Google Earth Engine"],
      details: "topomapDetails.html",
      source: "https://github.com/pratyush-dh/cartography",
    },
    {
      title: "DEM to Stream Network Tool",
      category: "gis",
      image: "assets/img/portfolio/model1.jpg",
      summary: "An ArcGIS Model Builder tool that generates a stream network from a DEM and threshold value, chaining 6 hydrology operations and cutting ~83% of the manual steps.",
      tags: ["ArcGIS", "Model Builder", "Automation"],
      details: "modelDetails.html",
      source: "https://github.com/pratyush-dh/tools",
    },
    {
      title: "Real-Time Multi-Class Object Classification",
      category: "ml",
      image: "assets/img/portfolio/classifier3.jpg",
      summary: "A web app using a pretrained TensorFlow.js model with transfer learning to classify common objects in real time from the browser.",
      tags: ["Transfer learning", "TensorFlow.js", "Kaggle"],
      live: "https://pratyush-dh.github.io/classifier.html",
      source: "https://github.com/pratyush-dh/pratyush-dh.github.io/blob/main/classifier.html",
    },
    {
      title: "Airports & Flight Routes",
      category: "gis",
      image: "assets/img/portfolio/airport3.jpg",
      summary: "A map of Nepal's airports by type and their flight routes — route endpoints are accurate; the flight paths themselves are stylized for readability.",
      tags: ["Cartography", "ArcMap", "Python"],
      details: "airportDetails.html",
      source: "https://github.com/pratyush-dh/cartography",
    },
    {
      title: "Major Lakes of Nepal",
      category: "gis",
      image: "assets/img/portfolio/lake1.jpg",
      summary: "A map of Nepal's major lakes, reservoirs, and ponds — locations sourced from Wikipedia, geocoded, and processed in ArcMap 10.8.",
      tags: ["Cartography", "ArcMap", "Geocoding"],
      details: "lakesDetails.html",
      source: "https://github.com/pratyush-dh/cartography",
    },
    {
      title: "Geo Quiz",
      category: "development",
      image: "assets/img/portfolio/geoquiz1.jpg",
      summary: "A geography quiz web app: click the named country on the map and it tracks your correct vs. incorrect score.",
      tags: ["Python", "Folium", "HTML/CSS"],
      live: "https://pratyush-dh.github.io/geo-quizapp/geoquiz.html",
      source: "https://github.com/pratyush-dh/geo-quizapp",
    },
    {
      title: "Happiness Index",
      category: "development",
      image: "assets/img/portfolio/happy1.jpg",
      summary: "An interactive web map of the World Happiness Index and each country's rank from 2014 to 2022, built with Leaflet.",
      tags: ["Leaflet", "JavaScript", "Python"],
      live: "https://pratyush-dh.github.io/happiness-map/",
      source: "https://github.com/pratyush-dh/happiness-map",
    },
    {
      title: "Report Automation (Image Replace)",
      category: "development",
      image: "assets/img/portfolio/reportAutomation1.jpg",
      summary: "A Tkinter desktop tool that bulk-replaces images inside a templated Word document (parsed as a zip) to instantly regenerate per-entity reports — loopable for batch generation.",
      tags: ["Python", "Tkinter", "Automation"],
      details: "reportAutomationDetails.html",
      source: "https://github.com/pratyush-dh/report-automation",
    },
    {
      title: "Animation (Precipitation)",
      category: "development",
      image: "assets/img/portfolio/animation3.jpg",
      summary: "Pulls daily precipitation data per location from Google Earth Engine, computes annual averages, and renders an animated time-series GIF.",
      tags: ["Python", "Google Earth Engine", "Data viz"],
      details: "animationDetails.html",
      source: "https://github.com/pratyush-dh/animation",
    },
  ];

  const grid = document.getElementById("portfolio-grid");
  if (grid) {
    grid.innerHTML = projects
      .map((p) => {
        const categoryLabel = { gis: "Remote Sensing & GIS", ml: "Machine Learning", development: "Development" }[p.category];
        const links = [
          p.live ? `<a class="btn btn-small btn-primary" href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : "",
          p.details ? `<a class="btn btn-small btn-ghost" href="${p.details}">Details</a>` : "",
          p.source ? `<a class="btn btn-small btn-ghost" href="${p.source}" target="_blank" rel="noopener">Source</a>` : "",
        ].join("");
        return `
        <article class="portfolio-card" data-category="${p.category}">
          <div class="portfolio-media"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>
          <div class="portfolio-body">
            <p class="portfolio-category">${categoryLabel}</p>
            <h3>${p.title}</h3>
            <p>${p.summary}</p>
            <ul class="portfolio-tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
            <div class="portfolio-links">${links}</div>
          </div>
        </article>`;
      })
      .join("");
  }

  const filterTabs = document.getElementById("filter-tabs");
  if (filterTabs && grid) {
    filterTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-tab");
      if (!btn) return;
      filterTabs.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      grid.querySelectorAll(".portfolio-card").forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  }

  // --- Animated contour-line hero background ---
  const canvas = document.getElementById("contour-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    const lines = 14;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const styles = getComputedStyle(document.documentElement);
    function color(name) {
      return styles.getPropertyValue(name).trim();
    }

    function drawFrame(t) {
      ctx.clearRect(0, 0, width, height);
      const accent = color("--accent");
      const accent2 = color("--accent-2");
      const baseline = color("--baseline");

      for (let i = 0; i < lines; i++) {
        const yBase = (height / lines) * i + height * 0.06;
        const amp = 18 + (i % 4) * 6;
        const freq = 0.006 + (i % 3) * 0.0015;
        const phase = t * 0.00012 + i * 0.6;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = yBase + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 - phase * 1.4) * (amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = i % 5 === 0 ? accent2 : i % 3 === 0 ? accent : baseline;
        ctx.globalAlpha = i % 5 === 0 ? 0.35 : i % 3 === 0 ? 0.3 : 0.22;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      drawFrame(0);
    } else {
      function loop(t) {
        drawFrame(t);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
  }
})();
