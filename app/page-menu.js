// Page switcher for the Android app build only (the workflow adds this file
// to loss.html, vp.html and connectors.html). Shows a menu button at the top
// right of each page.
(function () {
  var PAGES = [
    { file: "loss.html", label: "Cable Loss Calculator" },
    { file: "vp.html", label: "Coax Vp Reference" },
    { file: "connectors.html", label: "Connector Prep" }
  ];
  var here = location.pathname.split("/").pop() || "loss.html";

  var css = `
  #pm-btn{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);right:10px;z-index:1000;
    width:42px;height:42px;border-radius:10px;border:1px solid var(--pm-line);background:var(--pm-bg);
    color:var(--pm-fg);display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 1px 3px rgba(0,0,0,.15);-webkit-tap-highlight-color:transparent;padding:0}
  #pm-btn svg{width:22px;height:22px}
  #pm-menu{position:absolute;top:calc(env(safe-area-inset-top,0px) + 58px);right:10px;z-index:1001;
    min-width:220px;background:var(--pm-bg);color:var(--pm-fg);border:1px solid var(--pm-line);
    border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.22);padding:6px;
    font:500 15px system-ui,-apple-system,sans-serif}
  #pm-menu[hidden]{display:none!important}
  #pm-menu a{display:flex;align-items:center;gap:10px;padding:12px 12px;border-radius:8px;
    color:inherit;text-decoration:none}
  #pm-menu a:active{background:var(--pm-hover)}
  #pm-menu a[aria-current="page"]{font-weight:700;background:var(--pm-hover)}
  #pm-menu a .dot{width:8px;height:8px;border-radius:50%;background:transparent;flex:none}
  #pm-menu a[aria-current="page"] .dot{background:var(--pm-accent)}
  h1{padding-right:52px}
  :root{--pm-bg:#ffffff;--pm-fg:#1d2420;--pm-line:rgba(0,0,0,.15);--pm-hover:rgba(0,0,0,.07);--pm-accent:#1f6b4f}
  :root.pm-dark{--pm-bg:#1a2129;--pm-fg:#e6ebf1;--pm-line:rgba(255,255,255,.18);--pm-hover:rgba(255,255,255,.09);--pm-accent:#4fa8f0}
  `;

  function isDark() {
    var c = getComputedStyle(document.body).backgroundColor.match(/\d+(\.\d+)?/g);
    if (!c) return false;
    return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) < 110;
  }

  function init() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement("button");
    btn.id = "pm-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Switch page");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

    var menu = document.createElement("nav");
    menu.id = "pm-menu";
    menu.hidden = true;
    PAGES.forEach(function (p) {
      var a = document.createElement("a");
      a.href = p.file;
      a.innerHTML = '<span class="dot"></span>' + p.label;
      if (p.file === here) a.setAttribute("aria-current", "page");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (p.file === here) { close(); return; }
        location.replace(p.file); // so Back exits the app instead of stepping through pages
      });
      menu.appendChild(a);
    });

    function open() {
      document.documentElement.classList.toggle("pm-dark", isDark());
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    document.documentElement.classList.toggle("pm-dark", isDark());
    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
