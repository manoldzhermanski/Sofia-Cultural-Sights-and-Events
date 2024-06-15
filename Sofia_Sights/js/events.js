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
            // Update your UI with the fetched events as needed
            // Example: Display events in a carousel or list
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
