// Use createMap function
function createMap(earthquakes) {
  
    // Create the base layers  
    var standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var satalite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps
    var baseMaps = {
      "Standard Map": standard,
      "Satalite Map": satalite
    };
  
    // Create an overlay object to hold our overlay
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map, giving it the streetmap and earthquakes layers to display
    var myMap = L.map("map", {
        center: [39.5, -98.5],
        zoom: 3,
      layers: [standard, earthquakes]
    });

    // Create a layer control, pass in baseMaps and overlayMaps then add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  };

// Store API as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the URL
d3.json(url).then(function (data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
  });

// Marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 3;
};

// Set marker colours based on depth
function chooseColour(depth) {
  if (depth < 10) return "#98ee00";
  else if (depth < 30) return "#d4ee00";
  else if (depth < 50) return "#eecc00";
  else if (depth < 70) return "#ee9c00";
  else if (depth < 90) return "#ea822c";
  else return "#ea2c2c";
}

// Add legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [-10, 10, 30, 50, 70, 90];
        title = "<h2>Depth of Earthquake"
        
    // Loop through density intervals and generate a label
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColour(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(myMap);

 // Features for the map 
  function createFeatures(earthquakeData) {

    // Define a function that will run once for each feature in the features array and gives a popup description of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    // Create a GeoJSON layer that contains the features array
      var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,   
      
      // Marker options
      pointToLayer: function(feature, latlng) {
        var markerOptions = {
          radius: markerSize(feature.properties.mag),
          color: chooseColour(feature.geometry.coordinates[2]),
          fillOpacity: 0.5,
          stroke: true,
          weight: 2.25,
        } 
      
        return L.circleMarker(latlng, markerOptions);
      }
    });
  
    // Send earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  