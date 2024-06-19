// Initialize the map
var map = L.map('map').setView([42.6977, 23.3219], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
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

// Event marker layers for events on specific dates
var eventGalleryLayer = L.layerGroup();
var eventTheatreLayer = L.layerGroup();
var eventMuseumLayer = L.layerGroup();

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
                    let location = locations.find(loc => loc.name === event.hosted_by);
                    if (location) {
                        let marker = L.marker([location.latitude, location.longitude], { icon: icon })
                            .bindPopup(location.name);
                        layer.addLayer(marker);
                        layer.addTo(map);
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
    // Clear existing event layers
    eventGalleryLayer.clearLayers();
    eventTheatreLayer.clearLayers();
    eventMuseumLayer.clearLayers();
    galleryLayer.clearLayers();
    museumLayer.clearLayers();
    theatreLayer.clearLayers();

    // Process each event and fetch location details
    events.forEach(event => {
        if (event.host_type === 'gallery') {
            fetchLocationDetails(event, galleryIcon, eventGalleryLayer);
        } else if (event.host_type === 'theatre') {
            fetchLocationDetails(event, theatreIcon, eventTheatreLayer);
        } else if (event.host_type === 'museum') {
            fetchLocationDetails(event, museumIcon, eventMuseumLayer);
        }
    });

    // Show relevant event layers on the map
    if (eventGalleryLayer.getLayers().length > 0) map.addLayer(eventGalleryLayer);
    if (eventTheatreLayer.getLayers().length > 0) map.addLayer(eventTheatreLayer);
    if (eventMuseumLayer.getLayers().length > 0) map.addLayer(eventMuseumLayer);
/*
    // Fit map to markers
    setTimeout(() => {
        let allMarkers = L.featureGroup([...eventGalleryLayer.getLayers(), ...eventTheatreLayer.getLayers(), ...eventMuseumLayer.getLayers()]);
        if (allMarkers.getLayers().length > 0) {
            map.fitBounds(allMarkers.getBounds());
        }
    }, 200); // Add a delay to ensure all markers are added before fitting bounds*/
}

var currentLayer = null;

// Function to fetch and add markers for a specific category
function fetchCategoryMarkers(category) {
    let url;
    let icon;
    let layer;

    if (category === 'galleries') {
        url = `http://localhost:3000/galleries`;
        icon = galleryIcon;
        layer = galleryLayer;
    } else if (category === 'theatres') {
        url = `http://localhost:3000/theatres`;
        icon = theatreIcon;
        layer = theatreLayer;
    } else if (category === 'museums') {
        url = `http://localhost:3000/museums`;
        icon = museumIcon;
        layer = museumLayer;
    }

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                layer.clearLayers(); // Clear existing markers in the layer
                data[category].forEach(point => {
                    let marker = L.marker([point.latitude, point.longitude], { icon: icon })
                        .bindPopup(point.name);
                    layer.addLayer(marker);
                });
                if (!map.hasLayer(layer)) {
                    map.addLayer(layer);
                }
            })
            .catch(error => console.error('Error fetching category markers:', error));
    }
}

// Function to toggle marker visibility by category
function toggleMarkers(category) {
    // Remove event layers
    if (map.hasLayer(eventGalleryLayer)) {
        map.removeLayer(eventGalleryLayer);
    }
    if (map.hasLayer(eventTheatreLayer)) {
        map.removeLayer(eventTheatreLayer);
    }
    if (map.hasLayer(eventMuseumLayer)) {
        map.removeLayer(eventMuseumLayer);
    }

    let layer;
    if (category === 'galleries') {
        layer = galleryLayer;
    } else if (category === 'theatres') {
        layer = theatreLayer;
    } else if (category === 'museums') {
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
        fetchCategoryMarkers(category);
        currentLayer = layer;
    }
/*
    // Fit map to markers
    setTimeout(() => {
        let allMarkers = L.featureGroup([...galleryLayer.getLayers(), ...theatreLayer.getLayers(), ...museumLayer.getLayers()]);
        if (allMarkers.getLayers().length > 0) {
            map.fitBounds(allMarkers.getBounds());
        }
    }, 200); // Add a delay to ensure all markers are added before fitting bounds*/
}

// Function to show all markers
function showAllMarkers() {
    fetchCategoryMarkers('galleries');
    fetchCategoryMarkers('theatres');
    fetchCategoryMarkers('museums');
    currentLayer = null;
/*
    // Fit map to markers
    setTimeout(() => {
        let allMarkers = L.featureGroup([...galleryLayer.getLayers(), ...theatreLayer.getLayers(), ...museumLayer.getLayers()]);
        if (allMarkers.getLayers().length > 0) {
            map.fitBounds(allMarkers.getBounds());
        }
    }, 200); // Add a delay to ensure all markers are added before fitting bounds*/
}

// Initial load of all markers
showAllMarkers();