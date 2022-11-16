import * as THREE from 'three';

function addscene(scene,obj) {

    return new Promise(rr=>{
        let bulbGeometry = new THREE.SphereGeometry( 20, 100, 50 );
    
        let bulbMat = new THREE.MeshStandardMaterial( {
            emissive: 0xffffee,
            emissiveIntensity: 1,
            color: 0x000000
        } );
    
        let hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.2 );
        scene.add( hemiLight );
    
        //Create a PointLight and turn on shadows for the light
        let light = new THREE.PointLight( '#ffffff', 1, 20000 );
        light.add(new THREE.Mesh( bulbGeometry, bulbMat ))
        light.position.set( 50, 20, 50 );
        light.name = 'pointLight'
        light.castShadow = true; // default false
        light.position.y = 500
        scene.add( light );
    
        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500 // default
    
        const ambientLight = new THREE.AmbientLight( 0x222222 );
        scene.add( ambientLight );
    
        // floor
    
        let floorGeometry = new THREE.PlaneGeometry( 20000, 20000, 100, 100 );
        floorGeometry.rotateX( - Math.PI / 2 );
        let floortexture = new THREE.TextureLoader().load( "https://threejs.s3.ladydaily.com/three.js-r146/images/grasslight-big.jpg" );
        floortexture.wrapS = THREE.RepeatWrapping;
        floortexture.wrapT = THREE.RepeatWrapping;
        floortexture.repeat.set( 64, 64 );
        const floorMaterial = new THREE.MeshLambertMaterial( { vertexColors: false, map: floortexture } );
    
        const floor = new THREE.Mesh( floorGeometry, floorMaterial );
        floor.position.y = -3
        floor.receiveShadow = true;
        floor.name = 'floor'
        scene.add( floor );
    
        // box
        let boxgeometry = new THREE.CylinderGeometry( 10, 50, 1000, 16 );
        // boxgeometry.rotateY(Math.PI / 2)
        // let boxtexture = new THREE.TextureLoader().load( "https://threejs.s3.ladydaily.com/three.js-r146/images/brick_diffuse.jpg" );
        let boxtexture = new THREE.TextureLoader().load( "https://threejs.s3.ladydaily.com/three.js-r146/images/Water_2_M_Normal.jpg" );
        boxtexture.wrapS = THREE.RepeatWrapping;
        boxtexture.wrapT = THREE.RepeatWrapping;
        boxtexture.repeat.set( 32, 32 );
        let boxmaterial = new THREE.MeshPhongMaterial( {map: boxtexture} );
        let boxcube = new THREE.Mesh( boxgeometry, boxmaterial );
        boxcube.position.set(0, (1000 / 2 - 3), 0)
        boxcube.updateMatrix()
        boxcube.castShadow = true; //default is false
        boxcube.receiveShadow = false; //default
        boxcube.name = 'boxcube'
        scene.add( boxcube ); 
    
        lightBoll(scene)
        lightBox(scene)

    })

}

function text(scene, obj, text) {
    let {FontLoader, TextGeometry} = obj
    let loader = new FontLoader();

    return new Promise(res=>{
        loader.load( 'https://threejs.s3.ladydaily.com/three.js-r146/fonts/helvetiker_regular.typeface.json', function ( font ) {
    
            let geometry = new TextGeometry( text, {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            } );
            geometry.computeBoundingBox();
    
            let materials = [
                new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
            ];
    
            let textMesh1 = new THREE.Mesh( geometry, materials );
    
            textMesh1.name = 'text1'
    
            textMesh1.position.x = 500;
            textMesh1.position.y = 50;
            textMesh1.position.z = 200;
    
            textMesh1.rotation.x = 0;
            textMesh1.rotation.y = Math.PI ;
    
            textMesh1.castShadow = true; 
            textMesh1.receiveShadow = false;
    
            scene.add( textMesh1 );

            res()
        } );
    })

}

function lightBoll(scene){
    let bulbGeometry = new THREE.SphereGeometry( 20, 100, 50 );

    let bulbMat = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    } );

    let lightBoll = new THREE.Mesh( bulbGeometry, bulbMat );
    // lightBoll.add(new THREE.Mesh( bulbGeometry, bulbMat ))
    lightBoll.position.set( 50, 20, 50 );
    lightBoll.name = 'lightBoll'
    lightBoll.castShadow = true; // default false
    // lightBoll.position.y = 500
    scene.add( lightBoll );
    
}

function lightBox(scene) {
    let bulbGeometry = new THREE.SphereGeometry( 20, 100, 50 );

    let bulbMat = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    } );

    //Create a PointLight and turn on shadows for the light
    let lightBox = new THREE.Mesh( bulbGeometry, bulbMat );
    // lightBox.add(new THREE.Mesh( bulbGeometry, bulbMat ))
    // lightBox.position.set( 50, 20, 50 );
    lightBox.castShadow = true; // default false
    lightBox.position.y = 1010
    lightBox.name = 'lightBox'
    scene.add( lightBox );
}


function lightMove(scene, speed) {
    let time = Date.now() * speed;
    let light = scene.children.find((item)=>{return item.name == 'pointLight'})
    let lp = light.position
    lp.y = Math.cos( time ) * 1000;
    lp.x = Math.sin( time ) * 5000;
    light.intensity  = Math.cos( time );
    // console.log(new THREE.Vector3(lp.x, lp.y, lp.z));
    // camera.lookAt(scene.children.find((item)=>{return item.name == 'lightBoll'}).position)
}
function lightBollMove(scene) {
    let time = Date.now() * 0.0005;
    let lp = scene.children.find((item)=>{return item.name == 'lightBoll'}).position
    lp.z = Math.cos( time ) * 1000;
    lp.x = Math.sin( time ) * 1000;
    // console.log(lp, camera);
    // camera.zoom = 1000
    // camera.position.set(lp.x - 50, lp.y + 50, lp.z - 50)
    // camera.lookAt(lp.x, 10, lp.z)
    // camera.lookAt(0, 0, 0)
}

let worldsFun;
export default worldsFun = {
    addscene,
    lightMove,
    lightBollMove,
    text
}