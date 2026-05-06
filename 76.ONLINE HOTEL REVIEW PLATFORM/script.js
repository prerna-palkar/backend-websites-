let allHotels = [];
let currentHotelId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchHotels();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    const modal = document.getElementById('hotelModal');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const stars = document.querySelectorAll('.star');

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    searchInput.addEventListener('input', filterAndDisplayHotels);
    sortSelect.addEventListener('change', filterAndDisplayHotels);

    stars.forEach(star => {
        star.addEventListener('click', () => selectRating(parseInt(star.dataset.value)));
        star.addEventListener('mouseover', () => hoverRating(parseInt(star.dataset.value)));
    });

    document.addEventListener('mouseleave', () => {
        const activeRating = document.querySelectorAll('.star.active').length;
        updateStarDisplay(activeRating);
    });

    submitReviewBtn.addEventListener('click', submitReview);
}

// Fetch Hotels from Backend
function fetchHotels() {
    fetch('http://localhost:3000/api/hotels')
        .then(res => res.json())
        .then(data => {
            allHotels = data;
            displayHotels(allHotels);
        })
        .catch(err => {
            console.error('Error fetching hotels:', err);
            document.getElementById('hotelsContainer').innerHTML = '<div class="loading">Error loading hotels</div>';
        });
}

// Display Hotels
function displayHotels(hotels) {
    const container = document.getElementById('hotelsContainer');
    
    if (hotels.length === 0) {
        container.innerHTML = '<div class="loading">No hotels found</div>';
        return;
    }

    container.innerHTML = hotels.map(hotel => `
        <div class="hotel-card" onclick="openHotelModal(${hotel.id})">
            <div class="hotel-image">${hotel.image}</div>
            <div class="hotel-content">
                <h3 class="hotel-name">${hotel.name}</h3>
                <p class="hotel-location">📍 ${hotel.location}</p>
                <div class="hotel-info">
                    <span class="hotel-price">$${hotel.price}/night</span>
                    <span class="hotel-rating">⭐ ${hotel.rating}</span>
                </div>
                <p class="review-count">${hotel.reviews.length} reviews</p>
            </div>
        </div>
    `).join('');
}

// Filter and Sort Hotels
function filterAndDisplayHotels() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortSelect').value;

    let filtered = allHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchText) ||
        hotel.location.toLowerCase().includes(searchText)
    );

    if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayHotels(filtered);
}

// Open Hotel Modal
function openHotelModal(hotelId) {
    currentHotelId = hotelId;
    const hotel = allHotels.find(h => h.id === hotelId);

    if (!hotel) return;

    document.getElementById('modalHotelName').textContent = hotel.name;
    document.getElementById('modalHotelLocation').textContent = '📍 ' + hotel.location;
    document.getElementById('modalHotelPrice').textContent = '$' + hotel.price + ' per night';
    document.getElementById('modalHotelRating').innerHTML = `⭐ ${hotel.rating} <span style="color: #999; margin-left: 10px;">(${hotel.reviews.length} reviews)</span>`;

    // Display Reviews
    const reviewsList = document.getElementById('reviewsList');
    if (hotel.reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #999;">No reviews yet. Be the first to review!</p>';
    } else {
        reviewsList.innerHTML = hotel.reviews.map(review => 
            `<div class="review-item">💬 ${review}</div>`
        ).join('');
    }

    // Reset Review Form
    document.getElementById('reviewText').value = '';
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    document.getElementById('submitReviewBtn').dataset.rating = 0;

    document.getElementById('hotelModal').style.display = 'block';
}

// Star Rating Selection
function selectRating(rating) {
    document.getElementById('submitReviewBtn').dataset.rating = rating;
    updateStarDisplay(rating);
}

function hoverRating(rating) {
    updateStarDisplay(rating);
}

function updateStarDisplay(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit Review
function submitReview() {
    const reviewText = document.getElementById('reviewText').value.trim();
    const rating = parseInt(document.getElementById('submitReviewBtn').dataset.rating || 0);

    if (!reviewText) {
        alert('Please write a review');
        return;
    }

    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    const review = `${rating}⭐ - ${reviewText}`;

    fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelId: currentHotelId, review: review })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Review added successfully!');
            fetchHotels();
            openHotelModal(currentHotelId);
        } else {
            alert('Error adding review');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error adding review');
    });
}
