var Zlib = require('zlib');
var THREE = window.THREE = require('three');
var FBXLoader = require('three/examples/js/loaders/FBXLoader');
var OrbitControls = require('three/examples/js/controls/OrbitControls');

var container, controls;
var camera, scene, renderer, light;
var raycaster;
var mouse = new THREE.Vector2()
var INTERSECTED, SELECTED;
var intersectableObjs = [];
var cameraCurrentHexes = [];
var nameLoc = { 
	'camera': new THREE.Vector3(0, 150, -300),
	'stool': new THREE.Vector3(-40, 80, 150),
	'cube': new THREE.Vector3(-40, 130, 150),
	'lamp': new THREE.Vector3(50, 160, 150)
};
var nameDescription = {
	'camera': "Press space to record",
	'stool': "Although it doesn't have a starring role, the stool just excited that it was cast.",
	'cube': "In it's first performance, Cube will be standing utterly still. Breathtaking.",
	'lamp': "It's a lamp."
}
var isObjSelected = false;
var backButton, descriptionText;
var cameraOrigPosition;
var zoomingOut = false;
var clock, textMesh;
var over = false;

//var cameraForImage;

init();
animate();

function unselectObj() {
	isObjSelected = false;
	zoomingOut = true;
	backButton.style.display = 'none';
	descriptionText.style.display = 'none';
}

function init() {
	backButton = document.createElement("button");
	backButton.innerHTML = "back";
	backButton.setAttribute('id', 'back');
	backButton.style.display = 'none';
	backButton.onclick = unselectObj;
	document.body.appendChild(backButton);

	descriptionText = document.createElement("div");
	descriptionText.setAttribute('id', 'text');
	descriptionText.style.display = 'none';
	document.body.appendChild(descriptionText);

	clock = new THREE.Clock(false);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(150, 200, 370);	

	raycaster = new THREE.Raycaster();

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	light = new THREE.HemisphereLight(0xffffff, 0x444444);
	light.position.set(0, 200, 0);
	scene.add(light);

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set(0, 200,-100);
	light.castShadow = true;
	light.shadow.camera.top = 280;
	light.shadow.camera.bottom = -200;
	light.shadow.camera.left = -120;
	light.shadow.camera.right = 120;
	scene.add(light);

	SELECTED = null;
	//cool ground thing
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(2000, 2000),
		new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ));
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add(mesh);

	var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
	grid.material.opacity = 0.2;
	grid.material.transparent = true;
	scene.add(grid);

	//load models
	var loader = new THREE.FBXLoader();
	loader.load('/models/full_scene_color_textures.fbx', function (sceneModels) {
		sceneModels.traverse( function (child) {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			} 

			if (child.name === "camera") {
				for (var i = 0; i < child.material.length; i++) {
					cameraCurrentHexes.push(child.material[i].color.getHex());
				}
				intersectableObjs.push(child);
			}
		});
		sceneModels.scale.set(30, 30, 30);
		scene.add(sceneModels);
	}, undefined, function (error) {
		console.log(error);
	});

	var fontLoader = new THREE.FontLoader();
	fontLoader.load('three/examples/fonts/helvetiker_bold.typeface.json', function( font ) {
		var textGeometry = new THREE.TextGeometry( 'REC', {
			font: font,
			size: 5,
			height: 5,
			curveSegments: 12,
			bevelEnabled: false,
		} );
		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, flatShading: true });
		textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.set(0, 165, -315);
		textMesh.rotateY(Math.PI);
		textMesh.visible = false;
		scene.add(textMesh);
	});

	//renderer
	renderer = new THREE.WebGLRenderer( { antialias : true } );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement );

	//orbitcontrols
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 100, 0);
	controls.update();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );

	window.addEventListener('resize', onWindowResize, false);
}

function animate() {
	if (!over) {
		requestAnimationFrame( animate );
		render();
	}
}

