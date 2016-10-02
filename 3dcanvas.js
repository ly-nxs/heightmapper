
var threecanvas;
var ictx;
            
var camera, scene, renderer, container;
var light, pointLight, geometry, mesh;
var uniforms, material;
var heightmap, diffTexture, dispTexture;

function threestart() {

    threecanvas = document.getElementById("tempCanvas");
    ictx=threecanvas.getContext("2d");
    container = document.getElementById( 'container' );

    // --- WebGl render

    try {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.autoClear = false;
        container.appendChild( renderer.domElement );
    }
    catch (e) {
        alert(e);
    }

    scene = new THREE.Scene();

    // --- Camera

    var fov = 15; // camera field-of-view in degrees
    var width = renderer.domElement.width;
    var height = renderer.domElement.height;
    var aspect = width / height; // view aspect ratio
    camera = new THREE.PerspectiveCamera( fov, aspect );
    camera.position.z = -600;
    camera.position.y = -800;
    camera.lookAt(scene.position);
    camera.updateMatrix();

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener( 'change', render );

    
    // --- Lights
            
    pointLight = new THREE.PointLight( 0xffffff, 1.0 );
    scene.add( pointLight );
    
    pointLight.position.set(0, 100, -200);


    
    // MATERIAL

    dispTexture = new THREE.Texture(threecanvas);
    
    var shader = THREE.ShaderLib[ "normalmap" ];
    uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    
    uniforms[ "enableDisplacement" ] = { type: 'i', value: 1 };
    uniforms[ "tDisplacement" ] = { type: 't', value: dispTexture };
    uniforms[ "uDisplacementScale" ] = { type: 'f', value: 35 };
    
    uniforms[ "enableDiffuse" ] = { type: 'i', value: 1 };
    uniforms[ "tDiffuse" ].value = dispTexture;

    uniforms[ "tNormal" ] = { type: 't', value: new THREE.ImageUtils.loadTexture( 'flat.png' )};
    
    
    
    material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        lights: true,
        side: THREE.DoubleSide
    } );

    
    // GEOMETRY

    geometry = new THREE.PlaneGeometry(256, 200, 256, 200);
    geometry.computeTangents();
    mesh = new THREE.Mesh( geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);

    
    setInterval("update()", 30);
 
    update();
}

function update() {
    dispTexture.needsUpdate = true;

    render();
    controls.update(); // trackball interaction
}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
}

window.onload = function() {
}
