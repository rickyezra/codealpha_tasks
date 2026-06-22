const categories = ['All', 'Nature', 'Architecture', 'Luxury Cars', 'Travel', 'Portraits'];

const galleryItems = [
  {
    id: 1,
    category: 'Luxury Cars',
    title: 'Rolls Royce Midnight',
    description: 'Editorial automotive portrait with cinematic contrast and matte reflections.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    category: 'Luxury Cars',
    title: 'Bentley Continental',
    description: 'A sculpted luxury coupe framed for a premium brand-forward composition.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    category: 'Architecture',
    title: 'Dubai Tower Lines',
    description: 'Monolithic geometry and gold-toned light from a futuristic skyline.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    category: 'Travel',
    title: 'Santorini Horizon',
    description: 'Luxury coastal escape with bright facades and soft sunset atmosphere.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    category: 'Nature',
    title: 'Alpine Stillness',
    description: 'A premium mountain scene built for depth, serenity, and atmosphere.',
    image: 'https://images.unsplash.com/photo-1464822759844-d150baec4f8d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    category: 'Portraits',
    title: 'Velvet Portrait',
    description: 'A refined fashion portrait with soft shadows and Vogue-inspired elegance.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 7,
    category: 'Architecture',
    title: 'Modern Marble Atrium',
    description: 'A luxury interior with polished textures and monochrome symmetry.',
    image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 8,
    category: 'Travel',
    title: 'Paris Evening Drive',
    description: 'Refined city travel frame with elegant lighting and elevated composition.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 9,
    category: 'Nature',
    title: 'Golden Coastline',
    description: 'Soft ocean light with a high-end lifestyle mood and deep tonal richness.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 10,
    category: 'Portraits',
    title: 'Studio Luxe',
    description: 'Minimal portrait framing with a premium editorial finish and calm presence.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 11,
    category: 'Luxury Cars',
    title: 'Black Label Grand Tourer',
    description: 'A dramatic automotive portrait with pure black surfaces and gold edge lighting.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 12,
    category: 'Architecture',
    title: 'Heritage Facade',
    description: 'Luxury architectural composition with symmetry and quiet prestige.',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80',
  },
];

const state = {
  activeCategory: 'All',
  query: '',
  currentIndex: 0,
  filteredItems: [...galleryItems],
};

const loader = document.getElementById('loader');
const filtersEl = document.getElementById('filters');
const galleryGrid = document.getElementById('galleryGrid');
const searchInput = document.getElementById('searchInput');
const resultText = document.getElementById('resultText');
const visibleCount = document.getElementById('visibleCount');
const themeToggle = document.getElementById('themeToggle');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const particleField = document.getElementById('particleField');

const favorites = new Set(JSON.parse(localStorage.getItem('luxe-favorites') || '[]'));
let scrollRevealObserver;

