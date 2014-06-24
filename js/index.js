//globally redirect to our rest api
$.ajaxPrefilter( function(options, originalOptions, jqXHR){
    options.url = "http://bartnowapi.azurewebsites.net/api" + options.url;
});
var g_Location;
(function () {
    "use strict";
    var currentLocation = "/#";
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

//MODELS

    //A Single station
    var Station = Backbone.Model.extend({
        urlRoot: '/stations'
    });

    //A collection of stations
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
                data: g_Location,
                success: function(){
                    
                    $("#progressSymbol").hide();
                }
            });
            
            that.$el[0].innerHTML ="";
            var hp = new HomePage(that.el, stations);
            hp.element.style.width = "100%";
            hp.element.style.height = "100%";

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
                    $("#progressSymbol").hide();
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
        $("#progressSymbol").show();
        currentLocation = "/#";
        var home_view = new HomeView({ el: $("#contenthost") });
    });

    router.on('route:station', function(id){
        $("#progressSymbol").show();
        console.log('Station route hit');
        currentLocation = "/#/station/" + id;
        var home_view = new StationView({ el: $("#contenthost"), id: id });
    });

    app.addEventListener("ready", function (args) {

        //We need the current location of device.
        //if we can't do it the app will just alert
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){

                    g_Location = position.coords;

                    ui.processAll().then(function() {

                    //NAV BAR
                    var navBar = document.getElementById('navBar').winControl;

                    //register the navbar show button
                    $("#toggleNavBar").click(function(evt){
                        navBar.show();
                    });

                    $("#homeButton").click(function(evt){
                        window.location = '/#';
                    });

                    $("#refreshButton").click(function(evt){
                        window.location.assign(currentLocation);
                    });

                    }).then(function(){
                        return sched.requestDrain(sched.Priority.aboveNormal + 1);
                    }).then(function(){
                        ui.enableAnimations();

                        Backbone.history.start();
                    });
                }, function(error) {
                    alert(error);
                }
            );
        }
        else{
            alert('Could not get your location. BartNOW Requires your location to work');
        }
        
    });


    /**

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };
    
    **/
    app.start();

})();
