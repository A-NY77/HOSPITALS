let map = L.map("map", { 
    center: [-1.2650367, 36.845025],
    zoom: 15,
});

let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let esriImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`,
    }
);

let cartoDB = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>",
    }
);

let baseMaps = {
    "OpenStreetMap": osm,
    "ESRI World Imagery": esriImagery,
    "CartoDB Light": cartoDB
};

L.control.layers(baseMaps).addTo(map);

fetch("data/hospitals.geojson")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name);
                }
            },
        }).addTo(map);
    })
    .catch((error) => console.error("Error loading GeoJSON:", error));

// Add legend to map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Map Legend</h4>";
    div.innerHTML += '<p><span class="legend-marker hospital"></span> Hospitals</p>';
    div.innerHTML += '<p><span class="legend-marker park"></span> Parks</p>';
    div.innerHTML += '<p><span class="legend-marker school"></span> Schools</p>';
    div.style.border = "2px solid black";
    div.style.padding = "10px";
    div.style.background = "white";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
    return div;
};

legend.addTo(map);
