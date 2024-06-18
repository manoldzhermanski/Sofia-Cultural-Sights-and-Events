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
    console.log(month);
    console.log(year);
    console.log(selectedDate);
    console.log(monthYear);
    const fullDate = `${year}-${getMonthNumber(month)}-${selectedDate.padStart(2, '0')}`;

    console.log('Full date:', fullDate);

    $.ajax({
        url: '/events',
        method: 'GET',
        data: { date: fullDate },
        success: function(response) {
            console.log('Events fetched:', response);
            populateCarousel(response.activeEvents);
            updateMapWithEvents(response.activeEvents)
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

    const chunkSize = 8; // 4 events per row, 2 rows per chunk
    const numOfChunks = Math.ceil(events.length / chunkSize);

    for (let i = 0; i < numOfChunks; i++) {
        const chunk = events.slice(i * chunkSize, (i + 1) * chunkSize);
        const isActive = i === 0 ? 'active' : '';
        
        let carouselItemContent = '';
        
        // Create two rows
        for (let row = 0; row < 2; row++) {
            let rowContent = '';
            for (let j = 0; j < 4; j++) {
                const eventIndex = row * 4 + j;
                const event = chunk[eventIndex];
                const offsetClass = j % 4 === 0 ? 'offset-md-2' : '';

                if (event) {
                    const imgSrc = event.img ? `data:image/jpeg;base64,${event.img}` : 'img/default-image.png';
                    rowContent += `
                        <div class="col-md-2 ${offsetClass}">
                            <center>
                                <img src="${imgSrc}" class="cal-event-img">
                                <p>${event.event_name}</p>
                            </center>
                        </div>
                    `;
                } else {
                    rowContent += `
                        <div class="col-md-2 ${offsetClass}">
                            <center>
                                <img src="img/default-image.png" class="cal-event-img">
                                <p>&nbsp;</p>
                            </center>
                        </div>
                    `;
                }
            }

            carouselItemContent += `
                <div class="row">
                    ${rowContent}
                </div>
            `;
        }

        // Generate the full carousel item
        const carouselItem = $(`
            <div class="carousel-item ${isActive}">
                <div class="container-fluid">
                    ${carouselItemContent}
                </div>
            </div>
        `);

        carouselInner.append(carouselItem);
    }
}

