document.addEventListener('DOMContentLoaded', function() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var monthTag = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function drawHeader(day, month, year) {
        var headDay = document.querySelector('.head-day');
        var headMonth = document.querySelector('.head-month');
        headDay.innerHTML = day;
        headMonth.innerHTML = monthTag[month] + " - " + year;
    }

    function drawDays(year, month, selectedDay = null) {
        var startDay = new Date(year, month, 1).getDay();
        var nDays = new Date(year, month + 1, 0).getDate();
        var n = startDay;
        var days = document.querySelectorAll('#calendar td');

        for (var k = 0; k < days.length; k++) {
            days[k].innerHTML = '';
            days[k].id = '';
            days[k].className = 'date-cell';
        }

        for (var i = 1; i <= nDays; i++) {
            days[n].innerHTML = i;
            days[n].addEventListener('click', function() {
                selectDate(this, year, month);
            });
            n++;
        }

        for (var j = 0; j < days.length; j++) {
            if (days[j].innerHTML == "") {
                days[j].id = "disabled";
            } else if (selectedDay && days[j].innerHTML == selectedDay.toString()) {
                days[j].id = "selected";
                days[j].className = "selected";
            } else if (!selectedDay && j === day + startDay - 1) {
                days[j].id = "today";
                days[j].className = "selected";
            }
        }
    }

    function showToday() {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate();
        drawHeader(day, month, year);
        drawDays(year, month, day);
    }

    function selectDate(cell, year, month) {
        var selectedDay = cell.innerHTML;
        drawHeader(selectedDay, month, year);
        drawDays(year, month, selectedDay);
    }

    document.getElementById('reset').addEventListener('click', showToday);

    // Initially show today's date when the calendar loads
    showToday();
}, false);
