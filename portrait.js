'use strict';
(() => {
  const preview = document.querySelector('.portrait-preview');
  const dialog = document.querySelector('#portrait-dialog');
  const views = [...dialog.querySelectorAll('[data-portrait-view]')];
  function showView(view) {
    dialog.querySelector('.portrait-full-view').hidden = view !== 'full';
    dialog.querySelector('.portrait-certificate-view').hidden = view !== 'certificate';
    views.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.portraitView === view)));
  }
  preview.addEventListener('click', () => {
    showView('certificate');
    dialog.showModal();
    document.body.classList.add('portrait-viewer-open');
  });
  views.forEach(button => button.addEventListener('click', () => showView(button.dataset.portraitView)));
  dialog.querySelector('.portrait-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('portrait-viewer-open');
    preview.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
