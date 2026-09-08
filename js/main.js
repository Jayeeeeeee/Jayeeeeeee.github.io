/* =========================================================
   Rendering + interactions. You should rarely need to touch
   this file - all content comes from js/data.js.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // Escape anything that came from data.js before it touches innerHTML.
  const esc = (str) =>
    String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Escape first, then allow **bold** through.
  // Escape first, then re-allow a tiny, known-safe markdown subset:
  //   **bold**              -> <strong>
  //   [label](https://url)  -> <a>
  // Because esc() has already run, the url is escaped text - quotes are
  // &quot; - so it cannot break out of the attribute. Only http(s), mailto,
  // relative and #anchor targets are linked; anything else (javascript:, say)
  // is left as literal text.
  const SAFE_URL = /^(https?:\/\/|mailto:|\/|\.\/|#)/i;

  const rich = (str) =>
    esc(str)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, url) => {
        if (!SAFE_URL.test(url)) return whole;
        const ext = /^(https?:|mailto:)/i.test(url)
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return '<a href="' + url + '"' + ext + ">" + label + "</a>";
      });

  // Build an inline <svg> for an icon key. Outline icons (lucide) are
  // stroked; solid ones (simple-icons) are filled - the class carries that.
  function iconSvg(key, cls) {
    const shapes = key && typeof ICON_SHAPES !== "undefined" ? ICON_SHAPES[key] : "";
    if (!shapes) return "";
    const box =
      (typeof ICON_VIEWBOX !== "undefined" && ICON_VIEWBOX[key]) || "0 0 24 24";
    const stroke =
      typeof ICON_STROKE !== "undefined" && ICON_STROKE[key] ? " icon-stroke" : "";
    return (
      '<svg class="' + cls + stroke + '" viewBox="' + esc(box) + '" ' +
      'aria-hidden="true" focusable="false">' + shapes + "</svg>"
    );
  }

  // Read "hero.name" out of the SITE object.
  const get = (path) =>
    path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), SITE);

  const setHTML = (el, html) => { if (el) el.innerHTML = html; };

  /* ---------- images: swap a missing file for a lettered placeholder ---------- */

  // Any <img data-fb="css-class" data-letter="X"> becomes that placeholder
  // if the file 404s, so a missing screenshot never shows a broken icon.
  function initImageFallbacks() {
    $$("img[data-fb]").forEach((img) => {
      img.addEventListener("error", () => {
        const holder = img.parentElement;
        const cls = img.dataset.fb;
        const letter = img.dataset.letter || "?";
        img.remove();
        holder.insertAdjacentHTML(
          "afterbegin",
          '<span class="' + cls + '" aria-hidden="true">' + esc(letter) + "</span>"
        );
      });
    });
  }

  /* ---------- simple text bindings (data-bind="hero.name") ---------- */

  function renderBindings() {
    $$("[data-bind]").forEach((el) => {
      const value = get(el.dataset.bind);
      // A field you delete from data.js should take its element with it -
      // an empty <p> still contributes its margin and leaves a stray gap.
      if (value == null || value === "") {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.textContent = value;
    });
  }

  /* ---------- hero ---------- */

  function renderHero() {
    const list = SITE.hero.meta || [];
    setHTML($("#heroMeta"), list.map((item) => "<li>" + esc(item) + "</li>").join(""));
  }

  /* ---------- tag chips ---------- */

  // Labels listed in TAG_ICONS (js/icons.js) get an inline SVG painted with
  // fill:currentColor, so it matches the chip text and its hover state.
  // Anything else gets a lettered chip, keeping every chip the same shape.
  function tagChip(item) {
    const name = typeof item === "string" ? item : item.name;
    const key = typeof TAG_ICONS !== "undefined" ? TAG_ICONS[name] : "";
    const svg = iconSvg(key, "tag-icon");
    const media = svg
      ? svg
      : '<span class="tag-icon-fallback" aria-hidden="true">' +
        esc((name || "?").charAt(0).toUpperCase()) + "</span>";

    return '<span class="tag has-icon">' + media + "<span>" + esc(name) + "</span></span>";
  }

  /* ---------- about + skills ---------- */

  function renderAbout() {
    const paras = SITE.about.paragraphs || [];
    setHTML($("#aboutText"), paras.map((p) => "<p>" + rich(p) + "</p>").join(""));

    const facts = SITE.about.facts || [];
    setHTML(
      $("#aboutFacts"),
      facts
        .map((f) => "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>")
        .join("")
    );

    // If no portrait file exists, drop the image rather than showing a broken icon.
    const portrait = $("#portrait");
    if (portrait) {
      portrait.alt = "Portrait of " + (SITE.hero.name || "");
      portrait.addEventListener("error", () => {
        const box = portrait.closest(".about-portrait");
        if (box) box.remove();
      });
    }
  }

  function renderSkills() {
    const groups = SITE.skills || [];
    setHTML(
      $("#skillsGrid"),
      groups
        .map(
          (g) =>
            '<div class="skill-group"><h4>' +
            esc(g.group) +
            '</h4><div class="tag-row">' +
            (g.items || []).map(tagChip).join("") +
            "</div></div>"
        )
        .join("")
    );
  }

  /* ---------- projects ---------- */

  function renderProjects() {
    const projects = SITE.projects || [];

    setHTML(
      $("#projectGrid"),
      projects
        .map((p, i) => {
          const letter = esc((p.title || "?").charAt(0).toUpperCase());
          const thumb = p.image
            ? '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.title) +
              '\" loading=\"lazy\" width=\"640\" height=\"400\" ' +
              'data-fb=\"project-thumb-fallback\" data-letter=\"' + letter + '\">'
            : '<div class="project-thumb-fallback" aria-hidden="true">' + letter + "</div>";

          const links = (p.links || [])
            .filter((l) => l.url)
            .map(
              (l) =>
                '<a class="project-link" href="' + esc(l.url) +
                '" target="_blank" rel="noopener noreferrer">' + esc(l.label) +
                ' <span aria-hidden="true">&rarr;</span></a>'
            )
            .join("");

          return (
            '<article class="project-card" data-reveal style="transition-delay:' +
            Math.min(i * 90, 360) + 'ms">' +
              '<div class="project-thumb" data-letter="' + letter + '">' + thumb + "</div>" +
              '<div class="project-body">' +
                '<p class="project-year">' + esc(p.year) + "</p>" +
                '<h3 class="project-title">' + esc(p.title) + "</h3>" +
                '<p class="project-desc">' + rich(p.description) + "</p>" +
                '<div class="project-tags">' +
                  (p.tags || []).map(tagChip).join("") +
                "</div>" +
                '<div class="project-links">' + links + "</div>" +
              "</div>" +
            "</article>"
          );
        })
        .join("")
    );
  }

  /* ---------- experience timeline ---------- */

  function renderTimeline() {
    const items = SITE.experience || [];
    setHTML(
      $("#timeline"),
      items
        .map((e) => {
          const points = (e.points || []).length
            ? '<ul class="timeline-points">' +
              e.points.map((pt) => "<li>" + esc(pt) + "</li>").join("") +
              "</ul>"
            : "";
          return (
            '<li class="timeline-item' + (e.current ? " is-current" : "") + '" data-reveal>' +
              '<p class="timeline-date">' + esc(e.date) + "</p>" +
              '<h3 class="timeline-role">' + esc(e.role) + "</h3>" +
              '<p class="timeline-org">' + esc(e.org) + "</p>" +
              (e.description ? '<p class="timeline-desc">' + rich(e.description) + "</p>" : "") +
              points +
            "</li>"
          );
        })
        .join("")
    );
  }

  /* ---------- certifications ---------- */

  function renderCertifications() {
    const certs = SITE.certifications || [];
    setHTML(
      $("#certGrid"),
      certs
        .map((c, i) => {
          // Link label can be overridden per cert (e.g. "Credly Badge" vs "Verify").
          const label = c.linkLabel || "Credly Badge";
          const external = c.url
            ? '<a class="cert-link" href="' + esc(c.url) +
              '" target="_blank" rel="noopener noreferrer">' + esc(label) + " " +
              '<span aria-hidden="true">&rarr;</span></a>'
            : "";

          // The pill is only shown when there is something to verify against.
          const verified = c.url
            ? '<span class="cert-verified"><span aria-hidden="true">&#10003;</span> Verified</span>'
            : "";

          const tags = (c.tags || []).length
            ? '<div class="cert-tags">' +
              c.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") +
              "</div>"
            : "";

          // The BADGE is the square credential image, card display only.
          const glyph = c.icon || "\u25C6";
          const img = c.badge
            ? '<img src="' + esc(c.badge) + '" alt="' + esc(c.name) +
              ' badge" loading="lazy" width="400" height="400" ' +
              'data-fb="cert-thumb-fallback" data-letter="' + esc(glyph) + '">'
            : '<span class="cert-thumb-fallback" aria-hidden="true">' + esc(glyph) + "</span>";

          // Display only: the button below is the single way into the modal.
          const thumb = '<div class="cert-thumb">' + img + verified + "</div>";

          // Offered only when there is an actual certificate document to open.
          const view = c.certificate
            ? '<button class="cert-link cert-view" type="button" data-cert="' + i + '">' +
              "View certificate</button>"
            : "";

          const actions = view || external
            ? '<div class="cert-actions">' + view + external + "</div>"
            : "";

          return (
            '<article class="cert-card" data-reveal style="transition-delay:' +
            Math.min(i * 70, 280) + 'ms">' +
              thumb +
              '<div class="cert-body">' +
                '<h3 class="cert-name">' + esc(c.name) + "</h3>" +
                '<p class="cert-issuer">' + esc(c.issuer) + "</p>" +
                '<p class="cert-date">' + esc(c.date) + "</p>" +
                tags +
                actions +
              "</div>" +
            "</article>"
          );
        })
        .join("")
    );
  }

  /* ---------- contact ---------- */

  function renderContact() {
    const email = SITE.contact.email || "";
    const link = $("#contactEmail");
    if (link) {
      // The <svg> contributes no text, so link.textContent stays the address.
      setHTML(link, iconSvg("mail", "contact-icon") + "<span>" + esc(email) + "</span>");
      link.href = "mailto:" + email;
    }

    setHTML(
      $("#socialList"),
      (SITE.contact.socials || [])
        .filter((s) => s.url)
        .map((s) => {
          const key = typeof TAG_ICONS !== "undefined" ? TAG_ICONS[s.label] : "";
          return (
            '<li><a href="' + esc(s.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            iconSvg(key, "social-icon") + "<span>" + esc(s.label) + "</span></a></li>"
          );
        })
        .join("")
    );

    // The button only opens the modal; wiring lives in initResumeModal().
    const resume = $("#resumeBtn");
    if (resume && !SITE.contact.resume) resume.remove();

    const copy = $("#copyEmail");
    if (copy) {
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(email);
        } catch (err) {
          // Clipboard API needs https or localhost; fall back to selecting the text.
          const range = document.createRange();
          range.selectNodeContents(link);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        copy.textContent = "Copied";
        copy.classList.add("is-copied");
        setTimeout(() => {
          copy.textContent = "Copy";
          copy.classList.remove("is-copied");
        }, 1800);
      });
    }
  }

  /* ---------- modal scroll lock (shared by every dialog) ---------- */

  // overflow:hidden on <html> collapses the scrollable area, so the browser
  // clamps scrollY to 0. Remember the position and put it back on close,
  // otherwise dismissing a modal throws the reader to the top of the page.
  const docEl = document.documentElement;
  let lockedY = 0;

  function lockScroll() {
    lockedY = window.scrollY;
    docEl.style.overflow = "hidden";
  }

  function unlockScroll() {
    docEl.style.overflow = "";
    const prev = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";   // defeat scroll-behavior: smooth
    window.scrollTo(0, lockedY);
    // <dialog> restores focus to the trigger, which can scroll it into view
    // after this handler runs - re-assert next frame to win that race.
    requestAnimationFrame(() => {
      window.scrollTo(0, lockedY);
      docEl.style.scrollBehavior = prev;
    });
  }

  /* ---------- certificate lightbox ---------- */

  function initCertLightbox() {
    const dialog = $("#certModal");
    const img = $("#certModalImg");
    if (!dialog || !img) return;

    const title = $("#certModalTitle");
    const meta = $("#certModalMeta");
    const link = $("#certModalLink");
    const supported = typeof dialog.showModal === "function";
    function open(index) {
      const c = (SITE.certifications || [])[index];
      if (!c || !c.certificate) return;

      // The certificate document - a different image from the card badge.
      const src = c.certificate;

      if (!supported) {           // very old browser: just open the file
        window.open(src, "_blank", "noopener");
        return;
      }

      const stage = img.parentElement;
      const stale = stage.querySelector(".lightbox-missing");
      if (stale) stale.remove();
      img.hidden = false;
      img.onerror = () => {
        img.hidden = true;
        stage.insertAdjacentHTML(
          "beforeend",
          '<p class="lightbox-missing">Certificate scan not uploaded yet.' +
            '<br><code>' + esc(src) + "</code></p>"
        );
      };

      img.src = src;
      img.alt = c.name + " certificate";
      title.textContent = c.name;
      meta.textContent = [c.issuer, c.date].filter(Boolean).join("  ·  ");

      if (c.url) {
        link.href = c.url;
        link.textContent = (c.linkLabel || "Credly Badge") + "  ↗";
        link.hidden = false;
      } else {
        link.hidden = true;
      }

      lockScroll();
      dialog.showModal();
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    // One delegated listener covers the panel and the "View certificate" button.
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-cert]");
      if (trigger) {
        e.preventDefault();
        open(Number(trigger.dataset.cert));
      }
    });

    $("#certModalClose").addEventListener("click", close);

    // Clicking the backdrop closes; clicks inside the figure must not bubble out.
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });

    // Fires for the close button and for Escape, which <dialog> handles natively.
    dialog.addEventListener("close", () => {
      unlockScroll();
      img.removeAttribute("src");        // release the full-size image
    });
  }

  /* ---------- resume modal ---------- */

  function initResumeModal() {
    const btn = $("#resumeBtn");
    const dialog = $("#resumeModal");
    const src = SITE.contact.resume || "";
    if (!btn || !dialog || !src) return;

    const stage = $("#resumeStage");
    const meta = $("#resumeModalMeta");
    const dl = $("#resumeDownload");
    const openTab = $("#resumeOpen");

    setHTML($("#resumeDownloadIcon"), iconSvg("download", "btn-icon"));
    dl.href = src;
    dl.setAttribute("download", "");
    openTab.href = src;
    meta.textContent = src.split("/").pop();

    const missing = () =>
      '<div class="resume-empty">' +
      iconSvg("filetext", "resume-empty-icon") +
      "<p>No résumé uploaded yet.</p><p><code>" + esc(src) + "</code></p></div>";

    // A PDF in an <object> shows a blank frame when the file is absent, so
    // check first. fetch() is blocked on file:// URLs - that throws rather
    // than 404s, so assume the file is there and let the preview try.
    async function fill() {
      let ok = true;
      try {
        const res = await fetch(src, { method: "HEAD" });
        ok = res.ok;
      } catch (err) {
        ok = true;
      }

      if (!ok) {
        setHTML(stage, missing());
        dl.hidden = true;
        openTab.hidden = true;
        return;
      }

      dl.hidden = false;
      openTab.hidden = false;
      setHTML(
        stage,
        '<object class="resume-frame" data="' + esc(src) +
          '" type="application/pdf">' +
          '<div class="resume-empty">' +
          iconSvg("filetext", "resume-empty-icon") +
          "<p>Your browser cannot preview PDFs here.</p>" +
          "<p>Use the download button below.</p></div>" +
          "</object>"
      );
    }

    btn.addEventListener("click", () => {
      fill();
      lockScroll();
      dialog.showModal();
    });

    $("#resumeModalClose").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      unlockScroll();
      setHTML(stage, "");   // stop the embedded PDF rendering in the background
    });
  }

  /* ---------- header: mobile menu, shadow, scroll progress ---------- */

  function initHeader() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const nav = $("#primaryNav");
    const bar = $("#scrollProgress");

    if (toggle && nav) {
      const setOpen = (open) => {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      toggle.addEventListener("click", () =>
        setOpen(toggle.getAttribute("aria-expanded") !== "true")
      );
      // Close after tapping a link, and on Escape.
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- highlight the nav link for the section in view ---------- */

  function initScrollSpy() {
    const links = $$(".nav a[href^='#']");
    const map = new Map();
    links.forEach((a) => {
      const section = document.querySelector(a.getAttribute("href"));
      if (section) map.set(section, a);
    });
    if (!map.size || !("IntersectionObserver" in window)) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.remove("is-active"));
          const active = map.get(entry.target);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, section) => spy.observe(section));
  }

  /* ---------- reveal on scroll ---------- */

  function initReveal() {
    const targets = $$("[data-reveal]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // reveal once, then stop watching
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- boot ---------- */

  function init() {
    if (typeof SITE === "undefined") {
      console.error("js/data.js did not load - check the script tags in index.html.");
      return;
    }

    document.title = SITE.hero.name + " - Portfolio";
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    renderBindings();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderTimeline();
    renderCertifications();
    renderContact();

    initImageFallbacks(); // after renderers: wires the <img> tags they created
    initCertLightbox();
    initResumeModal();
    initHeader();
    initScrollSpy();
    initReveal(); // must run last: it observes the nodes the renderers just made
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
