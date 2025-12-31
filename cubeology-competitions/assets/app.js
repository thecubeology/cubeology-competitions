
  /* ===== Mobile hardening (NEW) ===== */
  *{ box-sizing:border-box; }
  html,body{ max-width:100%; overflow-x:hidden; }
  #app{ padding:16px !important; }
  a, button{ -webkit-tap-highlight-color: transparent; }
  button{ touch-action: manipulation; }

  /* Mobile-friendly horizontal scroll for ranking event tabs (kept, but now optional) */
  #rankEventTabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
    display: none; /* dropdown-first UI; tabs still exist if you want to re-enable */
  }
  #rankEventTabs::-webkit-scrollbar { height: 6px; }
  #rankEventTabs::-webkit-scrollbar-thumb { background: #eee; border-radius: 999px; }

  /* ====== Directory (Home) UI ====== */
  :root{
    --dir-accent:#d62828;
    --dir-accent-soft:#fff5f5;
    --dir-border:#e5e7eb;
    --dir-ink:#0f172a;
    --dir-muted:#475569;
    --dir-card:#ffffff;
    --dir-surface:#f8fafc;
  }

  .dirCard{
    border:1px solid var(--dir-border);
    border-radius:18px;
    background:var(--dir-card);
    box-shadow:0 14px 30px rgba(0,0,0,.06);
    overflow:hidden;
  }
  .dirCardHead{
    padding:14px 16px;
    background:linear-gradient(135deg, #ffffff 0%, #fff7f7 100%);
    border-bottom:1px solid var(--dir-border);
    display:flex;
    justify-content:space-between;
    gap:12px;
    align-items:flex-end;
    flex-wrap:wrap;
  }
  .dirTitle{
    margin:0;
    font-size:22px;
    font-weight:950;
    color:var(--dir-ink);
    line-height:1.15;
  }
  .dirSub{
    margin-top:4px;
    font-size:12px;
    font-weight:900;
    color:var(--dir-muted);
    opacity:.9;
  }

  .segWrap{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
  }

  .segGroup{
    display:inline-flex;
    border:2px solid var(--dir-border);
    border-radius:999px;
    background:#fff;
    padding:4px;
    gap:4px;
  }
  .segBtn{
    appearance:none;
    border:0;
    cursor:pointer;
    font-weight:950;
    padding:10px 14px;
    border-radius:999px;
    background:transparent;
    color:var(--dir-ink);
    user-select:none;
    white-space:nowrap;
  }
  .segBtn.active{
    background:var(--dir-accent-soft);
    color:var(--dir-accent);
    box-shadow:0 6px 16px rgba(214,40,40,.10);
  }

  .dirBody{ padding:14px; background:var(--dir-surface); }

  .uiRow{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
    margin-bottom:12px;
  }

  .uiInput{
    flex:1;
    min-width:240px;
    padding:12px 14px;
    border:2px solid var(--dir-border);
    border-radius:14px;
    font-size:16px;
    outline:none;
    font-weight:850;
    background:#fff;
    color:var(--dir-ink);
  }
  .uiInput:focus{
    border-color:var(--dir-accent);
    box-shadow:0 0 0 4px rgba(214,40,40,.12);
  }

  .uiBtn{
    padding:12px 14px;
    border-radius:14px;
    border:2px solid var(--dir-border);
    background:#fff;
    cursor:pointer;
    font-weight:950;
    color:var(--dir-ink);
  }
  .uiBtn:hover{ border-color:#cbd5e1; }
  .uiBtn.primary{
    border-color:var(--dir-accent);
    background:var(--dir-accent-soft);
    color:var(--dir-accent);
  }

  .uiChipLabel{
    font-size:12px;
    font-weight:950;
    color:var(--dir-muted);
    opacity:.9;
  }

  .uiSelect{
    padding:12px 14px;
    border-radius:14px;
    border:2px solid var(--dir-border);
    background:#fff;
    font-weight:950;
    min-width:220px;
    color:var(--dir-ink);
    outline:none;
  }
  .uiSelect:focus{
    border-color:var(--dir-accent);
    box-shadow:0 0 0 4px rgba(214,40,40,.12);
  }

  .uiPanel{
    border:1px solid var(--dir-border);
    border-radius:16px;
    background:#fff;
    overflow:hidden;
  }

  /* ===== Existing styles you had (kept) ===== */

  /* Rankings list grid */
  .rankRow {
    display: grid;
    grid-template-columns: 70px 1.6fr 0.7fr;
    gap: 0;
    padding: 12px 12px;
    align-items: center;
  }
  .rankHeader {
    background: #f3f4f6;
    font-weight: 950;
  }
  .rankCellRight { text-align: right; font-weight: 950; }
  .rankName { font-weight: 950; color: #111; text-decoration: none; }
  .rankCompLine { margin-top: 4px; font-weight: 900; font-size: 12px; opacity: 0.75; }
  .rankCompLine a { color: #d62828; text-decoration: none; font-weight: 950; }
  .rankRow + .rankRow { border-top: 1px solid #eee; }

  /* Profile tabs + Stats UI */
  .profileTabs { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
  .pillBtn {
    padding:10px 12px; border-radius:999px; border:2px solid #ddd; background:#fff;
    cursor:pointer; font-weight:950; user-select:none;
  }
  .pillBtn.active { border-color:#d62828; background:#fff5f5; }

  .statsWrap { border:1px solid #ddd; border-radius:14px; background:#fff; padding:14px; }
  .statsGrid {
    display:grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap:10px;
    margin-top:12px;
  }
  .statCard {
    border:1px solid #eee;
    border-radius:14px;
    padding:12px;
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  }
  .statLabel { font-size:12px; font-weight:950; opacity:0.65; }
  .statValue { font-size:18px; font-weight:950; margin-top:8px; line-height:1.2; }
  .statSub { margin-top:8px; font-size:12px; font-weight:900; opacity:0.78; }
  .statBadge {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 10px; border-radius:999px; border:1px solid #ddd; background:#fff;
    font-weight:950; font-size:12px;
  }

  .selectWrap { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:10px; }
  .selectWrap label { font-weight:950; font-size:12px; opacity:0.75; }
  .selectWrap select {
    padding:10px 12px;
    border-radius:12px;
    border:2px solid #ddd;
    font-weight:950;
    background:#fff;
    min-width: 220px;
    outline:none;
  }

  /* NEW: Pagination bar (Directory) */
  .pagerBar{
    display:flex;
    justify-content:flex-end;
    gap:8px;
    flex-wrap:wrap;
    padding:12px;
    border-top:1px solid #eee;
    background:#fff;
    align-items:center;
  }
  .pagerBtn{
    padding:10px 12px;
    border-radius:12px;
    border:2px solid #ddd;
    background:#fff;
    cursor:pointer;
    font-weight:950;
    color:#111827;
  }
  .pagerBtn[disabled]{
    opacity:.45;
    cursor:not-allowed;
  }
  .pagerInfo{
    font-weight:950;
    font-size:12px;
    opacity:.75;
    margin-right:6px;
  }

  /* PR Mobile slider styles */
  #prSwipeHint { display:none; font-size:12px; font-weight:900; opacity:0.7; }
  .prMiniBadge{
    display:inline-flex; align-items:center;
    padding:4px 8px; border-radius:999px;
    border:1px solid #ddd; background:#fff;
    font-weight:950; font-size:12px; margin-left:8px;
  }
  .prDesktopTable { display:block; }
  .prMobileSlider { display:none; }
  .prCard {
    border:1px solid #eee;
    border-radius:16px;
    background:#fff;
    padding:12px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.04);
  }
  .prCardTitle { font-weight:950; font-size:16px; }
  .prCardRow { margin-top:10px; display:flex; justify-content:space-between; gap:10px; align-items:center; }
  .prCardLabel { font-size:12px; font-weight:950; opacity:0.65; }
  .prCardValue { font-weight:950; }

  /* ===== H2H UI ===== */
  .h2hModeTabs { display:flex; gap:10px; flex-wrap:wrap; margin:14px 0 10px; }
  .h2hModeBtn{
    padding:10px 12px; border-radius:999px; border:2px solid #ddd; background:#fff;
    cursor:pointer; font-weight:950;
  }
  .h2hModeBtn.active{ border-color:#d62828; background:#fff5f5; }

  .h2hNamesRow{
    display:flex;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
    margin-top:12px;
  }

  /* H2H name links (white) */
  .h2hNameLink{
    font-weight:950;
    text-decoration:none;
    color: #ffffff !important;
    border-bottom:1px dashed rgba(255,255,255,0.28);
  }

  .h2hResultWin{ color:#16a34a; font-weight:950; }
  .h2hResultLose{ color:#ef4444; font-weight:950; }

  .h2hScorePill{
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 10px;
    border-radius:999px;
    border:1px solid #ddd;
    background:#fff;
    font-weight:950;
  }

  .h2hToggleBtn{
    padding:8px 10px; border-radius:10px; border:1px solid #ddd;
    background:#fff; cursor:pointer; font-weight:950;
  }

  .h2hSetsWrap{
    margin-top:12px;
    border:1px dashed rgba(255,255,255,0.18);
    border-radius:14px;
    padding:10px;
    background:rgba(255,255,255,0.06);
    overflow-x:auto;                 /* NEW: always safe */
    -webkit-overflow-scrolling: touch;
  }

  .h2hNameRow{
    display:flex;
    align-items:center;
    gap:8px;
    min-width: 0;
  }
  .h2hNameText{
    font-weight:950;
    font-size:12px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .h2hMiniScore{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width:26px;
    height:26px;
    padding:0 8px;
    border-radius:999px;
    border:1.5px solid rgba(255,255,255,0.35);
    background:rgba(255,255,255,0.12);
    font-weight:950;
    font-size:13px;
    line-height:1;
    flex:0 0 auto;
  }

  .h2hCompCard{
    border-radius:18px;
    padding:14px;
    margin-bottom:18px;
    box-shadow:0 10px 24px rgba(0,0,0,.08);
  }

  .h2hMatchCard{
    margin-top:12px;
    padding:12px;
    border-radius:14px;
    border:1.5px solid rgba(255,255,255,0.25);
    background:rgba(255,255,255,0.06);
  }

  .h2hMatchMeta{
    display:flex;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
    margin-bottom:10px;
  }

  /* score beside player name (per set) */
  .h2hSetTable{
    display:grid;
    grid-template-columns: 116px repeat(5, minmax(46px, 1fr));
    gap:6px;
    align-items:center;
    min-width: 520px;               /* NEW: makes horizontal scroll smooth */
  }
  .h2hSetTitle{
    margin-top:12px;
    font-weight:950;
    font-size:13px;
    opacity:0.92;
    display:flex;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
  }
  .h2hTimeCell{
    text-align:center;
    font-weight:950;
    font-size:12px;
    padding:8px 6px;
    border-radius:10px;
    border:1px solid #e5e7eb;
    background:#fff;
    min-width: 46px;
    color:#111827;
  }
  .h2hTimeWin{ border-color:#16a34a !important; background:#ecfdf5 !important; color:#14532d !important; }
  .h2hTimeLose{ border-color:#ef4444 !important; background:#fef2f2 !important; color:#7f1d1d !important; }
  .h2hTimeTie{ border-color:#93c5fd !important; background:#eff6ff !important; color:#1e3a8a !important; }

  /* ===== Mobile tweaks ===== */
  @media (max-width: 900px) {
    .statsGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  /* NEW: better small-phone layout */
  @media (max-width: 720px){
    #app{ padding:12px !important; }
    .dirBody{ padding:12px; }

    .dirCardHead{
      align-items:flex-start;
      gap:10px;
    }

    /* Tabs become full-width segmented on mobile */
    .segWrap{ width:100%; }
    .segGroup{ width:100%; display:flex; }
    .segBtn{ flex:1; text-align:center; padding:11px 10px; }

    /* Inputs stack nicely */
    .uiRow{ align-items:stretch; }
    .uiInput{ min-width:0; width:100%; flex:1 1 100%; }
    .uiBtn{ width:100%; }
    .uiSelect{ width:100%; min-width:0; }

    /* Rankings: tighter grid */
    .rankRow{
      grid-template-columns: 44px 1fr 92px;
      padding:10px 10px;
    }
    .rankName{ font-size:14px; }
    .rankCellRight{ font-size:14px; }
    .rankCompLine{ font-size:11px; }

    /* Participant rows: allow wrap */
    #participantList a{
      flex-direction:column;
      align-items:flex-start !important;
    }

    /* Pagination: center on mobile */
    .pagerBar{ justify-content:center; }
  }

  @media (max-width: 640px) {
    .rankRow { grid-template-columns: 44px 1fr 92px; padding: 10px 10px; }
    .rankName { font-size: 14px; }
    .rankCompLine { font-size: 11px; }
    .rankCellRight { font-size: 14px; }

    .statsGrid { grid-template-columns: 1fr; }
    .statValue { font-size:16px; }

    .selectWrap select { width: 100%; min-width: 0; }

    /* PR becomes swipeable cards */
    #prSwipeHint { display:block; }
    .prDesktopTable { display:none; }
    .prMobileSlider {
      display:flex;
      gap:12px;
      overflow-x:auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
      scroll-snap-type: x mandatory;
    }
    .prMobileSlider::-webkit-scrollbar { height: 6px; }
    .prMobileSlider::-webkit-scrollbar-thumb { background: #eee; border-radius: 999px; }
    .prCard { flex: 0 0 84%; scroll-snap-align: start; }

    .h2hMiniScore{ min-width:22px; height:22px; font-size:12px; }
    .h2hSetTable{ grid-template-columns: 108px repeat(5, minmax(44px, 1fr)); min-width: 500px; }
    .h2hTimeCell{ min-width:44px; }
  }

  /* NEW: extra-small phones */
  @media (max-width: 420px){
    .dirTitle{ font-size:20px; }
    .segBtn{ font-size:13px; padding:10px 8px; }
    .uiInput, .uiSelect{ font-size:15px; }
    .rankRow{ grid-template-columns: 40px 1fr 86px; }
  }

