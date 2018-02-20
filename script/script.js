var map;
        var markers=[];
        var largeInfowindow;
        var init_data=[
        {title:'Werwera, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.489063,lng:31.180079}},
        {title:'Management Building, Al Hezb Al Watani, Qism Banha, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.4659929,lng:31.18483070000002}},
        {title:'El-Moalemin, Qism Banha, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.444419,lng:31.172204}},
        {title:'Wabour Al Talg, Qism Banha, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.440349,lng:31.172204}},
        {title:'El-Moatasem, Qism Banha, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.445325,lng:31.16964}},
        {title:'Wabour Al Talg, Qism Banha, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.440747,lng:31.171657}},
        {title:'El-Salam Mosque, AR Ramlah, Banha, Al Qalyubia Governorate, Egypt',location:{lat:30.440249,lng:31.168715}},
        ];
//to get the location
        var Loction=function(data){
        this.title=ko.observable(data.title);
        this.location=ko.observable(data.location);
        this.marker=data.marker;
        };

        var init=function(){
        // Constructor creates a new map - only center and zoom are required.
        map=new google.maps.Map(document.getElementById('map'),{
        center:{lat:40.7413549,lng:-73.9980244},
        zoom:10


            });

        largeInfowindow=new google.maps.InfoWindow();
        largeInfowindow=new google.maps.InfoWindow();

        // The following group uses the location array to create an array of markers on initialize.
        for(var i=0;i<init_data.length;i++){
        // Get the position from the location array.
        var position=init_data[i].location;
        var title=init_data[i].title;
        // Create a marker per location, and put into markers array.
        var marker=new google.maps.Marker({
        position:position,
        title:title,
        animation:google.maps.Animation.DROP,
        id:i
        }
        );
        // Push the marker to our array of markers.
        markers.push(marker);
        init_data[i].marker=marker;
        marker.addListener('click', openInfoWindow);
        document.getElementById('show-listings').addEventListener('click',showListings);
        document.getElementById('hide-listings').addEventListener('click',hideListings);
        }
        showListings();
        ko.applyBindings(new ViewModel());

        };
        function openInfoWindow(){
            populateInfoWindow(this, largeInfowindow);
        }

        function animation(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
        marker.setAnimation(null);
        },700);

        }


// This function will loop through the markers array and display them all.
        function showListings(){
        var bounds=new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for(var i=0;i<markers.length;i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
        }

// This function will loop through the listings and hide them all.
        function hideListings(){
        for(var i=0;i<markers.length;i++){
        markers[i].setMap(null);
        }
        }

        function populateInfoWindow(marker,infowindow){
        // Check to make sure the infowindow is not already opened on this marker.
        if(infowindow.marker!=marker){
        infowindow.marker=marker;
        // get wiki  api url 
        var wikiUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';
        $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        jsonp:"callback",})
        .done(function(response){
        var article=response[1][0];
        url=('http://en.wikipedia.org/wiki/'+article);
        // put data
        infowindow.setContent('<br><div> <a href="'+url+'">'+marker.title+'</a></div>');
        infowindow.open(map,marker);

        })
        .fail(function(){
        // put data
        infowindow.setContent('<br><div> N0 Data For this Location</div>');
        infowindow.open(map,marker);

        });


        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        infowindow.marker=null;
        });
        }
        }


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
        function makeMarkerIcon(markerColor){
        var markerImage=new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+
        '|40|_|%E2%80%A2',
        new google.maps.Size(21,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34),
        new google.maps.Size(21,34));
        return markerImage;
        }

        var ViewModel=function(){
        // Constructor creates a new map - only center and zoom are required.
        var self=this;
        this.visibleFilter=ko.observable(false);
        this.clickFilter=function(){
        self.visibleFilter(!self.visibleFilter());
        };
        this.filter_data=function(){
        // refresh data          
        self.locations.removeAll();
        showListings();

        if(self.filter()){
        // if the user intered data in the input field , loop through the data
        for(var i=0;i<init_data.length;i++){

        // remove marker from map if not match
        if(!init_data[i].title.toLowerCase().includes(this.filter().toLowerCase())){
        init_data[i].marker.setMap(null);
        }
        else{
        // add to the list 
        self.locations.push(new Loction(init_data[i]));
        }
        }
        }
        else{ // if there are no filter put the entire init_data
        ko_data(self.locations);
        }

        };
        this.filter=ko.observable();
        this.locations=ko.observableArray([]);
        ko_data(this.locations);

        // when click in name in the list open info window
        this.get_info_window=function(){
        populateInfoWindow(this.marker,largeInfowindow);
        animation(this.marker);
        };
        };


// enter the init_data to empty observableArray
        function ko_data(ko_locations){
        ko_locations.removeAll();
        init_data.forEach(function(location){
        ko_locations.push(new Loction(location));
        });
        }
