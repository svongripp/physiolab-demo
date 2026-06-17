/* Physiolab demo — shared behaviour: theme toggle + the "find your physio" filter. */

/* ---------- theme ---------- */
(function () {
  try {
    if (localStorage.getItem("physiolab-demo-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
  window.toggleTheme = function () {
    const now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", now);
    try { localStorage.setItem("physiolab-demo-theme", now); } catch (e) {}
  };
})();

/* ---------- finder ---------- */
function initFinder() {
  const filtersEl = document.getElementById("filters");
  const cardsEl   = document.getElementById("cards");
  const countEl   = document.getElementById("resultCount");
  if (!filtersEl || !cardsEl) return;

  // active[facet] = Set of selected option keys
  const active = {};
  Object.keys(TAXONOMY).forEach((f) => (active[f] = new Set()));

  // Preselect from ?condition=… (the SEO pages link in with intent).
  const params = new URLSearchParams(location.search);
  const pre = params.get("condition");
  if (pre && TAXONOMY.condition.options[pre]) active.condition.add(pre);

  // Build the filter UI as collapsible accordions so every category heading is
  // visible at a glance. Only one section is open at a time (native exclusive
  // accordion via the shared `name`). Open the first facet that has a selection
  // (e.g. preselected via ?condition=), otherwise the hero facet.
  const facetKeys = Object.keys(TAXONOMY);
  const openFacet = facetKeys.find((f) => active[f].size > 0) || facetKeys[0];
  Object.entries(TAXONOMY).forEach(([facet, def]) => {
    const group = document.createElement("details");
    group.className = "filter-group";
    group.name = "physiolab-filters";
    group.open = facet === openFacet;
    const summary = document.createElement("summary");
    summary.innerHTML =
      `<span class="fg-label">${def.label}</span>` +
      `<span class="fg-chevron" aria-hidden="true">⌄</span>`;
    group.appendChild(summary);
    const chips = document.createElement("div");
    chips.className = "chips";
    Object.entries(def.options).forEach(([key, label]) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = label;
      chip.setAttribute("aria-pressed", active[facet].has(key) ? "true" : "false");
      chip.addEventListener("click", () => {
        if (active[facet].has(key)) active[facet].delete(key);
        else active[facet].add(key);
        chip.setAttribute("aria-pressed", active[facet].has(key) ? "true" : "false");
        render();
      });
      chips.appendChild(chip);
    });
    group.appendChild(chips);
    filtersEl.appendChild(group);
  });

  const reset = document.createElement("button");
  reset.className = "filter-reset";
  reset.textContent = "Clear all filters";
  reset.addEventListener("click", () => {
    Object.values(active).forEach((s) => s.clear());
    filtersEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    render();
  });
  filtersEl.appendChild(reset);

  function matches(p) {
    // A practitioner matches if, for every facet with selections, they satisfy
    // at least one selected option (AND across facets, OR within a facet).
    const facetMatch = (facet, value) => {
      const sel = active[facet];
      if (sel.size === 0) return true;
      const arr = Array.isArray(value) ? value : [value];
      return arr.some((v) => sel.has(v));
    };
    return (
      facetMatch("condition", p.conditions) &&
      facetMatch("discipline", p.discipline) &&
      facetMatch("location", p.locations) &&
      facetMatch("language", p.languages) &&
      facetMatch("funding", p.funding)
    );
  }

  function initials(name) {
    return name.replace(/^Dr\.?\s+/, "").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  function card(p) {
    const loc = p.locations[0];
    const locLabel = TAXONOMY.location.options[loc];
    const condTags = p.conditions
      .map((c) => TAXONOMY.condition.options[c])
      .slice(0, 4)
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    const langTags = p.languages
      .map((l) => `<span class="tag lang">${TAXONOMY.language.options[l]}</span>`)
      .join("");
    const fundLabels = p.funding.map((f) => TAXONOMY.funding.options[f]).join(" · ");
    const first = p.name.replace(/^Dr\.?\s+/, "").split(" ")[0];
    const sid = typeof STAFF_IDS !== "undefined" ? STAFF_IDS[p.name] : null;
    // Real per-practitioner Jane deep link where we have the staff ID,
    // otherwise fall back to the location's booking landing page.
    const bookUrl = sid ? `${JANE[loc]}/#/staff_member/${sid}` : JANE[loc];
    const bookNote = sid ? `Books directly with ${first}` : `Opens ${locLabel} booking`;
    return `
      <article class="card">
        <div class="card-top">
          <div class="avatar">${initials(p.name)}</div>
          <div>
            <h4>${p.name}</h4>
            <div class="role">${p.role}</div>
          </div>
        </div>
        <p class="blurb">${p.blurb}</p>
        <div class="tags">${condTags}${langTags}</div>
        <div class="meta-row">
          <span>📍 ${locLabel}</span><span class="dot"></span>
          <span>${fundLabels}</span>
        </div>
        <div class="card-actions">
          <a class="btn" href="${bookUrl}" target="_blank" rel="noopener">Book with ${first} →</a>
          <span class="note">${bookNote}</span>
        </div>
      </article>`;
  }

  function render() {
    const list = PRACTITIONERS.filter(matches);
    countEl.textContent =
      list.length + (list.length === 1 ? " practitioner" : " practitioners");
    if (list.length === 0) {
      const locSel = [...active.location];
      const onlyUnmapped =
        locSel.length > 0 && locSel.every((l) => l !== "olympic-village");
      cardsEl.innerHTML = onlyUnmapped
        ? `<div class="empty"><strong>Demo data covers the Olympic Village roster only.</strong><br>
             In the real build, ${locSel.map((l) => TAXONOMY.location.options[l]).join(" / ")}
             would show their own practitioners here.</div>`
        : `<div class="empty"><strong>No exact match.</strong><br>
             Try removing a filter — or call the clinic and we'll point you to the right person.</div>`;
      return;
    }
    cardsEl.innerHTML = list.map(card).join("");
  }

  render();
}

document.addEventListener("DOMContentLoaded", initFinder);
