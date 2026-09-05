const gallery = document.querySelector('#gallery');
const imageCount = document.querySelector('#image-count');
const emptyState = document.querySelector('#empty-state');

const MANIFEST_PATH = './images.json';

function formatImageCount(count) {
  if (count === 0) return '0 images';
  if (count === 1) return '1 image';
  return `${count} images`;
}

function getFileName(path) {
  return decodeURIComponent(path.split('/').pop() || 'Image');
}

function renderImages(images) {
  gallery.replaceChildren();
  imageCount.textContent = formatImageCount(images.length);
  emptyState.hidden = images.length !== 0;

  const fragment = document.createDocumentFragment();

  images.forEach((src, index) => {
    const link = document.createElement('a');
    link.className = 'gallery-link';
    link.href = src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = `Open ${getFileName(src)} in full resolution`;

    const img = document.createElement('img');
    img.src = src;
    img.alt = getFileName(src).replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
    img.loading = index < 8 ? 'eager' : 'lazy';
    img.decoding = 'async';

    link.appendChild(img);
    fragment.appendChild(link);
  });

  gallery.appendChild(fragment);
}

async function loadImages() {
  try {
    const response = await fetch(`${MANIFEST_PATH}?v=${Date.now()}`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Could not load ${MANIFEST_PATH}`);
    }

    const images = await response.json();

    if (!Array.isArray(images)) {
      throw new Error(`${MANIFEST_PATH} must contain an array.`);
    }

    renderImages(images);
  } catch (error) {
    console.error(error);
    imageCount.textContent = 'Could not load images';
    emptyState.hidden = false;
    emptyState.textContent = 'Could not load images.json. Run the generator script or wait for GitHub Actions to deploy.';
  }
}

loadImages();
