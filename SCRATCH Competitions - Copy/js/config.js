// Central config for CSV endpoints and site links
window.CUBE_CFG = {
  // ✅ Competitions CSV (gid specific)
  COMPETITIONS_CSV:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qCCGUoHYG6RZL6MlLkOAWw60yYIomChaU-Yxz5j9xHBeqfNcuY_uBxntgbAw-HUMY-Z7sGK7_gnR/pub?gid=102833056&single=true&output=csv",

  // ✅ Results CSV (same sheet, but without gid)
  RESULTS_CSV:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9qCCGUoHYG6RZL6MlLkOAWw60yYIomChaU-Yxz5j9xHBeqfNcuY_uBxntgbAw-HUMY-Z7sGK7_gnR/pub?single=true&output=csv",

  // Optional: if you later make a people/participants sheet
  PERSONS_CSV: "",

  // ✅ Store
  STORE_URL: "https://thecubeology.com",

  // Your competition pages are in /competitions/<comp_id>/
  COMP_BASE_PATH: "./competitions/"
};
