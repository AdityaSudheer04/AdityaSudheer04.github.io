window.onload = () => {
    	
    
    
    // AFRAME.registerComponent('cursor-listener', {
    //     init: function () {
    //       var lastIndex = -1;
    //       var COLORS = ['red', 'green', 'blue'];
    //       this.el.addEventListener('click', function (evt) {
    //         lastIndex = (lastIndex + 1) % COLORS.length;
    //         this.setAttribute('material', 'color', COLORS[lastIndex]);
    //         console.log('I was clicked at: ', evt.detail.intersection.point);
    //       });
    //     }
    // });
    
    
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
            entityNorth.setAttribute('name', 'Yellow Box')
            entityNorth.addEventListener('click', function(){
                const placeName = document.createElement('a-text');
                this.appendChild(placeName)
                placeName.setAttribute('value', this.getAttribute('name'));
                placeName.setAttribute('z-offset', 1);  
                placeName.setAttribute('x-offset', -0.5);  
                placeName.setAttribute('color', 'black');  
                setTimeout(() => {this.removeChild(placeName)}, 1500);
               
            })

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
            entitySouth.setAttribute('name', 'Red Box');
            entitySouth.addEventListener('click', function()  {
                const placeName = document.createElement('a-text');
                console.log(placeName);
                this.appendChild(placeName)
                placeName.setAttribute('value', this.getAttribute('name'));
                placeName.setAttribute('z-offset', 1.2);  
                // placeName.setAttribute('x-offset', -0.5);  
                placeName.setAttribute('color', 'black');  
                setTimeout(() => {this.removeChild(placeName)}, 1000);
            })


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
            entityEast.setAttribute('name', 'Green Box');
            entityEast.addEventListener('click', function() {
                
                const placeName = document.createElement('a-text');
                console.log(placeName);
                this.appendChild(placeName);
                placeName.setAttribute('value', this.getAttribute('name'));
                placeName.setAttribute('z-offset', 1.1);  
                // placeName.setAttribute('x-offset', -0.5);  
                placeName.setAttribute('color', 'black');  
                setTimeout(() => {this.removeChild(placeName)}, 1000);
            })
            


            const entityWest = document.createElement("a-box");
            entityWest.setAttribute("scale", {
                x: 1, 
                y: 1,
                z: 1
            });
            entityWest.setAttribute('material', { color: 'blue' } );
            entityWest.setAttribute('gps-new-entity-place', {
                latitude: 13.0061992,
                longitude: 74.7957122
            });
            
            document.querySelector("a-scene").appendChild(entityWest);
            entityWest.setAttribute('name', 'Blue Box');
            entityWest.addEventListener('click', function() {
                
                const placeName = document.createElement('a-text');
                console.log(placeName);
                this.appendChild(placeName)
                placeName.setAttribute('value', this.getAttribute('name'));
                placeName.setAttribute('z-offset', 1);  
                placeName.setAttribute('x-offset', -0.5);  
                placeName.setAttribute('color', 'black');  
                setTimeout(() => {this.removeChild(placeName)}, 1000);
            })
        }
        testEntityAdded = true;
    });
};
