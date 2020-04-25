
let scene, camera, renderer
let controls
let width = window.innerWidth
let height =  window.innerHeight

function init() {
    //Scene
    scene = new THREE.Scene();

    createCamera();
    createLights();
    createMeshes();
    createRenderer();
    createParticles();


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    renderer.setAnimationLoop(() => {
        update();
        render();
    });
}

function createCamera() {
    camera = new THREE.PerspectiveCamera( 75, width/height, .5, 1000 ) 
    camera.position.z = 5


}

function createLights() {

    let sceneLight = new THREE.DirectionalLight(0Xffffff, 0.8);
    sceneLight.position.set(0,1,60);
    scene.add(sceneLight)

}

let cube
let cubeGeometry, cubeMaterial

let line

function createMeshes() {
    cubeGeometry = new THREE.BoxBufferGeometry();
    cubeMaterial = new THREE.MeshLambertMaterial();
    
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial);
    cube.position.z += 3;
    scene.add(cube);

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
    var Material = new THREE.LineBasicMaterial( { color: 0xffffff} );

    // line
    line = new THREE.Line( Geometry,  Material );
    scene.add( line );

    var positions = line.geometry.attributes.position.array;

    var x, y, z, index;
    x = y = z = index = 0;

    for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {

        positions[ index ++ ] = x;
        positions[ index ++ ] = y;
        positions[ index ++ ] = z;

        x = Math.random() * 500 - 250,
        y = Math.random() * 500 - 250,
        z = Math.random() * 500 - 250

    }

    line.geometry.attributes.position.needsUpdate = true

}

let particleSystem

function createParticles() {
    let particleCount = 1800;
    let particles = new THREE.BufferGeometry();
    let pMaterial = new THREE.PointsMaterial({size: 3, color: 0xffffff})

    let vertices = []
    for( let p = 0; p < particleCount; p ++) {
        let pX = Math.random() * 500 - 250,
            pY = Math.random() * 500 - 250,
            pZ = Math.random() * 500 - 250,
            particle = (pX,pY,pZ)

        vertices.push(particle)

    }

    particles.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    particleSystem = new THREE.Points(particles,pMaterial);
    scene.add(particleSystem)
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer(    {antialias: true}
        );
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setClearColor(0x000000,1)
    renderer.setSize( width, height );
    document.body.appendChild(renderer.domElement);

}





function update() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // portalParticles.forEach(p => {
    //     p.rotation.z += 0.01;
    //     p.position.z = p.position.z - Math.random() / 100;
    // });

    // camera.position.z += 0.08;
    line.geometry.setDrawRange( 0, line.geometry.drawRange.count + 0.05);
}

function render() {
    controls.update();

    renderer.render(scene, camera)
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

init();
