// Add console.log to check to see if our code is working.
console.log("yes your code is working");


// /////// ***** ADD GEOJSON DATA ******* //////////
// let sanFranAirport =
// {"type":"FeatureCollection", "features":[{
//     "type":"Feature",
//     "properties":{
//         "id":"3496",
//         "name":"San Francisco International Airport",
//         "city":"San Francisco",
//         "country":"United States",
//         "faa":"SFO",
//         "icao":"KSFO",
//         "alt":"13",
//         "tz-offset":"-8",
//         "dst":"A",
//         "tz":"America/Los_Angeles"},
//         "geometry":{
//             "type":"Point",
//             "coordinates":[-122.375,37.61899948120117]}}
// ]};


///////// ******* Grabbing our GeoJSON data ********** //////////
// L.geoJSON(sanFranAirport, {
// // turn each feature into a marker on the map
//     pointToLayer: function(feature, latlng) {
//         console.log(feature);
//         return L.marker(latlng)
//         .bindPopup("<h2>" + feature.properties.name + "</h2>")
//     }
// }).addTo(map);

///////// ******* Grabbing our GeoJSON data ********** //////////
// L.geoJSON(sanFranAirport, {
//     // turn each feature into a marker on the map
//         onEachFeature: function(feature, layer) {
//             console.log(layer);
//             layer.bindPopup();
//         }
//     }).addTo(map);


// // coordinates for each point to be used in the polyline
// let line = [
//     [33.9416, -118.4083],
//     [37.6213, -122.3790],
//     [40.7899, -111.9791],
//     [47.4502, -122.3088]
// ];

// // Create a polyline using the line coordinates and make the line red.
// L.polyline(line, {
//     color: "yellow"
// }).addTo(map);

// // Loop through the cities array and create one marker for each city.
// cities.forEach(function(city) {
//     console.log(city)
// });

// // Get data from cities.js
// let cityData = cities;


// // Loop through the cities array and create one marker for each city.
// cityData.forEach(function(city) {
//     console.log(city)
//     L.circleMarker(city.location, {
//         radius: city.population/100000,
//     })
//     .bindPopup("<h2>" + city.city + ", " + city.state + "</h> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
//     .addTo(map);
// });

// // circle marker ////
// L.circle([34.0522, -118.2437], {
//     radius: 300,
//     color: "black",
//     fillColor: '#ffffa1'
// }).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    // id: 'mapbox/satellite-streets-v11',
    // tileSize: 512,
    // zoomOffset: -1,
    accessToken: API_KEY
});
// Then we add our 'graymap' tile layer to the map.
// streets.addTo(map);


//////// ******* ADDING ANOTHER TILELAYER FOR DARK MAP ************** /////////
// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});


//////////// ********* BASEMAPS - create base layer that holds both maps ********** ///////////
let baseMaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
};


// Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

//// Create the earthquake layer for our map
let earthquakes = new L.layerGroup();

///// Define the object that contains the overlays
// This overlay will be visible at all times
let overlays = {
    Earthquakes: earthquakes
};

///// Create a legend control object 
let legend = L.control({position: "bottomright"});

///// Add all the details for the legend
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        const magnitudes = [0,1,2,3,4,5],
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ea822c",
            "#ea2c2c"
        ];


//////// Create a for loop - loop through our intervals to generate a label with a colored square 
    for (var i = 0; i <magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
            "<i style:'background: " + colors[i] + "'></i> " +
            magnitudes[i] + (magnitudes[i + 1] ? "&dash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};
legend.addTo(map);

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);



///////// ********** ACCESSING THE EARTHQUAKE GEOJSON URL ********** ////////
let earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//////// ********* CREATE A STYLE FOR THE LINES ********** ////////
// let myStyle = {
//     color: "#ffffa1",
//     weight: 2
// }



// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

/// This function determines the color of the circle based on the magnitude of the earthquake
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
    if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
}

//////// ********** GRABBING OUR GEOJSON DATA *********** ///////////
d3.json(earthquake).then(function(data) {
    console.log(data);
    // L.geoJSON(data).addTo(map);
    ///// create a geojson layer with the retrieved data ////////
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // set the style for each circle marker //
    style: styleInfo,
        // create a popup for each circleMarker to display the magnitude and location
        // of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);

        
    // })
    earthquakes.addTo(map);
});