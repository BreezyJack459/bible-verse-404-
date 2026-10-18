(function (root) {
  var STORAGE_KEY = "bible-verse-404-order";

  function findVerseIndex(verses, param) {
    if (param == null) return -1;
    var value = String(param).trim();
    if (!value) return -1;
    if (/^\d+$/.test(value)) {
      var index = parseInt(value, 10);
      return index >= 0 && index < verses.length ? index : -1;
    }
    for (var i = 0; i < verses.length; i++) {
      if (verses[i].id === value) return i;
    }
    return -1;
  }

  function unsplashUrl(photoId, width) {
    var w = width || 1800;
    return "https://images.unsplash.com/photo-" + photoId + "?auto=format&fit=crop&w=" + w + "&q=75";
  }

  function createRotation(verses, storage, randomFn) {
    var rand = randomFn || Math.random;

    function ids() {
      return verses.map(function (verse) { return verse.id; });
    }

    function shuffle(list) {
      var copy = list.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1));
        var tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy;
    }

    function isValid(state) {
      if (!state || !Array.isArray(state.order) || typeof state.index !== "number") return false;
      var all = ids();
      if (state.order.length !== all.length) return false;
      if (state.index < 0 || state.index > all.length) return false;
      var seen = Object.create(null);
      for (var i = 0; i < state.order.length; i++) {
        var id = state.order[i];
        if (seen[id] || all.indexOf(id) === -1) return false;
        seen[id] = true;
      }
      return true;
    }

    function read() {
      try {
        var raw = storage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var state = JSON.parse(raw);
        return isValid(state) ? state : null;
      } catch (err) {
        return null;
      }
    }

    function write(state) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        /* 隱私模式可能拒絕寫入，當次仍可顯示。 */
      }
    }

    function fresh(avoidId) {
      var order = shuffle(ids());
      if (avoidId && order.length > 1 && order[0] === avoidId) {
        var swap = 1 + Math.floor(rand() * (order.length - 1));
        var first = order[0];
        order[0] = order[swap];
        order[swap] = first;
      }
      return { order: order, index: 0 };
    }

    return {
      takeNext: function (avoidId) {
        var state = read();
        if (!state || state.index >= state.order.length) {
          var avoid = avoidId || (state ? state.order[state.order.length - 1] : null);
          state = fresh(avoid);
        }
        var id = state.order[state.index];
        state.index += 1;
        write(state);
        return id;
      }
    };
  }

  root.BibleVerse404 = {
    findVerseIndex: findVerseIndex,
    unsplashUrl: unsplashUrl,
    createRotation: createRotation
  };

  if (typeof document === "undefined" || !document.getElementById("verse-zh")) return;

  var verses = root.VERSES || [];
  var rotation = createRotation(verses, window.sessionStorage);
  var photo = document.getElementById("photo");
  var image = document.getElementById("verse-image");
  var zh = document.getElementById("verse-zh");
  var en = document.getElementById("verse-en");
  var cite = document.getElementById("verse-cite");
  var nextButton = document.getElementById("next-verse");
  var renderToken = 0;

  function verseById(id) {
    for (var i = 0; i < verses.length; i++) {
      if (verses[i].id === id) return verses[i];
    }
    return verses[0];
  }

  function chosenWidth() {
    var viewport = window.innerWidth || 1200;
    var ratio = window.devicePixelRatio || 1;
    var cssWidth = viewport < 860 ? viewport : Math.round(viewport * 0.58);
    var width = Math.round(cssWidth * ratio);
    if (width < 800) width = 800;
    if (width > 2400) width = 2400;
    return width;
  }

  function render(verse) {
    var token = ++renderToken;
    document.body.setAttribute("data-verse-id", verse.id);
    zh.textContent = verse.zh;
    en.textContent = verse.en;
    cite.textContent = verse.citation + " · " + verse.citationEn;
    document.title = verse.citation + " — 找不到這一頁";
    photo.style.setProperty("--fallback", verse.fallback);
    photo.classList.remove("is-fallback");
    image.classList.remove("is-ready");
    image.alt = verse.alt || "";
    image.onload = function () {
      if (token !== renderToken) return;
      if (!image.naturalWidth) {
        photo.classList.add("is-fallback");
        return;
      }
      image.classList.add("is-ready");
    };
    image.onerror = function () {
      if (token !== renderToken) return;
      photo.classList.add("is-fallback");
      image.classList.remove("is-ready");
    };
    image.src = unsplashUrl(verse.photo, chosenWidth());
  }

  function clearVerseParam() {
    var url = new URL(window.location.href);
    if (!url.searchParams.has("v")) return;
    url.searchParams.delete("v");
    var search = url.searchParams.toString();
    window.history.replaceState(null, "", url.pathname + (search ? "?" + search : "") + url.hash);
  }

  var pinned = findVerseIndex(verses, new URLSearchParams(window.location.search).get("v"));
  if (pinned >= 0) {
    render(verses[pinned]);
  } else if (verses.length) {
    render(verseById(rotation.takeNext(null)));
  }

  nextButton.addEventListener("click", function () {
    clearVerseParam();
    var currentId = document.body.getAttribute("data-verse-id");
    render(verseById(rotation.takeNext(currentId)));
  });
})(typeof window !== "undefined" ? window : globalThis);
