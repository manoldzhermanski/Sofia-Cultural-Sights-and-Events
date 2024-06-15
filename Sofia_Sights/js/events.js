// Function to check if an event is active
function isEventActive(event) {
    const today = new Date();
    const startDate = new Date(event.starting_date);
    const endDate = new Date(event.ending_date);
    return today >= startDate && today <= endDate;
}

// Function to create a carousel item
function createCarouselItem(event, isActive) {
    const div = document.createElement('div');
    div.classList.add('carousel-item');
    if (isActive) {
        div.classList.add('active');
    }

    const container = document.createElement('div');
    container.classList.add('container-fluid');

    const row = document.createElement('div');
    row.classList.add('row');

    const col = document.createElement('div');
    col.classList.add('col-md-2', 'offset-md-2');

    const center = document.createElement('center');

    const img = document.createElement('img');
    img.src = event.img;
    img.classList.add('cal-event-img');

    const p = document.createElement('p');
    p.textContent = event.event_name;

    center.appendChild(img);
    center.appendChild(p);
    col.appendChild(center);
    row.appendChild(col);
    container.appendChild(row);
    div.appendChild(container);

    return div;
}

// Fetch the events and populate the carousel
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        const events = await response.json();

        const carouselContent = document.getElementById('carousel-content');

        events.forEach((event, index) => {
            if (isEventActive(event)) {
                const carouselItem = createCarouselItem(event, index === 0);
                carouselContent.appendChild(carouselItem);
            }
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Load events when the page is ready
document.addEventListener('DOMContentLoaded', loadEvents);
