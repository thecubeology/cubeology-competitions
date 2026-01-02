/* /competitions/view/?id=...
   - Highlights details + description
   - 2:1 banner
   - reg_sold sold-out override
   - button labels:
       open -> Register Now
       soon -> Regs Start Soon
       closed -> Registrations Closed
       soldout -> Sold Out
*/

const IST_OFFSET_MIN = 330;

function safe(v){ return (v ?? "").toString().trim(); }
function isTruthy(v){
  const x = safe(v).toLowerCase();
  return x === "true" || x === "yes" || x === "1" || x === "sold" || x === "soldout";
}

function parseIST(s){
  const t = safe(s);
  if(!t) return null;

  let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/);
  if(m){
    const dd=+m[1], mm=+m[2], yyyy=+m[3], hh=+m[4], min=+m[5];
    return Date.UTC(yyyy, mm-1, dd, hh, min) - IST_OFFSET_MIN*60*1000;
  }
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
  if(m){
    const dd=+m[1], mm=+m[2], yyyy=+m[3], hh=+m[4], min=+m[5];
    return Date.UTC(yyyy, mm-1, dd, hh, min) - IST_OFFSET_MIN*60*1000;
  }
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(m){
    const dd=+m[1], mm=+m[2], yyyy=+m[3];
    return Date.UTC(yyyy, mm-1, dd, 0, 0) - IST_OFFSET_MIN*60*1000;
  }
  return null;
}

function compState(c, now){
  const cs = parseIST(c.comp_start) ?? parseIST(c.comp_date);
  const ce = parseIST(c.comp_end);
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

function pills(c, now){
  const s = compState(c, now);
  const r = regState(c, now);
  const feat = isTruthy(c.featured) ? `<span class="pill pink">FEATURED</span>` : ``;

  const compPill =
    s === "ongoing" ? `<span class="pill cyan">ONGOING</span>` :
    s === "upcoming" ? `<span class="pill violet">UPCOMING</span>` :
    s === "ended" ? `<span class="pill red">ENDED</span>` :
    `<span class="pill violet">SCHEDULED</span>`;

  const regPill =
    r === "open" ? `<span class="pill green">REG OPEN</span>` :
    r === "soon" ? `<span class="pill amber">REG SOON</span>` :
    r === "closed" ? `<span class="pill red">REG CLOSED</span>` :
    r === "soldout" ? `<span class="pill red">SOLD OUT</span>` :
    ``;

  return `${feat}${compPill}${regPill}`;
}

function fmtDateRange(c){
  const start = safe(c.comp_start);
  const end = safe(c.comp_end);
  const date = safe(c.comp_date);
  if(start && end) return `${start} → ${end} IST`;
  if(start) return `${start} IST`;
  return (date ? `${date} IST` : "");
}

function feesLine(c){
  const base = safe(c.base_fee);
  const per = safe(c.per_event_fee);
  if(!base && !per) return "";
  const a = base ? `₹${base} base` : "";
  const b = per ? `₹${per}/event` : "";
  return [a,b].filter(Boolean).join(" • ");
}

function actionLabel(r){
  if(r === "soldout") return "Sold Out";
  if(r === "open") return "Register Now";
  if(r === "soon") return "Regs Start Soon";
  if(r === "closed") return "Registrations Closed";
  return "Register Now";
}

function actionDisabled(r){
  return r === "closed" || r === "soldout" || r === "soon";
}

function getParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

(async function(){
  const wrap = document.getElementById("wrap");
  const id = safe(getParam("id"));

  if(!id){
    wrap.innerHTML = `<div class="card"><div class="muted">Missing competition id.</div></div>`;
    return;
  }

  try{
    const now = Date.now();
    const rows = await window.CB_API.getCSV(window.CB.CSV_COMPETITIONS);
    const c = (rows || []).find(x => safe(x.comp_id).toLowerCase() === id.toLowerCase());

    if(!c){
      wrap.innerHTML = `<div class="card"><div class="muted">Competition not found: <b>${id}</b></div></div>`;
      return;
    }

    // redirect for RCO26
    if(safe(c.comp_id).toUpperCase() === "RCO26"){
      location.href = "/competitions/RCO26/";
      return;
    }

    document.title = `${safe(c.comp_name) || safe(c.comp_id)} • Cubeology`;

    const reg = regState(c, now);
    const label = actionLabel(reg);
    const disabled = actionDisabled(reg);

    const fees = feesLine(c);
    const cap = safe(c.reg_capacity);
    const desc = safe(c.description);

    wrap.innerHTML = `
      <div class="viewCard">
        ${safe(c.poster_url) ? `
          <div class="viewBanner">
            <img src="${safe(c.poster_url)}" alt="${safe(c.comp_name) || safe(c.comp_id)} banner" loading="lazy" decoding="async">
          </div>
        ` : ``}

        <div class="viewBody">
          <div class="headRow">
            <div class="pills">${pills(c, now)}</div>
          </div>

          <h2 class="title">${safe(c.comp_name) || safe(c.comp_id)}</h2>
          <div class="sub">${fmtDateRange(c)}</div>

          ${safe(c.short_hook) ? `<div class="sub" style="color:var(--ink); font-weight:950; margin-top:10px;">${safe(c.short_hook)}</div>` : ``}

          ${desc ? `
            <div class="block">
              <h3>Description</h3>
              <div class="sub" style="margin-top:8px; color:var(--ink);">${desc}</div>
            </div>
          ` : ``}

          <div class="block">
            <h3>Key details</h3>

            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Competition ID</div>
                <div class="kvValue">${safe(c.comp_id)}</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Mode</div>
                <div class="kvValue">${safe(c.mode_label) || "—"}</div>
              </div>
            </div>

            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Registration starts</div>
                <div class="kvValue">${safe(c.reg_start) || "—"}</div>
              </div>
              <div class="kvItem">
                <div class="kvLabel">Registration ends</div>
                <div class="kvValue">${safe(c.reg_end) || "—"}</div>
              </div>
            </div>

            <div class="kvRow">
              <div class="kvItem">
                <div class="kvLabel">Events</div>
                <div class="kvValue">${safe(c.events) || "—"}</div>
              </div>

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

            <div class="actions">
              <a class="btn dark" href="/competitions/">Back</a>
              <a class="btn ${disabled ? "disabled" : "primary"}" href="${disabled ? "#" : "#"}" aria-disabled="${disabled}">
                ${label}
              </a>
              <span class="muted" style="font-weight:900;">(Registration handled on the competition page)</span>
            </div>
          </div>
        </div>
      </div>
    `;

  }catch(err){
    console.error(err);
    wrap.innerHTML = `<div class="card"><div class="muted">Error loading competition details.</div></div>`;
  }
})();
