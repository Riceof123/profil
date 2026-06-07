const verifyBtn = document.getElementById('verifyBtn');
const transitionOverlay = document.getElementById('transitionOverlay');

function playTransitionAndNavigate(url) {
  if (!transitionOverlay) {
    window.location.href = url;
    return;
  }

  transitionOverlay.classList.remove('hidden');
  transitionOverlay.classList.add('overlay-show');

  const onEnd = () => {
    window.location.href = url;
  };

  transitionOverlay.addEventListener('animationend', onEnd, { once: true });
}

verifyBtn.addEventListener('click', () => {
  playTransitionAndNavigate('result.html');
  verifyBtn.blur();
});
