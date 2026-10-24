(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // Dawn: scroll progress 0 → 1 drives the sun and the sky.
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
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  items.forEach(function (el) { io.observe(el); });
})();
