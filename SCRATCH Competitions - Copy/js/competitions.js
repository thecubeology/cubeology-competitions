const IST_OFFSET_MIN = 330;

function safe(v){ return (v ?? "").toString().trim(); }
function isTruthy(v){
  const x = safe(v).toLowerCase();
  return x === "true" || x === "yes" || x === "1" || x === "sold" || x === "soldout";
}

/** Parse IST for logic only */
function parseIST(s){
  const t = safe(s);
  if(!t) return null;

  let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if(m){
    const dd=+m[1], mm=+m[2], yyyy=+m[3], hh=+m[4], min=+m[5];
    return Date.UTC(yyyy, mm-1, dd, hh, min) - IST_OFFSET_MIN*60*1000;
  }

  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(m){
    const dd=+m[1], mm=+m[2], yyyy=+m[3];
    return Date.UTC(yyyy, mm-1, dd, 0, 0) - IST_OFFSET_MIN*60*1000;
  }

  m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    const yyyy=+m[1], mm=+m[2], dd=+m[3];
    return Date.UTC(yyyy, mm-1, dd, 0, 0) - IST_OFFSET_MIN*60*1000;
  }

  return null;
}

/** Display comp_date only, always DD/MM/YY or range */
function normalizeCompDateText(s){
  const t = safe(s);
  if(!t) return "";

  const parts = t.split(/\s*-\s*/);
  if(parts.length === 2){
    const a = normalizeSingleDate(parts[0]);
    const b = normalizeSingleDate(parts[1]);
    return [a,b].filter(Boolean).join(" - ");
  }
  return normalizeSingleDate(t);
}

function normalizeSingleDate(t){
  const s = safe(t).split(" ")[0]; // remove time
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(m){
    const dd = m[1].padStart(2,"0");
    const mm = m[2].padStart(2,"0");
    const yy = m[3].slice(-2);
    return `${dd}/${mm}/${yy}`;
  }
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    const yy = m[1].slice(-2);
    const mm = m[2].padStart(2,"0");
    const dd = m[3].padStart(2,"0");
    return `${dd}/${mm}/${yy}`;
  }
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if(m){
    const dd = m[1].padStart(2,"0");
    const mm = m[2].padStart(2,"0");
    const yy = m[3].padStart(2,"0");
    return `${dd}/${mm}/${yy}`;
  }
  return safe(t).split(" IST")[0];
}

function compState(c, now){
  const cs = parseIST(c.comp_start) ?? parseIST(c.comp_date);
  const ce = parseIST(c.comp_end) ?? cs;
  if(cs && ce && now >= cs && now <= ce) return "ongoing";
  if(cs && now < cs) return "upcoming";
  if(ce && now > ce) return "ended";
  return "scheduled";
}

function regState(c, now){
  if(isTruthy(c.reg_sold)) return "soldout";
  const rs = parseIST(c.reg_start);
  const re = parseIST(c.reg_end);
  if(rs && now < rs) return "soon";
  if(re && now > re) return "closed";
  if(rs || re) return "open";
  return "unknown";
}

function detailsLinkForComp(c){
  const id = safe(c.comp_id).toUpperCase();
  if(id === "RCO26") return "/competitions/RCO26/";
  return `/competitions/view/?id=${encodeURIComponent(safe(c.comp_id))}`;
}

function registerLinkForComp(c){
  return safe(c.register_link); // NEW CSV field
}

function compactRegLine(c, now){
  const r = regState(c, now);
  const rs = normalizeSingleDate(safe(c.reg_start));
  const re = normalizeSingleDate(safe(c.reg_end));

  if(r === "soldout") return "Sold Out";
  if(r === "closed") return "Registrations closed";
  if(r === "soon") return rs ? `Regs start on: ${rs}` : "Reg starts soon";
  return re ? `Regs close on: ${re}` : "Registrations open";
}

function registerBtnLabel(r){
  if(r === "soldout") return "Sold Out";
  if(r === "open") return "Register Now";
  if(r === "soon") return "Reg starts soon";
  if(r === "closed") return "Registrations Closed";
  return "Register";
}

function registerBtnDisabled(r, link){
  if(!link) return true;
  return r === "closed" || r === "soldout" || r === "soon";
}

