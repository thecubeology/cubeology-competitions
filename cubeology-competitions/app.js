// Active nav highlight
(function(){
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach(a=>{
    const target = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (target === file) a.classList.add("active");
  });
})();

// Loading overlay helpers (use later for rankings/timer data loading)
window.showLoading = (msg = "Loading… please wait") => {
  const el = document.getElementById("loading");
  if(!el) return;
  el.querySelector("p").textContent = msg;
  el.classList.add("show");
};
window.hideLoading = () => {
  const el = document.getElementById("loading");
  if(!el) return;
  el.classList.remove("show");
};
