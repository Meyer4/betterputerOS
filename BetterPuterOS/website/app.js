document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      document.body.classList.toggle('dark');
      if(document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
});

const getStartedBtn = document.getElementById('get-started');
if(getStartedBtn) {
  getStartedBtn.addEventListener('click', function() {
    alert('Thanks for your interest! Stay tuned for BetterPuterOS.');
  });
}