function safeFeesLine(c){
  const base = safe(c.base_fee);
  const per = safe(c.per_event_fee);

  const fmt = (v) => {
    const x = safe(v);
    if(!x) return "";
    if(/[a-zA-Z]/.test(x)) return x;  // allow Free
    return `₹${x}`;
  };

  const a = base ? `${fmt(base)}` : "";
  const b = per ? `${fmt(per)}/event` : "";
  return [a,b].filter(Boolean).join(" • ");
}

function badgePills(c, now){
  const s = c._state;
  const r = c._reg;

  const feat = c._featured ? `<span class="pill pink">FEATURED</span>` : ``;

  // Competition state pill (always)
  const compPill =
    s === "ongoing" ? `<span class="pill cyan">ONGOING</span>` :
    s === "upcoming" ? `<span class="pill violet">UPCOMING</span>` :
    s === "ended" ? `<span class="pill red">ENDED</span>` :
    `<span class="pill violet">SCHEDULED</span>`;

  // ✅ For ENDED comps, hide reg pills (closed/soldout/soon/open)
  if(s === "ended"){
    return `${feat}${compPill}`;
  }

  // Registration pill (only for upcoming/ongoing/scheduled)
  const regPill =
    r === "open" ? `<span class="pill green">REG OPEN</span>` :
    r === "soon" ? `<span class="pill amber">STARTS SOON</span>` :
    r === "closed" ? `<span class="pill red">CLOSED</span>` :
    r === "soldout" ? `<span class="pill red">SOLD OUT</span>` :
    ``;

  return `${feat}${compPill}${regPill}`;
}

function featuredHTML(c, now){
  const name = safe(c.comp_name) || safe(c.comp_id);
  const detailsLink = detailsLinkForComp(c);

  const r = c._reg;
  const regLink = registerLinkForComp(c);
  const regDisabled = registerBtnDisabled(r, regLink);

  const poster = safe(c.poster_url);
  const prizesWorth = safe(c.prizes_worth);

  return `
    <div class="featuredBanner compact">

      ${poster ? `
        <div class="featuredMedia">
          <img src="${poster}" alt="${name}" />
          ${prizesWorth ? `
            <div class="prizeOverlay">
              🏆 Prizes Worth ${prizesWorth}
            </div>
          ` : ``}
        </div>
      ` : ``}

      <div class="featuredContent">
        <div class="pills">${badgePills(c, now)}</div>

        <h1 class="bannerTitle">${name}</h1>
        <div class="bannerSub">${normalizeCompDateText(c.comp_date)}</div>

        ${safe(c.description) ? `
          <div class="bannerDesc">${safe(c.description)}</div>
        ` : ``}

        <div class="kvGrid">
          <div class="kvRow">
            <div class="kvItem">
              <div class="kvLabel">Events</div>
              <div class="kvValue">${safe(c.events) || "—"}</div>
            </div>
            <div class="kvItem">
              <div class="kvLabel">Registration</div>
              <div class="kvValue">${compactRegLine(c, now)}</div>
            </div>
          </div>
        </div>

        <div class="bannerActions">
          <a class="btn ${regDisabled ? "disabled" : "primary"}"
             href="${regDisabled ? "#" : regLink}"
             ${regDisabled ? "" : `target="_blank" rel="noopener"`}>
            ${registerBtnLabel(r)}
          </a>

          <a class="btn dark" href="${detailsLink}">View details</a>
        </div>
      </div>
    </div>
  `;
}

    <div class="featuredContent">
      <div class="pills">${badgePills(c, now)}</div>

      <h1 class="bannerTitle">${name}</h1>
      <div class="bannerSub">${normalizeCompDateText(c.comp_date)}</div>

      ${safe(c.description) ? `
        <div class="bannerDesc">${safe(c.description)}</div>
      ` : ``}

      <div class="kvGrid">
        <div class="kvRow">
          <div class="kvItem">
            <div class="kvLabel">Events</div>
            <div class="kvValue">${safe(c.events) || "—"}</div>
          </div>
          <div class="kvItem">
            <div class="kvLabel">Registration</div>
            <div class="kvValue">${compactRegLine(c, now)}</div>
          </div>
        </div>
      </div>

      <div class="bannerActions">
        <a class="btn ${registerBtnDisabled(c._reg, registerLinkForComp(c)) ? "disabled" : "primary"}"
           href="${registerBtnDisabled(c._reg, registerLinkForComp(c)) ? "#" : registerLinkForComp(c)}"
           target="_blank" rel="noopener">
          ${registerBtnLabel(c._reg)}
        </a>

        <a class="btn dark" href="${detailsLinkForComp(c)}">View details</a>
      </div>
    </div>
  </div>
