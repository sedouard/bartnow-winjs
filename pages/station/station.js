(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    

    window.Stations = new WinJS.Binding.List([]);
    
    WinJS.UI.Pages.define("/pages/station/station.html", {
        ready:function(element, station){
           
            var stationData = new WinJS.Binding.List([]);
            window.StationName = "";
            var data = {
                stationData : stationData,
                name : ""
            };

            WinJS.Namespace.define('BartNow.Station', data);
            
            station.on("change", function(model){
                var pivot = $("#pivotScenario3")[0].winControl;
                pivot.title = model.attributes.name;


                //TODO: Fix binding issue here
                for(var i in station.attributes.etd){
                    stationData.push(model.attributes.etd[i]);
                }

                window.StationName = model.attributes.name;
                data.name = model.attributes.name;
            });
            
        }
    });

    
})();
