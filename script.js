const BASE_URL = 'https://cdn.freedomforum.org/dfp/jpg';
const STATUS_URL = 'https://api.freedomforum.org/cache/status.js';
const PAPERS_URL = 'https://api.freedomforum.org/cache/papers.js';

const img = document.querySelector('img');

const update = async () => {
  const [status, papers] = await Promise.all([
    fetch(STATUS_URL).then((response) => response.json()),
    fetch(PAPERS_URL).then((response) => response.json()),
  ]);
  return {
    status: status[0],
    papers,
  };
};

const getPaperURL = (dayNumber, paperID) => {
  return `${BASE_URL}${dayNumber}/lg/${paperID}.jpg`;
};

const init = async () => {
  const { status, papers } = await update();
  const numPapers = papers.length;
  const { dayNumber } = status;
  const randomIndex = Math.floor(Math.random() * numPapers);
  img.src = getPaperURL(dayNumber, papers[randomIndex].paperId);
};
init();

setInterval(init, 30 * 60 * 1000);

img.addEventListener('error', init);
img.addEventListener('load', () => {
  img.width = img.naturalWidth;
  img.height = img.naturalHeight;
  img.hidden = false;
  document.body.style.backgroundImage = `url(${img.src})`;
});

img.addEventListener('click', async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  try {
    await img.requestFullscreen();
  } catch (err) {
    alert(`${err.name} ${err.message}.`);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('Service worker registered for scope', registration.scope);
  });
}