`;


    <div class="bannerBody">

        <div class="bannerTop">
          <div class="pills">${badgePills(c, now)}</div>
          ${prizesWorth ? `<div class="pills"><span class="pill gold">Prizes: ${prizesWorth}</span></div>` : ``}
        </div>

        <h1 class="bannerTitle">${name}</h1>
        <div class="bannerSub">${normalizeCompDateText(c.comp_date)}</div>
        ${desc ? `<div class="bannerDesc">${desc}</div>` : ``}

        <div class="kvGrid">
          <div class="kvRow">
            <div class="kvItem">
              <div class="kvLabel">Registration</div>
              <div class="kvValue">${regLine}</div>
            </div>
            <div class="kvItem">
              <div class="kvLabel">Events</div>
              <div class="kvValue">${safe(c.events) || "—"}</div>
            </div>
          </div>

          ${(fees || cap) ? `
            <div class="kvRow">
              ${fees ? `
                <div class="kvItem">
                  <div class="kvLabel">Fees</div>
                  <div class="kvValue">${fees}</div>
                </div>
              ` : ``}

              ${cap ? `
                <div class="kvItem">
                  <div class="kvLabel">Capacity</div>
                  <div class="kvValue">${cap}</div>
                </div>
              ` : ``}
            </div>
          ` : ``}
        </div>

        <div class="bannerActions">
          <a class="btn ${regDisabled ? "disabled" : "primary"}"
             href="${regDisabled ? "#" : regLink}"
             aria-disabled="${regDisabled}"
             ${regDisabled ? "" : `target="_blank" rel="noopener"`}>
            ${registerBtnLabel(r)}
          </a>

          <a class="btn dark" href="${detailsLink}">View details</a>
        </div>
      </div>
    </div>
  `;
}

function cardHTML(c, now, group){
  const id = safe(c.comp_id);
  const name = safe(c.comp_name) || id;

  const detailsLink = detailsLinkForComp(c);
  const regLine = compactRegLine(c, now);

  const fees = safeFeesLine(c);
  const cap = safe(c.reg_capacity) ? safe(c.reg_capacity) : "";
  const desc = safe(c.description) ? safe(c.description) : safe(c.short_hook);

  const r = c._reg;
  const regLink = registerLinkForComp(c);
  const regDisabled = registerBtnDisabled(r, regLink);

  return `
    <div class="compCard" data-card="${group}:${encodeURIComponent(id)}">
      <div class="cardBody">

        <div>
          <div class="cardTitle">${name}</div>
          <div class="cardMeta">${normalizeCompDateText(c.comp_date)}</div>
          <div class="cardMeta">${regLine}</div>

          <!-- ✅ Pills ALWAYS below -->
          <div class="pills" style="margin-top:10px;">
            ${badgePills(c, now)}
          </div>
        </div>

        <div class="bannerActions" style="margin-top:12px;">
          <a class="btn ${regDisabled ? "disabled" : "primary"} mini"
             href="${regDisabled ? "#" : regLink}"
             aria-disabled="${regDisabled}"
             ${regDisabled ? "" : `target="_blank" rel="noopener"`}>
            ${registerBtnLabel(r)}
          </a>

          <button class="btn ghost mini" type="button" data-toggle-details="${group}:${encodeURIComponent(id)}">Details</button>
          <a class="btn dark mini" href="${detailsLink}">Open page</a>
        </div>

        <div class="detailsPanel" id="details:${group}:${encodeURIComponent(id)}">
          ${desc ? `<div class="cardMeta" style="font-size:13px; color:var(--ink);">${desc}</div>` : ``}

          <div class="kvGrid" style="margin-top:10px;">
            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Events</div>
                <div class="kvValue">${safe(c.events) || "—"}</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Mode</div>
                <div class="kvValue">${safe(c.mode_label) || "—"}</div>
              </div>
            </div>

            ${(fees || cap) ? `
              <div class="kvRow">
                ${fees ? `
                  <div class="kvItem">
                    <div class="kvLabel">Fees</div>
                    <div class="kvValue">${fees}</div>
                  </div>
                ` : ``}
                ${cap ? `
                  <div class="kvItem">
                    <div class="kvLabel">Capacity</div>
                    <div class="kvValue">${cap}</div>
                  </div>
                ` : ``}
              </div>
            ` : ``}
          </div>
        </div>

      </div>
    </div>
  `;
}