function onDocumentKeyDown( event ) {
	event.preventDefault();

	if (isObjSelected && SELECTED && SELECTED.name === 'camera') {
		if (event.which == 32) {
			camera.position.set(0, 150, -400);
			camera.lookAt(nameLoc['camera']);
			backButton.style.display = 'none';
			descriptionText.style.display = 'none';
			clock.start();
		}
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	if (INTERSECTED && !isObjSelected) {
		cameraOrigPosition = camera.position.clone();
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.enableRotate = true;
		controls.update();
		isObjSelected = true;
		SELECTED = INTERSECTED;
		
		
		//return to normal color
		if (INTERSECTED.name === "camera") {
			for (var i = 0; i < INTERSECTED.material.length; i++) {
				INTERSECTED.material[i].color.setHex( cameraCurrentHexes[i] );
			}	
		} else {
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		}
		INTERSECTED = null;
	}
}

function moveCamera() { 
	if (isObjSelected) {
		controls.target = nameLoc[SELECTED.name];
		var dist = new THREE.Vector3();
		dist = camera.position.distanceTo(nameLoc[SELECTED.name]);
		if (dist > 100) {
			var r = 10;			
			var dir = new THREE.Vector3();
			dir.subVectors(nameLoc[SELECTED.name], camera.position);
			dir.normalize();
			camera.position.addScaledVector(dir, r);
			camera.updateProjectionMatrix();
			controls.update();
		} else {
			controls.enableRotate = true;
		 	descriptionText.style.display = 'block';
			descriptionText.innerHTML = nameDescription[SELECTED.name];
			backButton.style.display = 'block'
		}
	}
}

function zoomOut() {
	if (zoomingOut) {
		controls.target = new THREE.Vector3(0, 100, 0);
		var dist = new THREE.Vector3();
		dist = camera.position.distanceTo(cameraOrigPosition);
		camera.lookAt(nameLoc[SELECTED.name]);
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.enableRotate = false;
		controls.update();
		if (dist > 20) {
			var r = 20;
			var dir = new THREE.Vector3();
			dir.subVectors(cameraOrigPosition, camera.position);
			dir.normalize();
			camera.position.addScaledVector(dir, r);
			camera.updateProjectionMatrix();
			controls.update();
		} else {
			zoomingOut = false;
		}
		controls.enablePan = true;
		controls.enableZoom = true;
		controls.enableRotate = true;
	}
}

function onDocumentMouseMove( event ) {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function findIntersectingObject() {
	//find intersection
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects(intersectableObjs);
	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {	
			//unselect previous INTERSECTED
			if (INTERSECTED) {
				if (INTERSECTED.name === "camera") {
					for (var i = 0; i < INTERSECTED.material.length; i++) {
						INTERSECTED.material[i].color.setHex( INTERSECTED.currentHexArray[i] );
					}
				} else {
					INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				}
			}
			//select new INTERSECTED
			INTERSECTED = intersects[0].object;
			if (INTERSECTED.name === "camera") {
				for (var i = 0; i < INTERSECTED.material.length; i++) {
					cameraCurrentHexes[i] = INTERSECTED.material[i].color.getHex();
					INTERSECTED.material[i].color.setHex(0xd64cfc);
				}
			} else {
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				INTERSECTED.material.color.setHex( 0xd64cfc );
			}
		}
	} else {	//nothing found
		if ( INTERSECTED ) { 
			if (INTERSECTED.name === "camera") {
				for (var i = 0; i < INTERSECTED.material.length; i++) {
					INTERSECTED.material[i].color.setHex( cameraCurrentHexes[i] );
				}
			} else {
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			}
		}
		INTERSECTED = null;
	}
}

function render() {
	if (!isObjSelected) {
		findIntersectingObject();
	}
	if (!clock.running) {
		moveCamera();
		zoomOut();
	} else {
		if (clock.getElapsedTime() - Math.floor(clock.getElapsedTime()) <= 0.5){
			textMesh.visible = true;
		} else {
			textMesh.visible = false;
		}
	}
	
	if (clock.getElapsedTime() >= 8) {
		clock.stop();
		over = true;
		textMesh.visible = false;
		descriptionText.innerHTML = "Done!";
		descriptionText.style.display = 'block';
		setTimeout( function() { window.location.replace("/playback"); },
			3000);
	}
	renderer.render(scene, camera);
}
