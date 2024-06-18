// Calendar initialization and setup
(function($) {
    "use strict";

    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        monthTag = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        day = today.getDate(),
        days = document.getElementsByTagName('td'),
        selectedDay,
        setDate,
        daysLen = days.length;

    function Calendar(selector, options) {
        this.options = options;
        this.draw();
    }

    Calendar.prototype.draw = function() {
        this.getCookie('selected_day');
        this.getOptions();
        this.drawDays();
        var that = this,
            reset = document.getElementById('reset'),
            pre = document.getElementsByClassName('pre-button'),
            next = document.getElementsByClassName('next-button');

        pre[0].addEventListener('click', function() { that.preMonth(); });
        next[0].addEventListener('click', function() { that.nextMonth(); });
        reset.addEventListener('click', function() { that.reset(); });

        // Ensure the "Today" button click is bound correctly
        $('#reset').on('click', function() {
            calendar.reset();
        });

        while (daysLen--) {
            days[daysLen].addEventListener('click', function() { that.clickDay(this); });
        }
    };

    Calendar.prototype.drawHeader = function(e) {
        var headDay = document.getElementsByClassName('head-day')[0],
            headMonth = document.getElementsByClassName('head-month')[0];

        if (e) {
            headDay.innerHTML = e;
        } else {
            headDay.innerHTML = day;
        }
        headMonth.innerHTML = monthTag[month] + " - " + year;
    };

    Calendar.prototype.drawDays = function() {
        var startDay = new Date(year, month, 1).getDay(),
            nDays = new Date(year, month + 1, 0).getDate(),
            n = startDay;
    
        for (var k = 0; k < 42; k++) {
            days[k].innerHTML = '';
            days[k].id = '';
            days[k].className = '';
        }
    
        for (var i = 1; i <= nDays; i++) {
            days[n].innerHTML = i;
            n++;
        }
    
        for (var j = 0; j < 42; j++) {
            if (days[j].innerHTML === "") {
                days[j].id = "disabled";
            } else {
                days[j].id = "";  // Reset id to ensure no leftover "today" class
            }
    
            // Mark today's date
            if (year === today.getFullYear() && month === today.getMonth() && days[j].innerHTML == day) {
                days[j].id = "today";
            }
    
            // Mark selected date if exists
            if (selectedDay && year === selectedDay.getFullYear() && month === selectedDay.getMonth() && days[j].innerHTML == selectedDay.getDate()) {
                days[j].className = "selected";
            }
        }
    };
    

    Calendar.prototype.clickDay = function(o) {
        var selected = document.getElementsByClassName("selected"),
            len = selected.length;
        if (len !== 0) {
            selected[0].className = "";
        }
        o.className = "selected";
        selectedDay = new Date(year, month, o.innerHTML);
        this.drawHeader(o.innerHTML);
        this.setCookie('selected_day', 1);
    };

    Calendar.prototype.preMonth = function() {
        if (month < 1) {
            month = 11;
            year = year - 1;
        } else {
            month = month - 1;
        }
        this.drawHeader(1);
        this.drawDays();
    };

    Calendar.prototype.nextMonth = function() {
        if (month >= 11) {
            month = 0;
            year = year + 1;
        } else {
            month = month + 1;
        }
        this.drawHeader(1);
        this.drawDays();
    };

    Calendar.prototype.getOptions = function() {
        if (this.options) {
            var sets = this.options.split('-');
            setDate = new Date(sets[0], sets[1] - 1, sets[2]);
            day = setDate.getDate();
            year = setDate.getFullYear();
            month = setDate.getMonth();
        }
    };

    Calendar.prototype.reset = function() {
        today = new Date();  // Update today's date
        year = today.getFullYear();
        month = today.getMonth();
        day = today.getDate();
        this.options = undefined;
        this.drawHeader(day);
        this.drawDays();
    };

    Calendar.prototype.setCookie = function(name, expiredays) {
        if (expiredays) {
            var date = new Date();
            date.setTime(date.getTime() + (expiredays * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + selectedDay + expires + "; path=/";
    };

    Calendar.prototype.getCookie = function(name) {
        if (document.cookie.length) {
            var arrCookie = document.cookie.split(';'),
                nameEQ = name + "=";
            for (var i = 0, cLen = arrCookie.length; i < cLen; i++) {
                var c = arrCookie[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    selectedDay = new Date(c.substring(nameEQ.length, c.length));
                }
            }
        }
    };

    var calendar = new Calendar();

})(jQuery);