function buildFilters() {
  filtersEl.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-btn ${category === 'All' ? 'active' : ''}" type="button" data-category="${category}" aria-pressed="${category === 'All'}">
          ${category}
        </button>
      `,
    )
    .join('');
}

function getFilteredItems() {
  const query = state.query.trim().toLowerCase();
  return galleryItems.filter((item) => {
    const matchesCategory = state.activeCategory === 'All' || item.category === state.activeCategory;
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

function renderGallery() {
  state.filteredItems = getFilteredItems();
  visibleCount.textContent = state.filteredItems.length;
  resultText.textContent = `${state.filteredItems.length} image${state.filteredItems.length === 1 ? '' : 's'}`;

  galleryGrid.innerHTML = state.filteredItems
    .map(
      (item, index) => `
        <article class="gallery-item reveal" tabindex="0" role="button" aria-label="Open ${item.title}" data-index="${index}" data-category="${item.category}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="gallery-item__meta">
            <p>${item.category}</p>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </article>
      `,
    )
    .join('');

  prepareRevealObserver();
}

function syncCategoryButtons() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    const isActive = button.dataset.category === state.activeCategory;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function openLightbox(index) {
  if (!state.filteredItems.length) {
    return;
  }

  state.currentIndex = (index + state.filteredItems.length) % state.filteredItems.length;
  const item = state.filteredItems[state.currentIndex];

  lightboxImage.src = item.image;
  lightboxImage.alt = item.title;
  lightboxCategory.textContent = item.category;
  lightboxTitle.textContent = item.title;
  lightboxDescription.textContent = item.description;
  favoriteBtn.classList.toggle('favorited', favorites.has(item.image));
  favoriteBtn.textContent = favorites.has(item.image) ? 'Favorited' : 'Favorite';

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => favoriteBtn.focus(), 50);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showNext(step) {
  if (!state.filteredItems.length) {
    return;
  }
  openLightbox(state.currentIndex + step);
}

function toggleFavorite() {
  const current = state.filteredItems[state.currentIndex];
  if (!current) {
    return;
  }

  if (favorites.has(current.image)) {
    favorites.delete(current.image);
    favoriteBtn.classList.remove('favorited');
    favoriteBtn.textContent = 'Favorite';
  } else {
    favorites.add(current.image);
    favoriteBtn.classList.add('favorited');
    favoriteBtn.textContent = 'Favorited';
  }

  localStorage.setItem('luxe-favorites', JSON.stringify([...favorites]));
  favoriteBtn.classList.remove('shake');
  void favoriteBtn.offsetWidth;
  favoriteBtn.classList.add('shake');
}

async function downloadCurrentImage() {
  const current = state.filteredItems[state.currentIndex];
  if (!current) {
    return;
  }

  try {
    const response = await fetch(current.image, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${current.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    const fallback = document.createElement('a');
    fallback.href = current.image;
    fallback.target = '_blank';
    fallback.rel = 'noreferrer';
    fallback.click();
  }
}

function createParticles() {
  const particleCount = 22;
  particleField.innerHTML = '';
  for (let index = 0; index < particleCount; index += 1) {
    const dot = document.createElement('span');
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${8 + Math.random() * 10}s`;
    dot.style.animationDelay = `${Math.random() * 8}s`;
    dot.style.opacity = `${0.2 + Math.random() * 0.7}`;
    dot.style.transform = `scale(${0.6 + Math.random() * 1.8})`;
    particleField.appendChild(dot);
  }
}

function prepareRevealObserver() {
  if (scrollRevealObserver) {
    scrollRevealObserver.disconnect();
  }

  scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll('.reveal').forEach((el) => scrollRevealObserver.observe(el));
}

function applyParallax() {
  const parallaxElement = document.querySelector('[data-parallax]');
  if (!parallaxElement) {
    return;
  }

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.1;
    parallaxElement.style.transform = `translateY(${offset * -0.18}px) perspective(1200px) rotateY(-10deg) rotateX(4deg)`;
  }, { passive: true });
}

function bindEvents() {
  filtersEl.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) {
      return;
    }

    state.activeCategory = button.dataset.category;
    syncCategoryButtons();
    renderGallery();
  });

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderGallery();
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '◑' : '◐';
  });

  galleryGrid.addEventListener('click', (event) => {
    const item = event.target.closest('.gallery-item');
    if (!item) {
      return;
    }
    openLightbox(Number(item.dataset.index));
  });

  galleryGrid.addEventListener('keydown', (event) => {
    const item = event.target.closest('.gallery-item');
    if (!item) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(Number(item.dataset.index));
    }
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-lightbox]')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', () => showNext(-1));
  nextBtn.addEventListener('click', () => showNext(1));
  favoriteBtn.addEventListener('click', toggleFavorite);
  downloadBtn.addEventListener('click', downloadCurrentImage);

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showNext(-1);
    } else if (event.key === 'ArrowRight') {
      showNext(1);
    }
  });
}

function restoreTheme() {
  const savedTheme = localStorage.getItem('luxe-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '◑';
  }
}

function persistTheme() {
  const observer = new MutationObserver(() => {
    localStorage.setItem('luxe-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

function init() {
  restoreTheme();
  buildFilters();
  createParticles();
  renderGallery();
  syncCategoryButtons();
  bindEvents();
  applyParallax();
  prepareRevealObserver();
  persistTheme();

  window.addEventListener('load', () => {
    loader.classList.add('hidden');
  });
}

init();
