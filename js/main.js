var tradeWindows = [
    {
        "day": [1,3,5],
        "dayEn": "Mon, Wed, Fri",
        "start_time": 9,
        "end_time": 18,
        "timeEn": "09:00-18:00"
    },
    {
        "day": [2],
        "dayEn": "Tue",
        "start_time": 12,
        "end_time": 18,
        "timeEn": "12:00-18:00"
    }
]

var currencyH = [
    {
        "month": 8,
        "date": 16
    }
]

var countryH = [
    {
        "month": 8,
        "date": 20
    }
]

$(document).ready(function(){
    
    $('#hideBtn').on('click', function(){
        $('#settingsPanel').slideToggle();
        $(this).html($(this).text() == "Hide Settings" ? "Show Settings" : "Hide Settings");
    });
    
    $('.datetimepicker').datetimepicker({
        format: 'HH:mm'
    });
    
    $('.calendardatepicker').datetimepicker({
        format: 'MMM D, YYYY',
        date: new Date()
    });
    
   for (i = 0; i < tradeWindows.length; i++) {
       var ctw = tradeWindows[i];
       $('.tw-list').append("<a href='#' class='list-group-item'><div class='row'><div class='col-xs-6'><small>Day of Week</small><br><div>"+ ctw.dayEn + "</div></div><div class='col-xs-6'><small>Time of Day</small><br><div>"+ ctw.timeEn +"</div></div></div></a>")
   } 
    
    $('.modal .tw-list .list-group-item').first().addClass('active');
    
    var GetEvents = function(startDate) {
    
    var events = [];
    
    var sd = new Date(startDate);
    var sDay = sd.getDay();
    
    var currentID = 0;
    
    for (x = 0; x < 8; x++) {
        
        for (i = 0; i < tradeWindows.length; i++) { 
            var tw = tradeWindows[i];
            var d = tw.day;
            var st = tw.start_time;
            var et = tw.end_time;
            
            for (j = 0; j < d.length; j++) {
                
                var twD = d[j];
                var newStart = new Date(startDate + ((twD - sDay) + (7 * x)) * 24*60*60*1000);
                
                var newMonth =  newStart.getMonth();
                var newDate = newStart.getDate();

                var flag = false;
                
                for (m = 0; m < currencyH.length; m++) {
                    var cch = currencyH[m];
                    var currencyHM = cch.month;
                    var currencyHD = cch.date;
                    
                    if (newMonth == currencyHM && newDate == currencyHD) {
     
                        flag = true;
                        break;
                    }
                }
                
                
                for (n = 0; n < countryH.length; n++) {
                    var cch = countryH[n];
                    var countryHM = cch.month;
                    var countryHD = cch.date;
                    
                    if (newMonth == countryHM && newDate == countryHD) {
                        flag = true;
                        break;
                    }
                }
                
                if (flag == true) {
                    continue;
                }
                
                newStart.setHours(st);
                
                
                events.push({
                   "id": currentID,
                    "title": "Trading Window: " + st + ":00" + " - " + et + ":00",
                    "url": "#",
                    "class": "event-success",
                    "start": newStart.setHours(st),
                    "end": newStart.setHours(et)
                });
                
                currentID++;
            }
        }
    }
    
    for (i = 0; i < currencyH.length; i++) {
        var cch = currencyH[i];
        var nd = new Date();
        nd.setMonth(cch.month);
        nd.setDate(cch.date);
        events.push({
                   "id": currentID,
                    "title": "Currency Holiday",
                    "url": "#",
                    "class": "event-simple",
                    "start": nd.setHours(0),
                    "end": nd.setHours(23)
                });
    }
    
    for (i = 0; i < countryH.length; i++) {
        var cch = countryH[i];
        var nd = new Date();
        nd.setMonth(cch.month);
        nd.setDate(cch.date);
        events.push({
                   "id": currentID,
                    "title": "Country Holiday",
                    "url": "#",
                    "class": "event-simple",
                    "start": nd.setHours(0),
                    "end": nd.setHours(23)
                });
    }
    
    return events;
    

}

var calendar = $("#calendar").calendar(
            {
                tmpl_path: "/tmpls/",
                events_source: GetEvents(1472313600000),
                onAfterViewLoad: function(view) {
                    $('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		}
            }); 
calendar.setOptions({first_day: 1});
calendar.view();
    
    $('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});
    
    $('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});

});


