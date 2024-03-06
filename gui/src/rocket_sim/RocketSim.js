import React, {useEffect} from "react";
import * as THREE from "three";
import {OBJLoader} from "three/addons/loaders/OBJLoader";

const RocketSim = () => {
    let scene, camera, renderer, rocketModel, hemisphereLight, ground;

    const loader = new OBJLoader();

    useEffect(() => {
        // Create a scene
        scene = new THREE.Scene();

        // Create a camera
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Update aspect ratio

        // Create a renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(800, 800); // Set canvas size to 600x600 pixels

        // Check if the renderer.domElement is already appended
        const existingCanvas = document.getElementById("rocket-container").querySelector("canvas");
        if (existingCanvas) {
            // If canvas already exists, remove it before appending the new one
            document.getElementById("rocket-container").removeChild(existingCanvas);
        }

        document.getElementById("rocket-container").appendChild(renderer.domElement);

        // Load the rocket model
        loader.load(
            "/rocket.obj",
            function (object) {
                rocketModel = object;

                // Rotate the rocket model 90 degrees
                rocketModel.rotation.x = Math.PI / 2;

                // Shrink the rocket model
                rocketModel.scale.set(0.1, 0.1, 0.1); // Adjust the scale as needed
                rocketModel.position.y = 2;
                scene.add(rocketModel);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            function (error) {
                console.log("An error happened");
            }
        );

        // Create a hemisphere light for daylight simulation
        hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        scene.add(hemisphereLight);

        // Create ground
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load("dirt.jpg"); // Replace with your texture path

        const groundGeometry = new THREE.PlaneGeometry(1000, 1000); // Adjust size as needed
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: groundTexture,
            color: 0xaaaaaa,
            roughness: 1
        });
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
        scene.add(ground);

        // Set camera position
        // Set camera position
        camera.position.set(0, 5, 0);
        camera.lookAt(scene.position);

        // Animation function
        const animate = () => {
            requestAnimationFrame(animate);

            // Update rocket model based on web app data

            // Update camera rotation
            const time = performance.now() * 0.001; // Convert milliseconds to seconds
            const rotationSpeed = 0.1; // Degrees per second
            if (rocketModel) {
                rocketModel.position.y = rocketModel.position.y + 0.1;
                camera.position.x = 8 * Math.cos(time * rotationSpeed);
                camera.position.z = 8 * Math.sin(time * rotationSpeed);
                camera.position.y = rocketModel.position.y + 5;
                camera.lookAt(rocketModel.position);
            }

            // Render the scene
            renderer.render(scene, camera);
        };

        // Start the animation loop
        animate();

        // Cleanup function
        return () => {
            renderer.dispose();
        };
    }, []);

    return <div id="rocket-container" />;
};

export default RocketSim;
