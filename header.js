'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('#home');
  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let distance = 0;
  let pending = false;

  function updateHeader() {
    pending = false;
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    previousY = currentY;
    const keyboardFocus = header.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
    if (hero.getBoundingClientRect().bottom > 0 || currentY === 0 || keyboardFocus) {
      header.classList.remove('header-hidden');
      direction = 0;
      distance = 0;
      return;
    }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (distance >= 12) {
      header.classList.toggle('header-hidden', direction > 0);
      distance = 0;
    }
  }
  function scheduleUpdate() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateHeader);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  header.addEventListener('focusin', () => header.classList.remove('header-hidden'));
  updateHeader();
})();
