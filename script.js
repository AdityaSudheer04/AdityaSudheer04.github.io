window.onload = () => {
    	
    
    let testEntityAdded = false;

    const el = document.querySelector("[gps-new-camera]");

    
    const textOverlay = document.getElementById('overlay');

    el.addEventListener("gps-camera-update-position", async(e) => {
        if (!testEntityAdded) {
            try {
                const latitude = e.detail.position.latitude;
                const longitude = e.detail.position.longitude;

                // Make API call to OSM to fetch nearby points of interest
                const response = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`);
                const data = await response.text();

                // Parse the XML response from OSM
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const targetTagAttribute = 'k';
                const targetTagValue = 'name';

                // Select nodes that contain a <tag> element with the specified attribute and value
                const allNodes = xmlDoc.querySelectorAll('node');

                // Filter nodes that contain a <tag> element with the specified attribute and value
                const nodesWithTargetTag = Array.from(allNodes).filter(node => {
                const tags = node.querySelectorAll(`tag[${targetTagAttribute}="${targetTagValue}"]`);
                return tags.length > 0;
                });

                console.log(nodesWithTargetTag);
                // Extract points of interest from the OSM response
                // const nodes = xmlDoc.querySelectorAll('node');
                nodesWithTargetTag.forEach(node => {
                    const poiLatitude = parseFloat(node.getAttribute('lat'));
                    const poiLongitude = parseFloat(node.getAttribute('lon'));

                    // Create 3D models for each point of interest
                    const poiEntity = document.createElement("a-entity");
                    
                     // Replace 'your_model.glb' with your actual model file
                    poiEntity.setAttribute('gps-new-entity-place', {
                        latitude: poiLatitude,
                        longitude: poiLongitude
                    });
                    
                    poiEntity.setAttribute("gltf-model", "url(./assets/models/koala.glb)");
                    // poiEntity.setAttribute('cursor-listener', ''); // Add the cursor listener for touch interaction
                    document.querySelector("a-scene").appendChild(poiEntity);

                    // Add event listener for click on the point of interest
                    poiEntity.addEventListener('click', function () {
                        textOverlay.innerHTML = `${poiLatitude}, ${poiLongitude}`;
                        setTimeout(() => {
                            textOverlay.innerHTML = "";
                        }, 1500);
                    });
                });
            } catch (error) {
                console.error("Error fetching and processing OSM data:", error);
            }

            testEntityAdded = true;
        }
    });
};


