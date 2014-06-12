(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    

    window.Stations = new WinJS.Binding.List([]);
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready:function(element, stations){

            for(var i in stations.models){
                var model = stations.models[i];
                window.Stations.push(stations.models[i]);
            }
            var text = "http://stevenedouard.com/hello";
            var map;

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){

                    var currentLoc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);

                    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), 
                                {
                                    credentials:"AqKaHOhFANG1MfClHVrtzvqfb_IuYutvB6NgNcsgMW5Ee_EpPd3a5q-uOUt3Mr0m",
                                    center: currentLoc,
                                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                                    zoom: 14
                                }
                            );
                    
                    var myPin = new Microsoft.Maps.Pushpin(currentLoc);

                    map.entities.push(myPin);

                    
                    for(var i in stations.models){
                        var model = stations.models[i];
                        var stationLoc = new Microsoft.Maps.Location(model.attributes.latitude, model.attributes.longitude)
                        var stationPin = new Microsoft.Maps.Pushpin(stationLoc, {text: model.attributes.name});
                        map.entities.push(stationPin);
                    }

                    //go through each item on the list and add a click handler
                    var thatStations = stations;
                    var listView = $("#homePivotListView")[0];
                        if(listView){
                            console.log('HALLEJUAH!');
                            listView.addEventListener("iteminvoked", function (evt) {
                            var index = evt.detail.itemIndex;

                            window .location = '#/station/' + thatStations.models[index].attributes.abbr;

                        });
                    }

                }, function(error){
                    alert(error);
                });
            }       
            else{
                alert('Could not get get location data!');
                map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), 
                {credentials:"AqKaHOhFANG1MfClHVrtzvqfb_IuYutvB6NgNcsgMW5Ee_EpPd3a5q-uOUt3Mr0m"});
            }

            
            
        }
    });

    
})();
