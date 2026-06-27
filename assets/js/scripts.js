const TYI_AUTHORS = [
  'Nyida Gyal',
  'Khadotso Gyal',
  'Thomas Millward',
  'Tyler Jeong'
];

let allPublications = [];
let showingSelected = true;

function getPublicationsUrl() {
  const script = document.querySelector('script[data-pub-path]');
  if (script && script.dataset.pubPath) {
    return script.dataset.pubPath;
  }
  return window.location.pathname.includes('/pages/') ? '../publications.json' : 'publications.json';
}

document.addEventListener('DOMContentLoaded', () => {
  showingSelected = document.body.dataset.showAllPublications !== 'true';
  loadPublications();

  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
    toggleButton.setAttribute('aria-expanded', 'false');
  }

  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});

function loadPublications() {
  fetch(getPublicationsUrl())
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      allPublications = data.publications;
      renderPublications(showingSelected);
    })
    .catch(() => {
      displayFallbackPublications();
    });
}

function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  if (container) {
    container.innerHTML = '<p class="pub-error">Publications could not be loaded.</p>';
  }
}

function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);

  const toggleButton = document.getElementById('toggle-publications');
  const toggleHeader = document.getElementById('toggle-header');

  if (toggleButton) {
    toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
    toggleButton.setAttribute('aria-expanded', showingSelected ? 'false' : 'true');
  }

  if (toggleHeader) {
    toggleHeader.textContent = showingSelected ? 'Selected Publications' : 'All Publications';
  }
}

function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  if (!publicationsContainer) {
    return;
  }

  publicationsContainer.innerHTML = '';

  const pubsToShow = selectedOnly
    ? allPublications.filter(pub => pub.selected === 1)
    : allPublications;

  if (pubsToShow.length === 0) {
    publicationsContainer.innerHTML = '<p class="pub-loading">No publications to display.</p>';
    return;
  }

  pubsToShow.forEach(publication => {
    publicationsContainer.appendChild(createPublicationElement(publication));
  });
}

function resolveAssetPath(path) {
  if (!path || path.startsWith('http') || path.startsWith('/')) {
    return path;
  }
  return window.location.pathname.includes('/pages/') ? `../${path}` : path;
}

function createPublicationElement(publication) {
  const pubItem = document.createElement('article');
  pubItem.className = 'publication-item';

  const thumbnail = document.createElement('button');
  thumbnail.type = 'button';
  thumbnail.className = 'pub-thumbnail';
  thumbnail.setAttribute('aria-label', `View cover image for ${publication.title}`);
  thumbnail.addEventListener('click', () => openModal(resolveAssetPath(publication.thumbnail)));

  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = resolveAssetPath(publication.thumbnail);
  thumbnailImg.alt = '';
  thumbnail.appendChild(thumbnailImg);

  const content = document.createElement('div');
  content.className = 'pub-content';

  const title = document.createElement('h3');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  const authors = document.createElement('p');
  authors.className = 'pub-authors';

  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (TYI_AUTHORS.includes(author)) {
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }

    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });

  authors.innerHTML = authorsHTML;
  content.appendChild(authors);

  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('p');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('span');
    award.className = 'pub-award';
    if (publication.award === 'Under Review') {
      award.classList.add('pub-award--review');
    }
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }

  content.appendChild(venueContainer);

  if (publication.links && (publication.links.pdf || publication.links.code || publication.links.project)) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.article) {
      const fullLink = document.createElement('a');
      fullLink.href = resolveAssetPath(publication.article);
      fullLink.textContent = '[Full Text]';
      links.appendChild(fullLink);
    }

    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.textContent = '[PDF]';
      pdfLink.target = '_blank';
      pdfLink.rel = 'noopener noreferrer';
      links.appendChild(pdfLink);
    }

    if (publication.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.code;
      codeLink.textContent = '[Code]';
      codeLink.target = '_blank';
      codeLink.rel = 'noopener noreferrer';
      links.appendChild(codeLink);
    }

    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.textContent = publication.links.project.includes('ssrn') ? '[SSRN]' : '[Project Page]';
      projectLink.target = '_blank';
      projectLink.rel = 'noopener noreferrer';
      links.appendChild(projectLink);
    }

    content.appendChild(links);
  } else if (publication.article) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    const fullLink = document.createElement('a');
    fullLink.href = resolveAssetPath(publication.article);
    fullLink.textContent = '[Full Text]';
    links.appendChild(fullLink);
    content.appendChild(links);
  }

  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);

  return pubItem;
}

function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  if (!modal || !modalImg) {
    return;
  }

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  modalImg.src = imageSrc;
  modalImg.alt = 'Publication cover image enlarged';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) {
    return;
  }

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('imageModal');
  if (event.target === modal) {
    closeModal();
  }
});
