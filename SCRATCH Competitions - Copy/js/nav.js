(function () {
  const cfg = window.CUBE_CFG;

  function active(path) {
    const p = location.pathname.replace(/\/+$/, "/");
    return p.includes(path);
  }

  function renderNav() {
    const nav = document.getElementById("siteNav");
    if (!nav) return;

    nav.innerHTML = `
      <div class="topbar">
        <div class="topbar__inner">
          <a class="brand" href="./">
            <span class="brand__logo" aria-hidden="true"><span class="grid9"></span></span>
            <span class="brand__text">Cubeology Competitions</span>
          </a>

          <nav class="nav">
            <a class="nav__link ${active("/competitions/") ? "is-active" : ""}" href="./competitions/">Competitions</a>
            <a class="nav__link ${active("/rankings/") ? "is-active" : ""}" href="./rankings/">Rankings</a>
            <a class="nav__link ${active("/timer/") ? "is-active" : ""}" href="./timer/">Timer</a>
            <a class="nav__pill" href="${cfg.STORE_URL}" target="_blank" rel="noopener">Store</a>
          </nav>
        </div>
      </div>
    `;
  }

  renderNav();
})();
