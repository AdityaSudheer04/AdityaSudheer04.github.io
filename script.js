window.onload = () => {
    let testEntityAdded = false;

    const el = document.querySelector("[gps-new-camera]");

    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            // Add a box to the north of the initial GPS position
            const entityNorth = document.createElement("a-box");
            entityNorth.setAttribute("scale", {
                x: 20, 
                y: 20,
                z: 20
            });
            entityNorth.setAttribute('material', { color: 'yellow' } );
            entityNorth.setAttribute('gps-new-entity-place', {
                latitude: e.detail.position.latitude + 0.001,
                longitude: e.detail.position.longitude
            });
            document.querySelector("a-scene").appendChild(entityNorth);


            const entitySouth = document.createElement("a-box");
            entitySouth.setAttribute("scale", {
                x: 20, 
                y: 20,
                z: 20
            });
            entitySouth.setAttribute('material', { color: 'red' } );
            entitySouth.setAttribute('gps-new-entity-place', {
                latitude: e.detail.position.latitude - 0.001,
                longitude: e.detail.position.longitude
            });
            document.querySelector("a-scene").appendChild(entitySouth);


            const entityEast = document.createElement("a-box");
            entityEast.setAttribute("scale", {
                x: 20, 
                y: 20,
                z: 20
            });
            entityEast.setAttribute('material', { color: 'green' } );
            entityEast.setAttribute('gps-new-entity-place', {
                latitude: e.detail.position.latitude,
                longitude: e.detail.position.longitude + 0.001
            });
            document.querySelector("a-scene").appendChild(entityEast);


            const entityWest = document.createElement("a-box");
            entityWest.setAttribute("scale", {
                x: 20, 
                y: 20,
                z: 20
            });
            entityWest.setAttribute('material', { color: 'blue' } );
            entityWest.setAttribute('gps-new-entity-place', {
                latitude: 13.006075,
                longitude: 74.7956777
            });
            document.querySelector("a-scene").appendChild(entityWest);
        }
        testEntityAdded = true;
    });
};