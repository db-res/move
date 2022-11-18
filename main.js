import './style.css'

import * as THREE from 'three';
import controlsFun from './js/controls.js'
import worldsFun from './js/worlds.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import funcInit from './js/func.js'
import './js/func.js'


const vertex = new THREE.Vector3();
const color = new THREE.Color();
let camera, controls, scene, renderer, light, raycaster, raycaster2, INTERSECTED;

let isAddLY = false, isAddLX = false;

let pointer = new THREE.Vector2();

let fristEnter = true;

let prevTime = performance.now();

let controlsType = 'orbit'


init().then(res=>{
  // funcInit({camera, controls, scene, renderer, controlsType})
  animate()
})

// 点击切换控制器
document.getElementById('changeControls').onclick = changeControls
function changeControls() {
  controls.dispose()
  switch (controlsType) {
    case 'orbit':
      controlsType = 'pointerLock'
      break;
    case 'pointerLock':
      controlsType = 'orbit'
      break;
    default:
      break;
  }
  initControls()
}

// 初始化控制器
function initControls(params) {
  switch (controlsType) {
    case 'orbit':
      // 轨道控制器
      document.getElementById('blocker').style.display = 'none'
      document.getElementById('orbitControlSetting').style.display = 'block'
      controlsFun.orbitControl(controls, scene, camera, renderer).then(res=>{
        controls = res.controls
        // controls.autoRotate = true
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 0;

        controls.minDistance = 100;
        // controls.maxDistance = 1000;
        // sessionStorage.setItem('controls',JSON.stringify(controls))
      })
      break;
    case 'pointerLock':
      // 指针锁定控制器
      document.getElementById('blocker').style.display = 'block'
      document.getElementById('orbitControlSetting').style.display = 'none'
      controlsFun.pointerLockControl(controls, scene, camera, renderer).then(res=>{
        controls = res.controls
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = 0;
      })
      break;
  
    default:
      break;
  }
}

document.getElementById('orbitControlSetting').onclick = function () {
  controls.autoRotate = !controls.autoRotate
}

// 初始化
function init() {
  return new Promise(res=>{
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    // scene.fog = new THREE.Fog( 0xcccccc, 100 );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.0005 );
  
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // renderer = new CSS3DRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.getElementById('view').appendChild( renderer.domElement );
  
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 1000, 1200, 1000 );
  
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    raycaster2 = new THREE.Raycaster( new THREE.Vector3() );
    
    //控制器
    initControls()
  
    worldsFun.addscene(scene).then(res=>{})
  
    // worldsFun.text(scene, {TextGeometry,FontLoader}, 'text').then(res=>{
    //   let text = scene.children.find(item=>{return item.name == 'text1'})
    //   text.rotation.y = Math.PI * 2
    // })
  
    document.addEventListener( 'click', onPointerMove );
  
    window.addEventListener( 'resize', onWindowResize );
    
    res()
  })
  

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
function onPointerMove( event ) {

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  findIntersections()

}

function animate() {

  requestAnimationFrame( animate );

  // worldsFun.lightMove(scene, 0.000005)
  worldsFun.lightMove(scene, 0.00005)
  worldsFun.lightBollMove(scene)
  switch (controlsType) {
    case 'orbit':
      controls&&controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
      // document.getElementById('orbitControlSetting').
      break;
    case 'pointerLock':
      controlsFun.moveCream(controls, scene, raycaster, prevTime).then(res=>{
        prevTime = res.prevTime
      })
      break;
  
    default:
      break;
  }
  render();
  

}


function render() {

  renderer.render( scene, camera );

}

function findIntersections(params) {
  // find intersections

  raycaster2.setFromCamera( pointer, camera );

  const intersects = raycaster2.intersectObjects( scene.children, false );
  // debugger
  // console.log(scene.children,intersects);
  
  if ( intersects.length > 0 ) {
    
    INTERSECTED = intersects[ 0 ].object;
    console.log(INTERSECTED.name);
    
  } else {
    INTERSECTED = null;
  }
}






