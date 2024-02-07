import React, {useEffect} from "react";
import * as THREE from "three";
import {OBJLoader} from "three/addons/loaders/OBJLoader";

const RocketSim = () => {
    let scene, camera, renderer, rocketModel, hemisphereLight;

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

        // Set camera position
        camera.position.z = 5;

        // Animation function
        const animate = () => {
            requestAnimationFrame(animate);

            // Update rocket model based on web app data

            // Update camera rotation
            const time = performance.now() * 0.001; // Convert milliseconds to seconds
            const rotationSpeed = 1; // Degrees per second
            camera.position.x = 5 * Math.cos(time * rotationSpeed);
            camera.position.z = 5 * Math.sin(time * rotationSpeed);
            camera.lookAt(scene.position);

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
