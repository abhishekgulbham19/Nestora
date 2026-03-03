const mapContainer = document.getElementById("map");
const coordinates = listing?.geometry?.coordinates;
const hasValidCoordinates = Array.isArray(coordinates) && coordinates.length === 2;

if (mapContainer && mapToken && hasValidCoordinates) {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    zoom: 9,
    center: coordinates,
  });

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${listing.title}</h4><p>Exact location provided after booking</p>`
  );

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
} else if (mapContainer) {
  mapContainer.innerHTML = "Location map is unavailable for this listing.";
}
