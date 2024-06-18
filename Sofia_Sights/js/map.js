// Initialize the map
var map = L.map('map').setView([42.6977, 23.3219], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom marker icons
var galleryIcon = L.icon({
    iconUrl: 'img/gallery-icon-4.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -37]
});

var theatreIcon = L.icon({
    iconUrl: 'img/theatre-icon.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -37]
});

var museumIcon = L.icon({
    iconUrl: 'img/museum-icon-2.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -37]
});

// Marker layers
var galleryLayer = L.layerGroup();
var theatreLayer = L.layerGroup();
var museumLayer = L.layerGroup();

// Load and add galleries
fetch('http://localhost:3000/galleries')
.then(response => response.json())
.then(data => {
    data.galleries.forEach(point => {
        var marker = L.marker([point.latitude, point.longitude], { icon: galleryIcon })
            .bindPopup(point.name); // Assuming your table has a 'name' column
        galleryLayer.addLayer(marker);
    });
    galleryLayer.addTo(map); // Add galleryLayer to the map after loading
});

// Load and add theatres
fetch('http://localhost:3000/theatres')
.then(response => response.json())
.then(data => {
    data.theatres.forEach(point => {
        var marker = L.marker([point.latitude, point.longitude], { icon: theatreIcon })
            .bindPopup(point.name); // Assuming your table has a 'name' column
        theatreLayer.addLayer(marker);
    });
    theatreLayer.addTo(map); // Add theatreLayer to the map after loading
});

// Load and add museums
fetch('http://localhost:3000/museums')
.then(response => response.json())
.then(data => {
    data.museums.forEach(point => {
        var marker = L.marker([point.latitude, point.longitude], { icon: museumIcon })
            .bindPopup(point.name); // Assuming your table has a 'name' column
        museumLayer.addLayer(marker);
    });
    museumLayer.addTo(map); // Add museumLayer to the map after loading
});

// Function to fetch and add markers for a specific host type
function fetchLocationDetails(event, icon, layer) {
    let url;
    let property;

    if (event.host_type === 'gallery') {
        url = `http://localhost:3000/galleries`;
        property = 'galleries';
    } else if (event.host_type === 'theatre') {
        url = `http://localhost:3000/theatres`;
        property = 'theatres';
    } else if (event.host_type === 'museum') {
        url = `http://localhost:3000/museums`;
        property = 'museums';
    }

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    let locations = data[property];
                    let location = locations.find(loc => loc.name === event.hosted_by || loc.name === event.hosted_by);
                    if (location) {
                        let marker = L.marker([location.latitude, location.longitude], { icon: icon })
                            .bindPopup(location.name);
                        layer.addLayer(marker);
                    }
                } else {
                    console.error(`Property ${property} not found in response data`);
                }
            })
            .catch(error => console.error('Error fetching location details:', error));
    }
}

// Function to update map markers based on events
function updateMapWithEvents(events) {
    // Clear existing layers
    galleryLayer.clearLayers();
    theatreLayer.clearLayers();
    museumLayer.clearLayers();

    // Process each event and fetch location details
    events.forEach(event => {
        if (event.host_type === 'gallery') {
            fetchLocationDetails(event, galleryIcon, galleryLayer);
        } else if (event.host_type === 'theatre') {
            fetchLocationDetails(event, theatreIcon, theatreLayer);
        } else if (event.host_type === 'museum') {
            fetchLocationDetails(event, museumIcon, museumLayer);
        }
    });

    // Show relevant layers on the map
    if (galleryLayer.getLayers().length > 0) map.addLayer(galleryLayer);
    if (theatreLayer.getLayers().length > 0) map.addLayer(theatreLayer);
    if (museumLayer.getLayers().length > 0) map.addLayer(museumLayer);

    // Fit map to markers
    setTimeout(() => {
        let allMarkers = L.featureGroup([...galleryLayer.getLayers(), ...theatreLayer.getLayers(), ...museumLayer.getLayers()]);
        if (allMarkers.getLayers().length > 0) {
            map.fitBounds(allMarkers.getBounds());
        }
    }, 500); // Add a delay to ensure all markers are added before fitting bounds
}
var currentLayer = null;

// Function to toggle marker visibility by category
function toggleMarkers(category) {
    var layer;
    if (category === 'gallery') {
        layer = galleryLayer;
    } else if (category === 'theatre') {
        layer = theatreLayer;
    } else if (category === 'museum') {
        layer = museumLayer;
    }

    if (currentLayer === layer) {
        showAllMarkers();
        currentLayer = null;
    } else {
        if (map.hasLayer(galleryLayer)) {
            map.removeLayer(galleryLayer);
        }
        if (map.hasLayer(theatreLayer)) {
            map.removeLayer(theatreLayer);
        }
        if (map.hasLayer(museumLayer)) {
            map.removeLayer(museumLayer);
        }
        map.addLayer(layer);
        currentLayer = layer;
    }
}

// Function to show all markers
function showAllMarkers() {
    if (!map.hasLayer(galleryLayer)) {
        map.addLayer(galleryLayer);
    }
    if (!map.hasLayer(theatreLayer)) {
        map.addLayer(theatreLayer);
    }
    if (!map.hasLayer(museumLayer)) {
        map.addLayer(museumLayer);
    }
    currentLayer = null;
}
