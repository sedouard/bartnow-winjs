(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    

    window.Stations = new WinJS.Binding.List([]);
    
    WinJS.UI.Pages.define("/pages/station/station.html", {
        ready:function(element, station){
            
            var stationArray = [];

            var stationData = new WinJS.Binding.List(stationArray);
            window.StationName = "";
            var data = {
                stationData : stationData,
                name : ""
            };
            WinJS.Namespace.define('BartNow.Station', data);
            
            if(station.attributes.etd){
                for(var i in station.attributes.etd){

                    //TODO WinJS wants a binding function. I'm sure I'm doing this wrong, but things seem to work here
                    station.attributes.etd[i].bind = function(property){
                        return this[property];
                        
                    };

                    data.stationData.push(station.attributes.etd[i]);
                }
            }
            

            
            
            station.on("change", function(model){
                var pivot = $("#pivotScenario3")[0].winControl;
                pivot.title = model.attributes.name;

                for(var i in station.attributes.etd){

                    //TODO WinJS wants a binding function. I'm sure I'm doing this wrong, but things seem to work here
                    station.attributes.etd[i].bind = function(property){
                        return this[property];
                        
                    };

                    data.stationData.push(station.attributes.etd[i]);
                }

                window.StationName = model.attributes.name;
                data.name = model.attributes.name;
                //data.stationData = new WinJS.Binding.List([]);
            });
            
        }
    });

    
})();
