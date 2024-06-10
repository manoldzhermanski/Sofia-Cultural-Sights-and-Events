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
            .bindPopup(point.gallery); // Assuming your table has a 'name' column
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
            .bindPopup(point.theatre); // Assuming your table has a 'name' column
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
            .bindPopup(point.museum); // Assuming your table has a 'name' column
        museumLayer.addLayer(marker);
    });
    museumLayer.addTo(map); // Add museumLayer to the map after loading
});

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