function scrollByCard(container, dir){
  const w = Math.max(320, Math.floor(container.getBoundingClientRect().width * 0.85));
  container.scrollBy({ left: dir * w, behavior: "smooth" });
}

/* UI state */
let ALL = [];
let Q = "";
let REG = "any";
let EVENT = "";
let SORT = "smart";
let UP_LIMIT = 6;
let ON_LIMIT = 6;

function distinctEvents(list){
  const set = new Set();
  list.forEach(c => {
    safe(c.events).split(",").map(x => safe(x)).filter(Boolean).forEach(e => set.add(e));
  });
  return Array.from(set).sort((a,b)=>a.localeCompare(b));
}

function apply(){
  const now = Date.now();
  const q = safe(Q).toLowerCase();

  let list = ALL.slice();

  if(q){
    list = list.filter(x => {
      const hay = [
        safe(x.comp_id),
        safe(x.comp_name),
        safe(x.events),
        safe(x.short_hook),
        safe(x.description)
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  if(REG !== "any"){
    list = list.filter(x => x._reg === REG);
  }

  if(EVENT){
    const e = EVENT.toLowerCase();
    list = list.filter(x => safe(x.events).toLowerCase().split(",").map(s=>s.trim()).includes(e));
  }

  let upcoming = list.filter(x => x._state === "upcoming");
  let ongoing  = list.filter(x => x._state === "ongoing");
  let past     = list.filter(x => x._state === "ended");

  upcoming.sort((a,b) => (a._cs ?? 9e15) - (b._cs ?? 9e15));
  ongoing.sort((a,b) => (a._ce ?? 9e15) - (b._ce ?? 9e15));
  past.sort((a,b) => (b._endedAt ?? 0) - (a._endedAt ?? 0)); // latest → oldest

  if(SORT === "start_desc"){
    const by = (a,b) => (b._cs ?? 0) - (a._cs ?? 0);
    upcoming.sort(by); ongoing.sort(by);
  }else if(SORT === "start_asc"){
    const by = (a,b) => (a._cs ?? 9e15) - (b._cs ?? 9e15);
    upcoming.sort(by); ongoing.sort(by);
  }else if(SORT === "past_latest"){
    past.sort((a,b) => (b._endedAt ?? 0) - (a._endedAt ?? 0));
  }

  const featured =
    list.find(x => x._featured && (x._state === "ongoing" || x._state === "upcoming")) ||
    upcoming[0] || ongoing[0] || past[0] || null;

  document.getElementById("featuredWrap").innerHTML =
    featured ? featuredHTML(featured, now)
             : `<div class="featuredBanner"><div class="bannerBody"><div class="muted">No competitions found.</div></div></div>`;

  document.getElementById("upcomingCount").textContent = `${upcoming.length}`;
  document.getElementById("ongoingCount").textContent = `${ongoing.length}`;

  const upEl = document.getElementById("upcomingCarousel");
  const upEmpty = document.getElementById("upcomingEmpty");
  const upSlice = upcoming.slice(0, UP_LIMIT);
  if(!upSlice.length){ upEl.innerHTML=""; upEmpty.hidden=false; }
  else{ upEmpty.hidden=true; upEl.innerHTML = upSlice.map(c=>cardHTML(c, now, "up")).join(""); }

  const onEl = document.getElementById("ongoingCarousel");
  const onEmpty = document.getElementById("ongoingEmpty");
  const onSlice = ongoing.slice(0, ON_LIMIT);
  if(!onSlice.length){ onEl.innerHTML=""; onEmpty.hidden=false; }
  else{ onEmpty.hidden=true; onEl.innerHTML = onSlice.map(c=>cardHTML(c, now, "on")).join(""); }

  const pastEl = document.getElementById("pastCarousel");
  const pastEmpty = document.getElementById("pastEmpty");
  if(!past.length){ pastEl.innerHTML=""; pastEmpty.hidden=false; }
  else{ pastEmpty.hidden=true; pastEl.innerHTML = past.map(c=>cardHTML(c, now, "past")).join(""); }

  document.getElementById("metaLine").textContent = `Showing ${list.length} competitions`;
}

function bindUI(){
  const q = document.getElementById("q");
  const clearQ = document.getElementById("clearQ");
  const filtersBtn = document.getElementById("filtersBtn");
  const filtersPanel = document.getElementById("filtersPanel");
  const resetBtn = document.getElementById("resetBtn");

  q.addEventListener("input", () => { Q = q.value; apply(); });
  clearQ.addEventListener("click", () => { q.value=""; Q=""; q.focus(); apply(); });

  filtersBtn.addEventListener("click", () => {
    const open = !filtersPanel.hidden;
    filtersPanel.hidden = open;
    filtersBtn.setAttribute("aria-expanded", String(!open));
  });

  const regChips = document.getElementById("regChips");
  regChips.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-reg]");
    if(!btn) return;
    [...regChips.querySelectorAll(".chip")].forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    REG = btn.dataset.reg;
    apply();
  });

  const eventSelect = document.getElementById("eventSelect");
  eventSelect.addEventListener("change", () => { EVENT = safe(eventSelect.value); apply(); });

  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", () => { SORT = safe(sortSelect.value); apply(); });

  resetBtn.addEventListener("click", () => {
    Q=""; REG="any"; EVENT=""; SORT="smart";
    UP_LIMIT=6; ON_LIMIT=6;
    q.value=""; eventSelect.value=""; sortSelect.value="smart";
    [...regChips.querySelectorAll(".chip")].forEach((b,i)=>b.classList.toggle("on", i===0));
    apply();
  });

  const upEl = document.getElementById("upcomingCarousel");
  document.getElementById("upLeft").addEventListener("click", ()=>scrollByCard(upEl, -1));
  document.getElementById("upRight").addEventListener("click", ()=>scrollByCard(upEl, 1));

  const onEl = document.getElementById("ongoingCarousel");
  document.getElementById("onLeft").addEventListener("click", ()=>scrollByCard(onEl, -1));
  document.getElementById("onRight").addEventListener("click", ()=>scrollByCard(onEl, 1));

  const pastEl = document.getElementById("pastCarousel");
  document.getElementById("pastLeft").addEventListener("click", ()=>scrollByCard(pastEl, -1));
  document.getElementById("pastRight").addEventListener("click", ()=>scrollByCard(pastEl, 1));

  document.getElementById("upcomingViewAll").addEventListener("click", (e) => {
    const isAll = e.target.dataset.all === "1";
    e.target.dataset.all = isAll ? "0" : "1";
    e.target.textContent = isAll ? "View all" : "Show less";
    UP_LIMIT = isAll ? 6 : 9999;
    apply();
  });

  document.getElementById("ongoingViewAll").addEventListener("click", (e) => {
    const isAll = e.target.dataset.all === "1";
    e.target.dataset.all = isAll ? "0" : "1";
    e.target.textContent = isAll ? "View all" : "Show less";
    ON_LIMIT = isAll ? 6 : 9999;
    apply();
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle-details]");
    if(!t) return;
    const key = t.getAttribute("data-toggle-details");
    const panel = document.getElementById(`details:${key}`);
    if(!panel) return;
    const on = panel.classList.toggle("on");
    t.textContent = on ? "Hide" : "Details";
  });
}

(async function init(){
  bindUI();

  try{
    const now = Date.now();
    const raw = await window.CB_API.getCSV(window.CB.CSV_COMPETITIONS);

    ALL = (raw || []).map(c => {
      const cs = parseIST(c.comp_start) ?? parseIST(c.comp_date);
      const ce = parseIST(c.comp_end) ?? cs;
      const endedAt = ce ?? cs ?? 0;
      return {
        ...c,
        _cs: cs,
        _ce: ce,
        _endedAt: endedAt,
        _featured: isTruthy(c.featured),
        _state: compState(c, now),
        _reg: regState(c, now)
      };
    });

    const evs = distinctEvents(ALL);
    const eventSelect = document.getElementById("eventSelect");
    evs.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      eventSelect.appendChild(opt);
    });

    apply();
  }catch(err){
    console.error(err);
    document.getElementById("featuredWrap").innerHTML =
      `<div class="featuredBanner"><div class="bannerBody"><div class="muted">Error loading competitions.</div></div></div>`;
    document.getElementById("metaLine").textContent = "Error loading competitions CSV.";
  }
})();
