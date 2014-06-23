bartnow-winjs
=============

BartNOW is a simple WinJS app to help you find your next BART train in the San Francisco Bay area. Frameworks used are WinJS and Backbonejs. You can find the live app at http://bartnow.azurewebsites.net

#What is this?

BartNOW demonstrates using WinJS to create a practical application using the WinJS framework with Backbone's MVC features.

#How does it all come together?

Each page is a composed of static HTML, CSS and Javascript. Navigation, models and views are defined in index.js. Using WinJS for
its UI components and data binding, we can host all the pages within index.html by rendering our html in a single div.

#Setup

Not much to do! Simply host the root folder (containing index.html) on a static website and the app will do the rest by calling the custom BartNOW apis.

#Features to be added

-Favorite Stations
-Cordova Integration
-Push notifications for alerts
