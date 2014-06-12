//globally redirect to our rest api
$.ajaxPrefilter( function(options, originalOptions, jqXHR){
    options.url = "http://bartnowapi.azurewebsites.net/api" + options.url;
});

(function () {
    "use strict";

    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

//MODELS
    var Station = Backbone.Model.extend({
        urlRoot: '/stations'
    });
    var Stations = Backbone.Collection.extend({
        url: '/stations'
    });

//VIEWS
    var HomeView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var that = this;
            
            var HomePage = WinJS.UI.Pages.get('/pages/home/home.html');

            //Load up stations from server

            var stations = new Stations();

            stations.fetch({
                success: function(){

                    for(var i in stations.models){
                        //our view model requires at least 2 estimations with formatted arrivals.
                        //0 to 3 blank entries
                        if(stations.models[i].attributes.etd){
                            var blankCount = 3 - stations.models[i].attributes.etd.length;
                            for(var z = 0; z < blankCount; z++){

                                stations.models[i].attributes.etd.push({
                                    formattedArrivals: ""
                                });
                            }
                        }
                        else{
                            stations.models[i].attributes.etd = [];
                            for(var z = 0; z < 3; z++){
                                stations.models[i].attributes.etd.push({
                                    formattedArrivals: ""
                                });
                            }
                        }
                    }
                    
                    that.$el[0].innerHTML ="";
                    var hp = new HomePage(that.el, stations);
                    hp.element.style.width = "100%";
                    hp.element.style.height = "100%";
                    
                }
            });
            
            

            return this;
        }
    });

var StationView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var that = this;
            
            var StationPage = WinJS.UI.Pages.get('/pages/station/station.html');

            //Load up stations from server

            var station = new Station({
                id: this.id
            });

            station.fetch({
                success: function(){

                    //show pivot view for this station
                    that.$el[0].innerHTML ="";
                    var hp = new StationPage(that.el, station);
                    hp.element.style.width = "100%";
                    hp.element.style.height = "100%";
                }
            });
            
            

            return this;
        }
    });

//END VIEWS 

//ROUTES
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'station/:id': 'station'
        }
    });

    var router = new AppRouter();

    router.on('route:home', function(){
        console.log('Home route hit');
        var home_view = new HomeView({ el: $("#contenthost") });
    });

    router.on('route:station', function(id){
        console.log('Station route hit');
        var home_view = new StationView({ el: $("#contenthost"), id: id });
    });

//END ROUTES

    app.addEventListener("ready", function (args) {
        ui.processAll().then(function() {

            //show navbar
            var navBar = document.getElementById('navBar').winControl;
            navBar.show();

            //register the navbar show button
            $("#toggleNavBar").click(function(evt){
                navBar.show();
            });

        }).then(function(){
            return sched.requestDrain(sched.Priority.aboveNormal + 1);
        }).then(function(){
            ui.enableAnimations();

            Backbone.history.start();
        });
    });



    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();

})();
