(async function () {
  const { fetchCSV, parseISTDate, nowIST, isTruthy, safe } = window.CUBE_API;
  const { el, fmtDateIST, fmtDateTimeIST, compactMoney, humanEvents, clampText } = window.CUBE_UI;
  const cfg = window.CUBE_CFG;

  const featuredMount = document.getElementById("featuredMount");
  const ongoingList = document.getElementById("ongoingList");
  const upcomingList = document.getElementById("upcomingList");
  const pastStrip = document.getElementById("pastStrip");

  const statTotalSolves = document.getElementById("statTotalSolves");
  const statCompetitors = document.getElementById("statCompetitors");
  const statPastCount = document.getElementById("statPastCount");

  const pastPrev = document.getElementById("pastPrev");
  const pastNext = document.getElementById("pastNext");

  let UP_FILTER = "all";

  function num(v) {
    const x = parseFloat(String(v || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(x) ? x : 0;
  }

  function pickCol(row, candidates) {
    const keys = Object.keys(row || {});
    for (const c of candidates) {
      const found = keys.find(k => k.toLowerCase() === c.toLowerCase());
      if (found) return found;
    }
    return null;
  }

  function compUrl(comp) {
    // If your comp folder is /competitions/RCO26/ then:
    const id = safe(comp.comp_id);
    if (!id) return "./competitions/";
    return cfg.COMP_BASE_PATH + encodeURIComponent(id) + "/";
  }

  function statusFromDates(comp, now) {
    const regStart = parseISTDate(comp.reg_start);
    const regEnd = parseISTDate(comp.reg_end);
    const compStart = parseISTDate(comp.comp_start || comp.comp_date);
    const compEnd = parseISTDate(comp.comp_end || comp.comp_date);

    const hasRegWindow = !!(regStart && regEnd);
    const regOpen = hasRegWindow ? (now >= regStart && now <= regEnd) : false;
    const regSoon = hasRegWindow ? (now < regStart) : false;

    const ongoing = (compStart && compEnd) ? (now >= compStart && now <= compEnd) : false;
    const upcoming = compStart ? (now < compStart) : true;
    const past = compEnd ? (now > compEnd) : false;

    return { regStart, regEnd, compStart, compEnd, regOpen, regSoon, ongoing, upcoming, past };
  }

  function badgeRow(comp, meta) {
    const out = [];

    if (isTruthy(comp.featured)) out.push(el("span", { class: "badge badge--featured" }, ["FEATURED"]));

    if (meta.ongoing) out.push(el("span", { class: "badge badge--ongoing" }, ["ONGOING"]));
    else if (meta.upcoming && !meta.past) out.push(el("span", { class: "badge badge--upcoming" }, ["UPCOMING"]));
    else if (meta.past) out.push(el("span", { class: "badge badge--past" }, ["PAST"]));

    if (meta.regOpen) out.push(el("span", { class: "badge badge--regopen" }, ["REG OPEN"]));
    else if (meta.regSoon) out.push(el("span", { class: "badge badge--regsoon" }, ["OPENS SOON"]));
    else out.push(el("span", { class: "badge badge--regclosed" }, ["REG CLOSED"]));

    return el("div", { class: "badgeRow" }, out);
  }

  function eventChips(comp) {
    const events = humanEvents(comp.events);
    if (!events.length) return null;
    return el("div", { class: "eventRow" },
      events.slice(0, 6).map(e => el("span", { class: "eventChip" }, [e]))
    );
  }

  function prizesBox(comp) {
    const a = safe(comp.highlight_prizes);
    const b = safe(comp.prizes_worth);
    if (!a && !b) return null;

    const rows = [];
    if (a) rows.push(el("div", { class: "prizeLine" }, ["🏆 ", clampText(a, 60)]));
    if (b) rows.push(el("div", { class: "prizeLine" }, ["🏅 ", `Prizes Worth ${compactMoney(b)}`]));
    return el("div", { class: "prizeBox" }, rows);
  }

  function featuredCard(comp, meta) {
    const dateLabel = meta.compStart ? fmtDateIST(meta.compStart) : safe(comp.comp_date) || "—";

    const card = el("div", { class: "featuredInner" }, [
      badgeRow(comp, meta),
      el("div", { class: "featuredName" }, [safe(comp.comp_name) || "Competition"]),
      el("div", { class: "featuredMeta" }, [
        el("span", { class: "muted" }, ["Date: "]),
        el("strong", {}, [dateLabel])
      ]),
      eventChips(comp),
      prizesBox(comp),
      el("div", { class: "btnRow" }, [
        el("a", {
          class: "btn btn--purple btn--lg",
          href: compUrl(comp)
        }, ["Register Now"])
      ])
    ]);

    return card;
  }

  function listCard(comp, meta, variant) {
    const dateRange = (meta.compStart && meta.compEnd)
      ? `${fmtDateTimeIST(meta.compStart)} → ${fmtDateTimeIST(meta.compEnd)} IST`
      : (safe(comp.comp_date) ? safe(comp.comp_date) : "—");

    const left = el("div", { class: "cardLeft" }, [
      el("div", { class: "cardTitle" }, [safe(comp.comp_name) || "Competition"]),
      el("div", { class: "cardSub" }, [dateRange]),
      badgeRow(comp, meta),
      eventChips(comp),
      prizesBox(comp)
    ]);

    const actionText = variant === "ongoing" ? "Open" : (variant === "upcoming" ? "Open" : "View");
    const actionClass = variant === "upcoming" ? "btn btn--ink" : "btn btn--ink";

    const right = el("div", { class: "cardRight" }, [
      el("a", { class: actionClass, href: compUrl(comp) }, [actionText])
    ]);

    return el("div", { class: "homeCard" }, [left, right]);
  }

  function pastCard(comp, meta) {
    const dateRange = (meta.compStart && meta.compEnd)
      ? `${fmtDateTimeIST(meta.compStart)} → ${fmtDateTimeIST(meta.compEnd)} IST`
      : (safe(comp.comp_date) || "—");

    return el("div", { class: "pastCard" }, [
      el("div", { class: "pastPoster" }, [
        safe(comp.poster_url)
          ? el("img", { src: safe(comp.poster_url), alt: safe(comp.comp_name) || "Poster", loading: "lazy" })
          : el("div", { class: "pastPosterBlank" }, [""])
      ]),
      el("div", { class: "pastBody" }, [
        el("div", { class: "pastTitle" }, [safe(comp.comp_name) || "Competition"]),
        el("div", { class: "pastSub" }, [dateRange]),
        el("a", { class: "btn btn--ink btn--sm", href: compUrl(comp) }, ["View"])
      ])
    ]);
  }

  function setEmpty(mount, text) {
    mount.innerHTML = "";
    mount.appendChild(el("div", { class: "home-empty" }, [text]));
  }

  function setupUpcomingFilterButtons() {
    const pills = document.querySelectorAll('[data-upfilter]');
    pills.forEach(btn => {
      btn.addEventListener("click", () => {
        pills.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        UP_FILTER = btn.getAttribute("data-upfilter") || "all";
        renderAll();
      });
    });
  }

  // ----- DATA -----
  let comps = [];
  let results = [];
  let computed = null;

  function computeBuckets() {
    const now = nowIST();
    const enriched = comps.map(c => {
      const meta = statusFromDates(c, now);
      const startSort = meta.compStart ? meta.compStart.getTime() : Infinity;
      const endSort = meta.compEnd ? meta.compEnd.getTime() : Infinity;
      return { c, meta, startSort, endSort };
    });

    const ongoing = enriched.filter(x => x.meta.ongoing && !x.meta.past)
      .sort((a, b) => a.startSort - b.startSort);

    const upcoming = enriched.filter(x => x.meta.upcoming && !x.meta.ongoing && !x.meta.past)
      .sort((a, b) => a.startSort - b.startSort);

    const past = enriched.filter(x => x.meta.past)
      .sort((a, b) => b.endSort - a.endSort); // ✅ latest -> oldest

    // Featured: featured=true first, else nearest upcoming, else newest past
    let featured = enriched.find(x => isTruthy(x.c.featured) && !x.meta.past);
    if (!featured) featured = upcoming[0] || past[0] || enriched[0];

    // upcoming filter view
    const upcomingFiltered = upcoming.filter(x => {
      if (UP_FILTER === "open") return x.meta.regOpen;
      if (UP_FILTER === "soon") return x.meta.regSoon;
      return true;
    });

    return { now, enriched, ongoing, upcoming, upcomingFiltered, past, featured };
  }

  function computeStats() {
    // Total solves = number of result rows
    const totalSolves = results.length;

    // Unique competitors = detect best column
    let uniq = 0;
    if (results.length) {
      const sample = results[0];
      const col = pickCol(sample, ["person_id", "wca_id", "wcaid", "name", "competitor", "participant"]);
      if (col) {
        const set = new Set();
        results.forEach(r => {
          const v = safe(r[col]);
          if (v) set.add(v.toLowerCase());
        });
        uniq = set.size;
      }
    }

    return { totalSolves, uniqCompetitors: uniq };
  }

  function renderFeatured() {
    if (!featuredMount) return;
    featuredMount.innerHTML = "";
    if (!computed || !computed.featured) {
      setEmpty(featuredMount, "No featured competition.");
      return;
    }
    featuredMount.appendChild(featuredCard(computed.featured.c, computed.featured.meta));
  }

  function renderOngoing() {
    if (!ongoingList) return;
    ongoingList.innerHTML = "";

    if (!computed.ongoing.length) {
      setEmpty(ongoingList, "No ongoing competitions right now.");
      return;
    }

    computed.ongoing.slice(0, 2).forEach(x => {
      ongoingList.appendChild(listCard(x.c, x.meta, "ongoing"));
    });
  }

  function renderUpcoming() {
    if (!upcomingList) return;
    upcomingList.innerHTML = "";

    const list = computed.upcomingFiltered;

    if (!list.length) {
      if (computed.upcoming.length && UP_FILTER !== "all") {
        setEmpty(upcomingList, "No competitions match this filter right now.");
      } else {
        setEmpty(upcomingList, "No upcoming competitions right now.");
      }
      return;
    }

    list.slice(0, 3).forEach(x => {
      upcomingList.appendChild(listCard(x.c, x.meta, "upcoming"));
    });
  }

  function renderPast() {
    if (!pastStrip) return;
    pastStrip.innerHTML = "";

    if (!computed.past.length) {
      pastStrip.appendChild(el("div", { class: "home-empty" }, ["No past competitions yet."]));
      return;
    }

    computed.past.forEach(x => pastStrip.appendChild(pastCard(x.c, x.meta)));
  }

  function hookPastArrows() {
    if (!pastStrip || !pastPrev || !pastNext) return;

    const scrollBy = () => Math.max(320, Math.floor(pastStrip.clientWidth * 0.55));

    pastPrev.addEventListener("click", () => {
      pastStrip.scrollBy({ left: -scrollBy(), behavior: "smooth" });
    });
    pastNext.addEventListener("click", () => {
      pastStrip.scrollBy({ left: scrollBy(), behavior: "smooth" });
    });
  }

  function renderStats() {
    const { totalSolves, uniqCompetitors } = computeStats();
    if (statTotalSolves) statTotalSolves.textContent = totalSolves ? totalSolves.toLocaleString("en-IN") : "0";
    if (statCompetitors) statCompetitors.textContent = uniqCompetitors ? uniqCompetitors.toLocaleString("en-IN") : "0";
    if (statPastCount) statPastCount.textContent = computed.past.length.toLocaleString("en-IN");
  }

  function renderAll() {
    computed = computeBuckets();
    renderFeatured();
    renderOngoing();
    renderUpcoming();
    renderPast();
    renderStats();
  }

  async function boot() {
    try {
      setupUpcomingFilterButtons();
      hookPastArrows();

      // Load competitions
      comps = await fetchCSV(cfg.COMPETITIONS_CSV);

      // Load results (optional but you have it)
      try {
        results = cfg.RESULTS_CSV ? await fetchCSV(cfg.RESULTS_CSV) : [];
      } catch (e) {
        results = [];
      }

      renderAll();
    } catch (err) {
      console.error(err);
      if (featuredMount) setEmpty(featuredMount, "Failed to load competition data.");
      if (ongoingList) setEmpty(ongoingList, "Failed to load competition data.");
      if (upcomingList) setEmpty(upcomingList, "Failed to load competition data.");
      if (pastStrip) setEmpty(pastStrip, "Failed to load competition data.");
    }
  }

  boot();
})();
