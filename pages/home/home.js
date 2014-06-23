(function () {
    "use strict";

    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    var app = WinJS.Application;
    

    window.Stations = new WinJS.Binding.List([]);
    
    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready:function(element, stations){
            //$("#progress").show();
            for(var i in stations.models){
                var model = stations.models[i];
                window.Stations.push(stations.models[i]);
            }
            


            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: function(){

                    var map;

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
                        var model = stations.models[i];
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
                        var stationPin = new Microsoft.Maps.Pushpin(stationLoc, {infobox: pinInfobox, icon: '/images/bart-300x300.png'});
                        map.entities.push(pinInfobox);
                        map.entities.push(stationPin);
                    }
                } 
            });
            
            



            //add click handler to each list view tiem
            var thatStations = stations;
            var listView = $("#homePivotListView")[0];
            if(listView){
                listView.addEventListener("iteminvoked", function (evt) {
                var index = evt.detail.itemIndex;

                window .location = '#/station/' + thatStations.models[index].attributes.abbr;

                });
            }
        }
    });

    
})();
