(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  // hero thumbnail fade-in (single load moment)
  document.querySelectorAll('#hero-strip img').forEach((img, i) => {
    setTimeout(() => img.classList.add('in'), 600 + i * 90);
  });

  // one clean reveal per section: about media/copy + every .reveal section
  const singleReveal = document.querySelectorAll('#about-img, #about-copy, .reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  singleReveal.forEach(el => io.observe(el));

  // hero fade on scroll (the one signature scroll moment)
  const heroInner = document.querySelector('.hero-inner');
  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;
    const progress = Math.min(window.scrollY / (vh * 0.8), 1);
    heroInner.style.opacity = 1 - progress;
    heroInner.style.transform = `translateY(${-progress * 30}px)`;
  }, { passive: true });

  // capabilities pinned crossfade — the core scroll-driven narrative
  const capWrap = document.getElementById('capabilities');
  const capBgImgs = document.querySelectorAll('.cap-bg img');
  const capPanels = document.querySelectorAll('.cap-panel');
  const capDots = document.querySelectorAll('.dot-row');
  let lastIndex = -1;

  function updateCapabilities() {
    const rect = capWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = capWrap.offsetHeight - vh;
    const scrolled = -rect.top;
    let progress = total > 0 ? scrolled / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    let index = Math.min(3, Math.max(0, Math.floor(progress * 4)));
    if (index !== lastIndex) {
      capBgImgs.forEach(img => img.classList.toggle('active', +img.dataset.i === index));
      capPanels.forEach(p => p.classList.toggle('active', +p.dataset.i === index));
      capDots.forEach(d => d.classList.toggle('active', +d.dataset.i === index));
      lastIndex = index;
    }
  }
  window.addEventListener('scroll', updateCapabilities, { passive: true });
  updateCapabilities();

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
          p.live ? `<a class="primary" href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : "",
          p.details ? `<a href="${p.details}">Details</a>` : "",
          p.source ? `<a href="${p.source}" target="_blank" rel="noopener">Source</a>` : "",
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
})();
