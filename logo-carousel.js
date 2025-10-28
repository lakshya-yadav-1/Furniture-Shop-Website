// Logo carousel with start-stop animation and drag functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.logo-carousel');
    const carouselContainer = document.querySelector('.logo-carousel-container');
    let currentPosition = 0;
    const logoWidth = 250; // 230px + 20px gap
    const totalLogos = 8;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let initialTransform = 0;
    
    // Use existing dots from HTML
    const dots = document.querySelectorAll('.dot');
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
        });
    }
    
    function goToSlide(index) {
        currentPosition = index;
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${currentPosition * logoWidth}px)`;
        updateDots();
        
        setTimeout(() => {
            carousel.style.transition = 'none';
        }, 5000);
    }
    
    function moveCarousel() {
        currentPosition++;
        
        // Apply smooth transition
        carousel.style.transition = 'transform 2s ease-in-out';
        carousel.style.transform = `translateX(-${currentPosition * logoWidth}px)`;
        
        // If reached the duplicate section, reset to beginning without transition
        if (currentPosition >= totalLogos) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentPosition = 0;
                carousel.style.transform = `translateX(0px)`;
                updateDots();
            }, 2000);
        } else {
            updateDots();
        }
        
        setTimeout(() => {
            carousel.style.transition = 'none';
        }, 2000);
    }
    
    // Simple click and drag functionality
    carousel.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        initialTransform = currentPosition * logoWidth;
        carousel.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const diffX = startX - currentX;
        const newTransform = initialTransform + diffX;
        
        carousel.style.transform = `translateX(-${newTransform}px)`;
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.style.cursor = 'default';
        
        const diffX = startX - currentX;
        const draggedDistance = initialTransform + diffX;
        
        // Calculate nearest logo position with infinite loop
        const nearestPosition = Math.round(draggedDistance / logoWidth);
        
        if (nearestPosition < 0) {
            currentPosition = totalLogos - 1;
        } else if (nearestPosition >= totalLogos) {
            currentPosition = 0;
        } else {
            currentPosition = nearestPosition;
        }
        
        // Snap to nearest position
        carousel.style.transition = 'transform 0.3s ease-out';
        carousel.style.transform = `translateX(-${currentPosition * logoWidth}px)`;
        updateDots();
        
        setTimeout(() => {
            carousel.style.transition = 'none';
        }, 5000);
    });
    
    // Start the carousel
    function startCarousel() {
        moveCarousel();
        
        // Set interval: 2s animation + 3s pause = 5s total
        setInterval(moveCarousel, 5000);
    }
    
    // Start after initial 5 second pause
    setTimeout(startCarousel, 5000);
});