window.onload = () => {
    	

    
    let testEntityAdded = false;
    let tourGuideAdded = 0;
    let tourGuide;

    let markerLatitude;
    let markerLongitude;

    function distance(pointA, pointB){
        return Math.sqrt((pointA[0]-pointB[0])^2 + (pointA[1]-pointB[1])^2);
    }

    async function tourGuidePosition(poiLat, poiLon, displacementMeters = 2) {
        let poiPosition = [poiLat, poiLon];
        let currentPosition = await getCurrentPosition();
    
        let totalDistance = distance(poiPosition, currentPosition);
        let directionVector = [(poiPosition[0] - currentPosition[0]), (poiPosition[1] - currentPosition[1])];
    
        // Normalize the direction vector
        let normalizedDirection = [directionVector[0] / totalDistance, directionVector[1] / totalDistance];
    
        // Convert the displacement to latitude and longitude units
        let displacementLatitude = (displacementMeters / 111111) * normalizedDirection[0];
        let displacementLongitude = (displacementMeters / (111111 * Math.cos(currentPosition[0] * (Math.PI / 180)))) * normalizedDirection[1];
    
        // Calculate the guide position 2 meters away in the direction of the POI
        let guidePosition = [
            currentPosition[0] + displacementLatitude,
            currentPosition[1] + displacementLongitude
        ];
    
        return guidePosition;
    }
    
    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve([position.coords.latitude, position.coords.longitude]),
                (error) => reject(error)
            );
        });
    }

    if(tourGuideAdded == 0)
    {
            
        const tourGuideButton = document.getElementById('tour-guide-button');
        let latitudeGuide;
        let longitudeGuide;
        tourGuideButton.addEventListener('click', function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            longitudeGuide = position.coords.longitude;
            latitudeGuide = position.coords.latitude;
        })
        console.log("Button clicked");
        
        tourGuide = document.createElement('a-entity');
        tourGuide.setAttribute("gltf-model", "url(./assets/models/koala.glb)");
        tourGuide.setAttribute('gps-new-entity-place', {
            latitude: tourGuidePosition()[0],
            longitude: tourGuidePosition()[1]
        });

        console.log("Entity created");

        document.querySelector('a-scene').appendChild(tourGuide);
        tourGuideAdded += 1;
        console.log(tourGuide);
        console.log("Entity appended to scene");
        console.log(tourGuideAdded);
        setTimeout(function(){
            if(tourGuideAdded)
            {
                document.querySelector('a-scene').removeChild(tourGuide);
                    
                console.log('removed');
            }
                
            tourGuideAdded = 0;
        }, 10000)
        });

            
    }


    const el = document.querySelector("[gps-new-camera]");

    
    const textOverlay = document.getElementById('text');

    el.addEventListener("gps-camera-update-position", async(e) => {
        if (!testEntityAdded) {
            try {
                const latitude = e.detail.position.latitude;
                const longitude = e.detail.position.longitude;

                
                const response = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`);
                const data = await response.text();

                // Parse the XML response from OSM
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");

                const targetTagAttribute = 'k';
                const targetTagValue = 'name';


                const allNodes = xmlDoc.querySelectorAll('node');

                // Filter nodes that contain a <tag> element with the specified attribute and value
                const nodesWithTargetTag = Array.from(allNodes).filter(node => {
                const tags = node.querySelectorAll(`tag[${targetTagAttribute}="${targetTagValue}"]`);
                return tags.length > 0;
                });

                console.log(nodesWithTargetTag);
                
                nodesWithTargetTag.forEach(node => {
                    const poiLatitude = parseFloat(node.getAttribute('lat'));
                    const poiLongitude = parseFloat(node.getAttribute('lon'));

                    // Create 3D models for each point of interest
                    const poiEntity = document.createElement("a-entity");
                    
                    
                    poiEntity.setAttribute('gps-new-entity-place', {
                        latitude: poiLatitude,
                        longitude: poiLongitude
                    });
                    
                    
                    poiEntity.setAttribute("gltf-model", "url(./assets/models/map_pointer_3d_icon.glb)");

                    document.querySelector("a-scene").appendChild(poiEntity);

                    // Add event listener for click on the point of interest
                    poiEntity.addEventListener('click', function() {
                        textOverlay.innerHTML = `${node.children[1].attributes[1].value}`;
                        markerLatitude = this.latitude;
                        markerLongitude = this.longitude;

                        tourGuidePosition(markerLatitude,markerLongitude);

                        setTimeout(() => {
                            textOverlay.innerHTML = "";
                        }, 3000);
                    });
                });
            } catch (error) {
                console.error("Error fetching and processing OSM data:", error);
            }

            testEntityAdded = true;

        }
    });
};


