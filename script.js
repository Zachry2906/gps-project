let map = tt.map({
    key: '62hK7S8DRfGLeA8JreDfxEOkA9nFzAv8',
    container: 'map',
    center: [106.8166, -6.2],
    zoom: 14
});

let markers = [];

function findNearbyPlaces() {
    markers.forEach(marker => marker.remove());
    markers = [];

    const searchQuery = document.getElementById('search').value;
    const radius = document.getElementById('radius').value || 1000;
    const limit = document.getElementById('limit').value || 10;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            fetch(`https://api.tomtom.com/search/2/search/${searchQuery}.json?key=62hK7S8DRfGLeA8JreDfxEOkA9nFzAv8&lat=${userLatitude}&lon=${userLongitude}&radius=${radius}&limit=${limit}`)
                .then(response => response.json())
                .then(data => {
                    data.results.forEach(place => {
                        const placePosition = [place.position.lon, place.position.lat];
                        const marker = new tt.Marker().setLngLat(placePosition).addTo(map);
                        markers.push(marker);

                        new tt.Popup({offset: 30})
                            .setLngLat(placePosition)
                            .setHTML(`<h3>${place.poi ? place.poi.name : place.name}</h3>`)
                            .addTo(map);

                        console.log(`Tempat Ditemukan: ${place.poi ? place.poi.name : place.name}`);
                    });
                    
                    map.flyTo({ center: [userLongitude, userLatitude], zoom: 14 });
                })
                .catch(error => console.error('Error:', error));
        });
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
}

function findNearbySchools(placeType) {
    markers.forEach(marker => marker.remove());
    markers = [];

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            fetch(`https://api.tomtom.com/search/2/poiSearch/${placeType}.json?key=62hK7S8DRfGLeA8JreDfxEOkA9nFzAv8&lat=${userLatitude}&lon=${userLongitude}&radius=1000&limit=10`)
                .then(response => response.json())
                .then(data => {
                    data.results.forEach(place => {
                        const placePosition = [place.position.lon, place.position.lat];
                        const marker = new tt.Marker().setLngLat(placePosition).addTo(map);
                        markers.push(marker);

                        new tt.Popup({offset: 30})
                            .setLngLat(placePosition)
                            .setHTML(`<h3>${place.poi.name}</h3>`)
                            .addTo(map);

                        console.log(`${placeType} Ditemukan: ${place.poi.name}`);
                    });
                    
                    map.flyTo({ center: [userLongitude, userLatitude], zoom: 14 });
                })
                .catch(error => console.error('Error:', error));
        });
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
}
