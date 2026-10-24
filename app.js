(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  document.documentElement.classList.add('js');

  // Dawn: scroll progress 0 → 1 drives the sun and the night veil.
  var dawn = document.querySelector('.dawn');
  var pending = false;
  function update() {
    var r = dawn.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    var p = total > 0 ? -r.top / total : 1;
    p = Math.max(0, Math.min(1, p));
    dawn.style.setProperty('--p', p.toFixed(3));
    pending = false;
  }
  if (dawn) {
    if (reduce) {
      dawn.style.setProperty('--p', '1');
    } else {
      window.addEventListener('scroll', function () {
        if (!pending) { pending = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  // Reveal on scroll.
  var items = document.querySelectorAll('.reveal');
  if (reduce || !hasIO) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Step illustrations: play while in view, restart every cycle.
  var figs = document.querySelectorAll('.anim');
  function restart(f) {
    f.classList.remove('play');
    void f.offsetWidth; // flush so the animations restart
    f.classList.add('play');
  }
  if (reduce || !hasIO) {
    figs.forEach(function (f) { f.classList.add('play'); });
    return;
  }
  var ao = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var f = e.target;
      if (e.isIntersecting) {
        if (!f._timer) {
          restart(f);
          f._timer = setInterval(function () { restart(f); }, +f.dataset.cycle || 8000);
        }
      } else if (f._timer) {
        clearInterval(f._timer);
        f._timer = null;
        f.classList.remove('play');
      }
    });
  }, { threshold: 0.35 });
  figs.forEach(function (f) { ao.observe(f); });
})();
