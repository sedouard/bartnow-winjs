(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    var map;

    window.Stations = new WinJS.Binding.List([]);

    var addStationToMap = function(model){
        var stationLoc = new Microsoft.Maps.Location(model.attributes.latitude, model.attributes.longitude)
        
        var descriptionString = "";

        if(model.attributes.etd[0].formattedArrivals){
            descriptionString += model.attributes.etd[0].formattedArrivals;
        }

        if(model.attributes.etd[1].formattedArrivals){
            descriptionString += '\n' + model.attributes.etd[1].formattedArrivals;
        }

        if(model.attributes.etd[2].formattedArrivals){
            descriptionString += '\n' + model.attributes.etd[2].formattedArrivals;
        }

        var infoOptions = {
            title:model.attributes.name,
            width: 200, 
            height:100,
            description: descriptionString
        };
        var pinInfobox = new Microsoft.Maps.Infobox(stationLoc, infoOptions);
        var stationPin = new Microsoft.Maps.Pushpin(stationLoc, {infobox: pinInfobox, icon: '/images/bartIcon20x20.png',  width: 20, height: 20});
        map.entities.push(pinInfobox);
        map.entities.push(stationPin);
    }

    var addStationToList = function(model){
        //our view model requires at least 2 estimations with formatted arrivals.
        //0 to 3 blank entries


        if(model.attributes.etd){
            var blankCount = 3 - model.attributes.etd.length;
            for(var z = 0; z < blankCount; z++){

                model.attributes.etd.push({
                    formattedArrivals: ""
                });
            }
        }
        else{
            model.attributes.etd = [];
            for(var z = 0; z < 3; z++){
                model.attributes.etd.push({
                    formattedArrivals: ""
                });
            }
        }
        window.Stations.push(model);
    }
    WinJS.UI.Pages.define("/pages/home/home.html", {
        init: function(){
            
        },
        ready:function(element, stations){

            if(window.Stations){
                window.Stations.forEach(function(){
                    window.Stations.pop();
                });
            }
            for(var i in stations.models){
                addStationToList(stations.models[i]);
            }

            //add click handler to each list view tiem
            var thatStations = stations;
            var listView = $("#homePivotListView")[0];
            if(listView){
                listView.addEventListener("iteminvoked", function (evt) {
                var index = evt.detail.itemIndex;

                window .location = '#/station/' + thatStations.models[index].attributes.abbr;

                });
            }

            

            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: function(){     

                    var currentLoc = new Microsoft.Maps.Location(g_Location.latitude, g_Location.longitude);

                    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), 
                                {
                                    credentials:"AqKaHOhFANG1MfClHVrtzvqfb_IuYutvB6NgNcsgMW5Ee_EpPd3a5q-uOUt3Mr0m",
                                    center: currentLoc,
                                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                                    theme: new Microsoft.Maps.Themes.BingTheme(),
                                    zoom: 14
                                }
                            );
                    
                    var myPin = new Microsoft.Maps.Pushpin(currentLoc);

                    map.entities.push(myPin);

                    for(var i in stations.models){
                        addStationToMap(stations.models[i]);
                    }
                }
            });
        
            stations.on("add", function(model){

                
                addStationToList(model);
                addStationToMap(model);
                        


                
            });

            
        }
    });

    
})();
