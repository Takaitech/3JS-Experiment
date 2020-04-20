
let scene, camera, renderer
let width = window.innerWidth
let height =  window.innerHeight

function init() {
    //Scene
    scene = new THREE.Scene();

    let sceneLight = new THREE.DirectionalLight(0Xffffff, 0.8);
    sceneLight.position.set(0,1,60);
    scene.add(sceneLight)

    //PerspectiveCamera(FOV, Aspect Ratio, Near, Far)
    camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 ) 

    //Renderer (the magic)
    renderer = new THREE.WebGLRenderer(    {antialias: true}
        );
    renderer.setClearColor(0xffffff,1)
    renderer.setSize( width, height );
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5
}

let cube
let cubeGeometry, cubeMaterial

function createcube() {
    cubeGeometry = new THREE.BoxGeometry();
    cubeMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
    
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial);
    cube.position.z += -.2;
    // scene.add(cube);
}


init();
createcube();
particleSetup();


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


//Buffer cubeGeometry

var MAX_POINTS = 1000;

// cubeGeometry
var Geometry = new THREE.BufferGeometry();

// attributes
var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
Geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

// draw range
var drawCount = 1; // draw the first 2 points, only
Geometry.setDrawRange( 0, drawCount );

// cubeMaterial
var Material = new THREE.LineBasicMaterial( { color: 0xffffff } );

// line
var line = new THREE.Line( Geometry,  Material );
scene.add( line );

var positions = line.geometry.attributes.position.array;

var x, y, z, index;
x = y = z = index = 0;

for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {

    positions[ index ++ ] = x;
    positions[ index ++ ] = y;
    positions[ index ++ ] = z;

    x += ( Math.random() - 0.5 ) * 30;
    y += ( Math.random() - 0.5 ) * 30;
    z += ( Math.random() - 0.5 ) * 30;

}

line.geometry.attributes.position.needsUpdate = true


let portalParticles = []

function particleSetup() {
    let loader = new THREE.TextureLoader();
    loader.load("script/texture.png", function(texture) {
        let geo = new THREE.PlaneBufferGeometry(20,20)
        let mat = new THREE.MeshStandardMaterial({
            map:texture,
            transparent: true
        });

        for(let p = 100; p > 50; p--) {
            let particle = new THREE.Mesh(geo, mat);
            particle.position.set( Math.random(), Math.random() , -10);
            particle.rotation.z = Math.random() *360;
            portalParticles.push(particle);
            scene.add(particle)
        }
        
    })
}



function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    portalParticles.forEach(p => {
        p.rotation.z += 0.01
        p.position.z = p.position.z - Math.random() / 100
    });

    // camera.position.z += 0.08;
    line.geometry.setDrawRange( 0, line.geometry.drawRange.count + 0.05);

    renderer.render(scene, camera);

}
animate();
