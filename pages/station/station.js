(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    

    window.Stations = new WinJS.Binding.List([]);
    
    WinJS.UI.Pages.define("/pages/station/station.html", {
        ready:function(element, station){
            var pivot = $("#pivotScenario3")[0].winControl;
            pivot.title = station.attributes.name;

            for(var z in station.attributes.etd){
                if(!station.attributes.etd[z].estimate){
                    station.attributes.etd.estimate = [];
                }

                if(station.attributes.etd[z].estimate.length < 3){
                    var len = station.attributes.etd[z].estimate.length;
                    for(var i = 0; i < 3 - len; i++){

                        station.attributes.etd[z].estimate.push({
                            minutes: "",
                            color: "BLACK" 
                        });
                        
                    }
                }
            }
            

            var stationData = new WinJS.Binding.List(station.attributes.etd);
            window.StationName = station.attributes.name;
            WinJS.Namespace.define('BartNow.Station', {
                stationData : stationData,
                name : station.attributes.name
            });
        }
    });

    
})();
