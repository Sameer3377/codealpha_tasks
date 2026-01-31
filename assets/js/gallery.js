// Sample image data with categories
const images = [
    {
        id: 1,
        url: 'assets/images/nature1.jpg',
        title: 'Mountain Vista',
        description: 'Stunning mountain landscape at sunset',
        category: 'nature'
    },
    {
        id: 2,
        url: 'assets/images/city1.jpg',
        title: 'City Lights',
        description: 'Urban skyline at night',
        category: 'city'
    },
    {
        id: 3,
        url: 'assets/images/people1.jpg',
        title: 'Profile Portrait',
        description: 'Professional headshot photography',
        category: 'people'
    },
    {
        id: 4,
        url: 'assets/images/abstract1.jpg',
        title: 'Abstract Art',
        description: 'Colorful abstract composition',
        category: 'abstract'
    },
    {
        id: 5,
        url: 'assets/images/nature2.jpg',
        title: 'Forest Path',
        description: 'Peaceful woodland trail',
        category: 'nature'
    },
    {
        id: 6,
        url: 'assets/images/city2.jpg',
        title: 'Metropolitan',
        description: 'Modern architecture downtown',
        category: 'city'
    },
    {
        id: 7,
        url: 'assets/images/people2.jpg',
        title: 'Business Woman',
        description: 'Professional business portrait',
        category: 'people'
    },
    {
        id: 8,
        url: 'assets/images/abstract2.jpg',
        title: 'Color Waves',
        description: 'Abstract color patterns',
        category: 'abstract'
    },
    {
        id: 9,
        url: 'assets/images/nature3.jpg',
        title: 'Lake Reflection',
        description: 'Serene lake with mountain reflection',
        category: 'nature'
    },
    {
        id: 10,
        url: 'assets/images/city3.jpg',
        title: 'Urban Street',
        description: 'Bustling city street scene',
        category: 'city'
    },
    {
        id: 11,
        url: 'assets/images/people3.jpg',
        title: 'Man Portrait',
        description: 'Casual lifestyle portrait',
        category: 'people'
    },
    {
        id: 12,
        url: 'assets/images/abstract3.jpg',
        title: 'Geometric Art',
        description: 'Modern geometric abstract',
        category: 'abstract'
    }
];

let currentImageIndex = 0;
let filteredImages = [...images];
let currentGalleryPage = 1;
const imagesPerPage = 8;

// Initialize gallery
function initGallery() {
    renderGallery(images);
    updateGalleryPagination();
}

// Render gallery based on filter
function renderGallery(imagesToShow) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentGalleryPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const paginatedImages = imagesToShow.slice(startIndex, endIndex);
    
    paginatedImages.forEach((image, paginatedIndex) => {
        const actualIndex = startIndex + paginatedIndex;
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', image.category);
        galleryItem.onclick = () => openLightbox(actualIndex, imagesToShow);
        
        galleryItem.innerHTML = `
            <img src="${image.url}" alt="${image.title}">
            <div class="gallery-item-overlay">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        `;
        
        gallery.appendChild(galleryItem);
    });
    
    updateGalleryPagination();
}

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter images
        const filter = button.getAttribute('data-filter');
        if (filter === 'all') {
            filteredImages = [...images];
        } else {
            filteredImages = images.filter(img => img.category === filter);
        }
        
        currentGalleryPage = 1; // Reset to first page on filter change
        renderGallery(filteredImages);
    });
});

// Gallery pagination functions
function changeGalleryPage(direction) {
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    currentGalleryPage += direction;
    
    if (currentGalleryPage < 1) currentGalleryPage = 1;
    if (currentGalleryPage > totalPages) currentGalleryPage = totalPages;
    
    renderGallery(filteredImages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateGalleryPagination() {
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    const pageInfo = document.getElementById('galleryPageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentGalleryPage} of ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentGalleryPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentGalleryPage === totalPages;
    }
}

// Lightbox functionality
function openLightbox(index, imageArray) {
    filteredImages = imageArray;
    currentImageIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = filteredImages.length - 1;
    } else if (currentImageIndex >= filteredImages.length) {
        currentImageIndex = 0;
    }
    
    updateLightboxImage();
}

function updateLightboxImage() {
    const image = filteredImages[currentImageIndex];
    document.getElementById('lightbox-img').src = image.url;
    document.getElementById('lightbox-title').textContent = image.title;
    document.getElementById('lightbox-desc').textContent = image.description;
    updatePagination();
}

// Update pagination
function updatePagination() {
    const paginationDots = document.getElementById('paginationDots');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    // Update page info text
    pageInfo.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;
    
    // Update dots
    paginationDots.innerHTML = '';
    
    // Show dots only if there are less than 10 images
    if (filteredImages.length <= 10) {
        filteredImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            if (index === currentImageIndex) {
                dot.classList.add('active');
            }
            dot.onclick = () => {
                currentImageIndex = index;
                updateLightboxImage();
            };
            paginationDots.appendChild(dot);
        });
    }
    
    // Disable buttons at boundaries
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === filteredImages.length - 1;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// Close lightbox when clicking outside image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Initialize on load
initGallery();
