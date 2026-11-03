(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

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
  const capPanels = document.querySelectorAll('.cap-panel');
  const capDots = document.querySelectorAll('.dot-row');
  const CAP_PANEL_COUNT = capPanels.length;
  const isMobileCap = () => window.matchMedia('(max-width: 820px)').matches;
  let lastIndex = -1;

  function updateCapabilities() {
    if (isMobileCap()) return; // stacked, non-pinned layout on mobile — no JS toggling needed
    const rect = capWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = capWrap.offsetHeight - vh;
    const scrolled = -rect.top;
    let progress = total > 0 ? scrolled / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    let index = Math.min(CAP_PANEL_COUNT - 1, Math.max(0, Math.floor(progress * CAP_PANEL_COUNT)));
    if (index !== lastIndex) {
      capPanels.forEach(p => p.classList.toggle('active', +p.dataset.i === index));
      capDots.forEach(d => d.classList.toggle('active', +d.dataset.i === index));
      lastIndex = index;
    }
  }
  window.addEventListener('scroll', updateCapabilities, { passive: true });
  updateCapabilities();

  // --- Resume / Portfolio expand-on-click overlays ---
  const overlayPanels = document.querySelectorAll('.overlay-panel');
  function openOverlay(id) {
    const panel = document.getElementById(id);
    if (!panel) return;
    overlayPanels.forEach(p => p.classList.remove('open'));
    panel.classList.add('open');
    document.body.classList.add('overlay-open');
  }
  function closeOverlays() {
    overlayPanels.forEach(p => p.classList.remove('open'));
    document.body.classList.remove('overlay-open');
  }
  document.querySelectorAll('[data-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openOverlay(trigger.dataset.open);
    });
  });
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', closeOverlays);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlays();
  });

  // --- Portfolio data + render + filter ---
  const projects = [
    {
      title: "Web Mercator vs. Equal Earth",
      category: "gis",
      reel: { cap: "Web Mercator vs. Equal Earth", sub: "Cartography", img: "assets/img/portfolio/equalearth1.png", n: 13 },
      image: "assets/img/portfolio/equalearth1.png",
      summary: "Interactive world data explorer — population density, forest cover, CO₂ emissions, and urbanization as animated time-series choropleths — morphing between Web Mercator and the equal-area Equal Earth projection.",
      tags: ["D3.js", "Map projections", "Time-series choropleth", "World Bank data"],
      live: "https://pratyush-dh.github.io/projects/equal-earth-projection-benchmark/",
      source: "https://github.com/pratyush-dh/projects/tree/main/equal-earth-projection-benchmark",
    },
    {
      title: "US Forest Inventory Explorer (FIADB)",
      category: "gis",
      reel: { cap: "US Forest Inventory Explorer", sub: "Web app · FIADB", img: "assets/img/portfolio/foreststandprofile1.png", n: 12 },
      image: "assets/img/portfolio/foreststandprofile1.png",
      summary: "Interactive choropleth built on live USDA FIADB-API queries — volume, biomass, growth, mortality, removals, sawlog stock, and forest area by stand-size class, at state, county, and national level, with per-acre density views, a zoomable county drill-down, and a monthly GitHub Actions pipeline that re-pulls the data and opens a PR automatically.",
      tags: ["D3.js", "USDA FIADB-API", "Forest inventory", "Python", "GitHub Actions"],
      live: "https://pratyush-dh.github.io/projects/fia-forest-stand-profile/",
      source: "https://github.com/pratyush-dh/projects/tree/main/fia-forest-stand-profile",
    },
    {
      title: "FIA Tree Height Codes, Part 1: Crews vs. a Height Model",
      category: "biometrics",
      reel: { cap: "FIA tree-height bias", sub: "Forest biometrics", img: "assets/img/portfolio/fiaheightbias1.jpg", n: 9 },
      image: "assets/img/portfolio/fiaheightbias1.jpg",
      summary: "An analysis of how the USDA Forest Service's FIA program records tree height: species x ecodivision height-diameter models trained only on field-measured trees, used to check crew-reconstructed heights on broken-top trees, with regional bias maps, a stump-height test, and a check against each tree's earlier measured height.",
      tags: ["Data analysis", "USDA FIADB", "PostgreSQL/PostGIS", "Python"],
      live: "https://pratyush-dh.github.io/projects/blog/",
      source: "https://github.com/pratyush-dh/projects/tree/main/blog/side_htcd2",
    },
    {
      title: "FIA Tree Height Codes, Part 2: FIA's Own Height Model",
      category: "biometrics",
      reel: { cap: "FIA's own height model", sub: "Data validation", img: "assets/img/portfolio/fiaheighthtcd4_1.jpg", n: 11 },
      image: "assets/img/portfolio/fiaheighthtcd4_1.jpg",
      summary: "FIA's own undocumented height model (HTCD 4, for trees never measured at all) checked against the same regional height-diameter model from Part 1, and against a remeasurement-based benchmark built from each tree's own measurement history. Diameter-only models substantially underestimate growth on larger trees; FIA's own estimate tracks the benchmark closely, likely because it shares that benchmark's input rather than being independently more accurate.",
      tags: ["Data analysis", "USDA FIADB", "SQLite", "Python"],
      live: "https://pratyush-dh.github.io/projects/blog/htcd4/",
      source: "https://github.com/pratyush-dh/projects/tree/main/blog/side_htcd4",
    },
    {
      title: "FIA Tree Height Codes, Part 3: Carbon Density by Ecoregion",
      category: "biometrics",
      reel: { cap: "Carbon density by ecoregion", sub: "Forest biometrics", img: "assets/img/portfolio/fiaheightcarbon_1.jpg", n: 10 },
      image: "assets/img/portfolio/fiaheightcarbon_1.jpg",
      summary: "Live-tree carbon density compared across 35 Cleland ecodivisions (Welch's ANOVA, Kruskal-Wallis, Games-Howell/Dunn-Holm post-hoc): a design-based (FIA post-stratified) regional spread of about 29-fold, but also a high within-division coefficient of variation, traced to FIA's sample design targeting state and national, not ecoregion-level, estimates. The highest-carbon divisions turn out to be the same ones leaning hardest on Part 2's FIA-modeled tree heights.",
      tags: ["Data analysis", "USDA FIADB", "SQLite", "Python"],
      live: "https://pratyush-dh.github.io/projects/blog/carbon-by-ecoregion/",
      source: "https://github.com/pratyush-dh/projects/tree/main/blog/carbon_ecoregion",
    },
    {
      title: "FIA Tree Measurement Distributions",
      category: "biometrics",
      image: "assets/img/portfolio/fiadistributions_1.jpg",
      summary: "An interactive dashboard of live-tree diameter, height, biomass, and volume from FIADB, with an adjustable bin count, a two-variable scatter plot, and region/state scoping, all computed client-side from a stratified 82,279-tree sample. Raw tree counts show an artificial dip-then-spike right at the 5-inch microplot/subplot threshold; weighting each tree by trees-per-acre corrects it into the smooth reverse-J diameter distribution expected of a natural, uneven-aged forest.",
      tags: ["Data visualization", "USDA FIADB", "D3.js", "Interactive dashboard"],
      live: "https://claude.ai/artifact/KsQBDMiLRx3vu3P3rgWEiR",
      source: "https://github.com/pratyush-dh/projects/tree/main/blog/distribution_check",
    },
    {
      title: "US Wood-Products Mills, a Working Sample",
      category: "gis",
      reel: { cap: "US wood-products mills", sub: "Cartography", img: "assets/img/portfolio/woodmills1.png", n: 8 },
      image: "assets/img/portfolio/woodmills1.png",
      summary: "A zoomable, pannable map of about 196 US pulp, paper, sawmill, plywood, OSB and MDF mills, 1860 to present, compiled from public web sources rather than an official registry. Type-coded markers, a play/scrub timeline of openings and closures, a mill-type filter, click-to-pin detail cards, and support for loading your own CSV. Also includes a print-style static map poster (five enlarged frames, Alaska and Hawaii insets) with the GIS layers behind it: WGS84 and projected GeoJSON and shapefiles, a QGIS style, a QA report and the Python build scripts.",
      tags: ["D3.js", "Cartography", "Time-series map", "QGIS", "Python", "Forest products"],
      live: "https://pratyush-dh.github.io/forestry-maps/wood-mills/",
      source: "https://github.com/pratyush-dh/forestry-maps/tree/main/wood-mills",
    },
    {
      title: "Nearest Mill, Mapped: Voronoi Catchments of U.S. Wood Mills",
      category: "gis",
      reel: { cap: "Nearest-mill catchments", sub: "Cartography · Voronoi", img: "assets/img/portfolio/voronoi-mills.jpg", n: 1 },
      image: "assets/img/portfolio/voronoi-mills.jpg",
      summary: "A Voronoi polygon for each of 116 open wood-mill sites in the lower 48 states: the area closer to that mill than to any other, coloured by the FIA forest removals inside it per square kilometre. Mill shapes show type and sizes show the wood in the polygon. Polygons differ 481-fold in area but only 79-fold in wood, so a small polygon mostly means a dense mill network, not a rich forest, and 92 mills receive less wood by road than their polygon holds. An interactive web map switches between the straight-line polygons and road-time polygons (the mill each place reaches fastest on the road network): by road a different mill is nearest for 24% of the land but only 15% of the wood changes mill. Also a print-size poster (36 x 25 in, PNG and vector PDF) and both sets of polygons as a two-layer GeoPackage. A model, and the mill list is a sample.",
      tags: ["Cartography", "Voronoi", "Choropleth", "FIA", "Python", "GeoPackage"],
      live: "https://pratyush-dh.github.io/forestry-maps/voronoi-mill-catchments/",
      source: "https://github.com/pratyush-dh/forestry-maps/tree/main/voronoi-mill-catchments",
    },
    {
      title: "Forest to Mill: Where Wood Moves by Road",
      category: "gis",
      reel: { cap: "Forest to mill", sub: "Cartography · Web map", img: "assets/img/portfolio/forest-to-mill.jpg", n: 2 },
      image: "assets/img/portfolio/forest-to-mill.jpg",
      summary: "Modelled wood-haul traffic from FIA forest removals to 117 open wood mills across the lower 48 states: every forest hex sends its wood to all the mills it can reach by road, and road thickness is the wood summed over every route. Set the haul-time cap, how freely wood goes to farther mills, and whether a county's removals fall evenly or by NLCD tree canopy; click a patch, a mill or any chart bar and the map zooms to it. Includes print-style static maps and a GeoPackage of the hex, road, mill and state layers for a 13-state southern close-up. A model, not a traffic count; the mill list is a sample.",
      tags: ["Cartography", "Road-network routing", "NLCD tree canopy", "FIA", "Canvas", "QGIS", "Python"],
      live: "https://pratyush-dh.github.io/forestry-maps/forest-to-mill/",
      source: "https://github.com/pratyush-dh/forestry-maps/tree/main/forest-to-mill",
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
      reel: { cap: "Land-cover classification", sub: "Machine learning", img: "assets/img/portfolio/lulc1.jpg", n: 17 },
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
      reel: { cap: "Myagdi topographic map", sub: "Cartography", img: "assets/img/portfolio/myagdi1.jpg", n: 15 },
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
      summary: "An ArcGIS Pro Python toolbox (.pyt) that turns a DEM and a flow-accumulation threshold into a stream-network feature class, chaining the Spatial Analyst hydrology workflow (Fill through Stream to Feature) into one tool. Rewritten from a non-portable ArcMap ModelBuilder toolbox into a version-controllable arcpy module that also runs from the command line.",
      tags: ["ArcGIS Pro", "Python toolbox", "arcpy", "Hydrology"],
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
      reel: { cap: "Airports & flight routes", sub: "GIS", img: "assets/img/portfolio/airport1.jpg", n: 16 },
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
      title: "Kathmandu Valley Topographic Map",
      category: "gis",
      reel: { cap: "Kathmandu Valley relief", sub: "Cartography", img: "assets/img/portfolio/ktmvalley1.jpg", n: 14 },
      image: "assets/img/portfolio/ktmvalley1.jpg",
      summary: "Topographic map of Kathmandu Valley, Nepal, built from USGS elevation data downloaded via a Google Earth Engine script and rendered in ArcGIS Pro.",
      tags: ["Cartography", "ArcGIS Pro", "Google Earth Engine", "USGS"],
      details: "ktmValleyDetails.html",
      source: "https://github.com/pratyush-dh/cartography",
    },
    {
      title: "Carbon Dataset Explorer: Coverage & Metadata",
      category: "gis",
      image: "assets/img/portfolio/carbonatlas-explore.png",
      summary: "Step-by-step finder for atmospheric carbon datasets — filter by gas (CO₂, CH₄, N₂O), data type, and area of interest, then compare satellite, model, inventory, and ground-station coverage on world maps, timelines, and latitude charts, and export metadata, official data links, and citations.",
      tags: ["OCO-2/3", "TROPOMI", "GOSAT", "d3-geo", "Dataset metadata", "Remote sensing"],
      live: "https://pratyush-dh.github.io/carbon-data-atlas/#/explore",
      source: "https://github.com/pratyush-dh/carbon-data-atlas",
    },
    {
      title: "Rainfall Relief & Pulse: US Precipitation as Terrain",
      category: "gis",
      reel: { cap: "Rainfall Relief & Pulse", sub: "Remote sensing · 3D", img: "assets/img/portfolio/rainfall-pulse.png", n: 6 },
      image: "assets/img/portfolio/rainfall-pulse.png",
      summary: "US annual precipitation drawn as terrain height: a 3D relief map beside real elevation with one shared colour gradient, and a 30-year pulse where wet years swell and droughts sink. Pick any year range, upload your own yearly rasters, and export per-year maps and an animated GIF.",
      tags: ["PRISM", "three.js", "MapLibre GL", "Python", "rasterio", "Time series"],
      live: "https://pratyush-dh.github.io/projects/rainfall-relief/pulse.html",
      source: "https://github.com/pratyush-dh/projects/tree/main/rainfall-relief",
    },
    {
      title: "US Drought Indices Dashboard",
      category: "gis",
      reel: { cap: "US drought indices", sub: "Dashboard · PRISM", img: "assets/img/portfolio/rainfall-drought.png", n: 5 },
      image: "assets/img/portfolio/rainfall-drought.png",
      summary: "Scores 33 years of PRISM annual precipitation against the 1991–2020 normal: SPI (gamma fit per cell), percent of normal, z-score, Rainfall Anomaly Index, deciles, departure in mm, and consecutive dry years, plus drought frequency, severity and worst-year summaries. Maps, regional trends, the share of land in each drought class, and a per-cell history.",
      tags: ["SPI", "Drought", "PRISM", "Python", "scipy", "Time series"],
      live: "https://pratyush-dh.github.io/projects/rainfall-relief/drought.html",
      source: "https://github.com/pratyush-dh/projects/tree/main/rainfall-relief",
    },
    {
      title: "Hex Rainfall Map: Zoom to 1-Acre Hexagons",
      category: "gis",
      reel: { cap: "Hexagon rainfall map", sub: "Web map · Equal-area", img: "assets/img/portfolio/rainfall-hex.png", n: 4 },
      image: "assets/img/portfolio/rainfall-hex.png",
      summary: "US rainfall and drought as equal-area hexagons on an Albers grid: zoomable from the whole country down to exactly 1 acre, with click-to-zoom to a hexagon's state, state means and trends, and a legend that states the hexagon area and when finer hexagons only repeat the 8 km source cell.",
      tags: ["Hexbin", "Albers equal-area", "Canvas", "PRISM", "JavaScript"],
      live: "https://pratyush-dh.github.io/projects/rainfall-relief/hexrain.html",
      source: "https://github.com/pratyush-dh/projects/tree/main/rainfall-relief",
    },
    {
      title: "Carbon Data Atlas",
      category: "development",
      reel: { cap: "Carbon Data Atlas", sub: "Web app · Open data", img: "assets/img/portfolio/carbonatlas-explore.png", n: 7 },
      image: "assets/img/portfolio/carbonatlas-home.png",
      summary: "Open web atlas of 16 satellite, model, inventory, and ground-based CO₂, CH₄, and N₂O datasets — what each measures, where and when it has data, strengths and limits, access links, and citations — with a goal-based guide, side-by-side compare and export, and a feedback form that opens pre-filled GitHub issues.",
      tags: ["React", "Vite", "D3.js", "GitHub Pages", "Open data"],
      live: "https://pratyush-dh.github.io/carbon-data-atlas/",
      source: "https://github.com/pratyush-dh/carbon-data-atlas",
    },
    {
      title: "3D Forest Height Studio",
      category: "development",
      reel: { cap: "3D Forest Height Studio", sub: "R · Shiny · 3D", img: "assets/img/portfolio/forest-studio-florida.jpg", n: 3 },
      image: "assets/img/portfolio/forest-studio-florida.jpg",
      summary: "Open-source R Shiny app that builds interactive 3D forest-canopy-height maps for any country or region: pick a place, download the ETH 10 m canopy tiles, then orbit, relight and recolor the terrain live in WebGL, with a lat/long grid, scale bar, CRS and locator globe. Exports PNG, a shareable interactive web page, GeoTIFF and a reproducible R script. Ships as an offline Windows installer with a step-by-step tutorial. Inspired by Milos Popovic's 3D forest-height tutorial.",
      tags: ["R", "Shiny", "three.js", "WebGL", "terra / sf", "ETH canopy height"],
      details: "https://github.com/pratyush-dh/3d-forest-height-studio/blob/main/docs/TUTORIAL.md",
      download: "https://github.com/pratyush-dh/3d-forest-height-studio/releases/latest",
      source: "https://github.com/pratyush-dh/3d-forest-height-studio",
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

  // --- project ids, the hero reel (built from the projects that have a `reel` field), and tile -> project links ---
  const slug = (t) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const reelItems = projects.filter((p) => p.reel).sort((x, y) => x.reel.n - y.reel.n);
  document.querySelectorAll("#hero-reel .reel-track").forEach((track, row) => {
    const tiles = reelItems.filter((_, i) => i % 2 === row).map((p) =>
      `<a class="reel-tile" href="#project-${slug(p.title)}" data-project="${slug(p.title)}"><img src="${p.reel.img}" alt="" loading="lazy" /><span class="reel-cap"><b>${esc(p.reel.cap)}</b><i>${esc(p.reel.sub)}</i></span></a>`).join("");
    track.innerHTML = tiles + tiles.replace(/<a class="reel-tile"/g, '<a aria-hidden="true" tabindex="-1" class="reel-tile"');  // second copy: seamless loop
  });
  function showProject(id) {
    const card = document.getElementById("project-" + id);
    if (!card) return false;
    const tab = document.querySelector("#filter-tabs .filter-tab[data-filter='all']");
    if (tab && !tab.classList.contains("active")) tab.click();   // a filter must not hide the project
    openOverlay("portfolio-panel");
    const go = () => { card.scrollIntoView({ block: "start" }); card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash"); };
    setTimeout(go, 60); setTimeout(go, 450);
    return true;
  }
  document.addEventListener("click", (e) => {
    const tile = e.target.closest(".reel-tile[data-project]");
    if (!tile) return;
    e.preventDefault();
    if (showProject(tile.dataset.project)) history.replaceState(null, "", "#project-" + tile.dataset.project);
  });
  window.addEventListener("load", () => { if (location.hash.startsWith("#project-")) showProject(location.hash.slice(9)); });

  const grid = document.getElementById("portfolio-grid");
  if (grid) {
    grid.innerHTML = projects
      .map((p) => {
        const categoryLabel = { gis: "Remote Sensing & GIS", ml: "Machine Learning", development: "Development", biometrics: "Forest Biometrics" }[p.category];
        const links = [
          p.live ? `<a class="primary" href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : "",
          p.details ? `<a href="${p.details}">Details</a>` : "",
          p.download ? `<a href="${p.download}" target="_blank" rel="noopener">Download</a>` : "",
          p.source ? `<a href="${p.source}" target="_blank" rel="noopener">Source</a>` : "",
        ].join("");
        return `
        <article class="portfolio-card" id="project-${slug(p.title)}" data-category="${p.category}">
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
