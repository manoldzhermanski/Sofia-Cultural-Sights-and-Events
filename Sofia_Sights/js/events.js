$(document).ready(function(){
    // Use event delegation to bind click event to dynamically added date cells
    $(document).on('click', '.date-cell, .selected', function(){
        const selectedDate = $(this).text().trim(); // Get the date number
        const monthYear = $('.head-month').text().trim(); // Get the month and year
        
        fetchEvents(selectedDate, monthYear);
    });
});

function fetchEvents(selectedDate, monthYear) {
    const [month, year] = monthYear.split(' - ');
    const fullDate = `${year}-${getMonthNumber(month)}-${selectedDate.padStart(2, '0')}`;

    console.log('Full date:', fullDate);

    $.ajax({
        url: '/events',
        method: 'GET',
        data: { date: fullDate },
        success: function(response) {
            console.log('Events fetched:', response);
            populateCarousel(response.activeEvents);
        },
        error: function(err) {
            console.error('Error fetching events:', err);
            // Handle error scenario if needed
        }
    });
}

function getMonthNumber(monthName) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (months.indexOf(monthName) + 1).toString().padStart(2, '0');
}

function populateCarousel(events) {
    console.log('Populating carousel with events:', events);
    const carouselInner = $('.carousel-inner');
    carouselInner.empty(); // Clear any existing items

    const chunkSize = 8;
    const numOfChunks = Math.ceil(events.length / chunkSize);

    for (let i = 0; i < numOfChunks; i++) {
        const chunk = events.slice(i * chunkSize, (i + 1) * chunkSize);
        const isActive = i === 0 ? 'active' : '';

        // Generate the inner HTML for the carousel item
        let carouselItemContent = '';
        for (let j = 0; j < chunk.length; j++) {
            const event = chunk[j];
            const offsetClass = j % 4 === 0 && j >= 4 ? 'offset-md-2' : '';
            const imgSrc = event.img ? `data:image/jpeg;base64,${event.img}` : 'default-image.png';
            carouselItemContent += `
                <div class="col-md-2 ${offsetClass}">
                    <center>
                        <img src="${imgSrc}" class="cal-event-img">
                        <p>${event.event_name}</p>
                    </center>
                </div>
            `;
        }

        // Generate the full carousel item
        const carouselItem = $(`
            <div class="carousel-item ${isActive}">
                <div class="container-fluid">
                    <div class="row">
                        ${carouselItemContent}
                    </div>
                </div>
            </div>
        `);

        carouselInner.append(carouselItem);
    }
}
