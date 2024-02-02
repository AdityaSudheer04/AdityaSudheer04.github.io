window.onload = () => {
    	

    
    let testEntityAdded = false;
    let tourGuideAdded = false;

    const el = document.querySelector("[gps-new-camera]");

    
    const textOverlay = document.getElementById('text');

    el.addEventListener("gps-camera-update-position", async(e) => {
        if(!tourGuideAdded)
        {
            const tourGuideButton = document.getElementById('tour-guide-button');
            tourGuideButton.addEventListener('click', function() {
            console.log("Button clicked");
        
            const tourGuide = document.createElement('a-entity');
            tourGuide.setAttribute("gltf-model", "url(./assets/models/koala.glb)");
            tourGuide.setAttribute('gps-new-entity-place',{
                latitude: e.detail.position.latitude,
                longitude: e.detail.position.longitude + 0.00001
            })
        
            console.log("Entity created");
        
            document.querySelector('a-scene').appendChild(tourGuide);
            tourGuideAdded = true;
            console.log(tourGuide);
            console.log("Entity appended to scene");

            setTimeout(function(){
                if(tourGuideAdded)
                {
                    document.querySelector('a-scene').removeChild(tourGuide);
                    tourGuide.destroy();
                }
                
                tourGuideAdded = false;
            }, 5000)
            });

            
        }
        

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
                    poiEntity.addEventListener('click', () => {
                        textOverlay.innerHTML = `${node.children[1].attributes[1].value}`;


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


