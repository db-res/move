import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

// 指针锁定控制器
function pointerLockControl(controls, scene, camera, renderer) {
    return new Promise(rr=>{
        controls = new PointerLockControls( camera, renderer.domElement );
        const blocker = document.getElementById( 'blocker' );
        const instructions = document.getElementById( 'instructions' );
    
        instructions.addEventListener( 'click', function () {
    
            controls.lock();
    
        } );
    
        controls.addEventListener( 'lock', function () {
    
            instructions.style.display = 'none';
            blocker.style.display = 'none';
    
        } );
    
        controls.addEventListener( 'unlock', function () {
    
            blocker.style.display = 'block';
            instructions.style.display = '';
    
        } );
    
        scene.add( controls.getObject() );
    
        const onKeyDown = function ( event ) {
    
            switch ( event.code ) {
    
                case 'ArrowUp':
                case 'KeyW':
                    moveForward = true;
                    break;
    
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = true;
                    break;
    
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = true;
                    break;
    
                case 'ArrowRight':
                case 'KeyD':
                    moveRight = true;
                    break;
    
                case 'Space':
                    if ( canJump === true ) velocity.y += 350;
                    canJump = false;
                    break;
    
            }
    
        };
    
        const onKeyUp = function ( event ) {
    
            switch ( event.code ) {
    
                case 'ArrowUp':
                case 'KeyW':
                    moveForward = false;
                    break;
    
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = false;
                    break;
    
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = false;
                    break;
    
                case 'ArrowRight':
                case 'KeyD':
                    moveRight = false;
                    break;
    
            }
    
        };
    
        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );
        rr({controls, scene, camera, renderer})
    })
}
// 指针锁定控制器下的相机移动
function moveCream(controls, scene, raycaster, prevTime, ){
    return new Promise(r=>{

        const time = performance.now();
    
        if ( controls&&controls.isLocked === true ) {
    
            raycaster.ray.origin.copy( controls.getObject().position );
            raycaster.ray.origin.y -= 10;
    
            const intersections = raycaster.intersectObjects( scene.children, false );
    
            const onObject = intersections.length > 0;
    
            const delta = ( time - prevTime ) / 1000;
    
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
    
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); // this ensures consistent movements in all directions
    
            if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
    
            if ( onObject === true ) {
    
                velocity.y = Math.max( 0, velocity.y );
                canJump = true;
    
            }
    
            controls.moveRight( - velocity.x * delta );
            controls.moveForward( - velocity.z * delta );
    
            controls.getObject().position.y += ( velocity.y * delta ); // new behavior
    
            if ( controls.getObject().position.y < 10 ) {
    
                velocity.y = 0;
                controls.getObject().position.y = 10;
    
                canJump = true;
    
            }
    
        }
    
        prevTime = time;
        r({controls, scene, raycaster, prevTime})
    })
}

// 轨道控制器
function orbitControl(controls, scene, camera, renderer) {
    return new Promise(res=>{
        // controls  OrbitControls

        controls = new OrbitControls( camera, renderer.domElement );
        controls.listenToKeyEvents( window ); // optional

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.autoRotate = true

        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 0;

        controls.minDistance = 100;
        controls.maxDistance = 1000;

        res({controls, scene, camera, renderer})

    })
}



let controlsFun;
export default controlsFun = {
    pointerLockControl,
    moveCream,
    orbitControl
}