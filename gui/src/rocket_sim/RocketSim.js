import React, {useEffect, useContext, useMemo, useState, useRef} from "react";
import * as THREE from "three";
import {OBJLoader} from "three/addons/loaders/OBJLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RocketState} from "../Context";

const RocketSim = () => {
    // Get the latest flight data from context.
    const {flight} = useContext(RocketState);
    // Create an instance of the OBJLoader.
    const loader = useMemo(() => new OBJLoader(), []);
    // For displaying the altitude.
    const [altitudeDisplay, setAltitudeDisplay] = useState(0);

    // Refs for three.js objects.
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const rocketRef = useRef();
    const groundRef = useRef();
    const fireParticlesRef = useRef([]); // for the fire particles

    // Keep the latest flight data in a ref so that the animation loop always uses it.
    const flightRef = useRef(flight);
    useEffect(() => {
        flightRef.current = flight;
    }, [flight]);

    useEffect(() => {
        // ---------------------------
        // Scene Setup
        // ---------------------------
        sceneRef.current = new THREE.Scene();

        // Create a starfield background.
        const textureLoader = new THREE.TextureLoader();
        const stars = [];
        for (let i = 0; i < 10000; i++) {
            stars.push(
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000)
            );
        }
        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
        const starsMaterial = new THREE.PointsMaterial({color: 0x888888});
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        sceneRef.current.add(starField);

        // Create the camera.
        cameraRef.current = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        cameraRef.current.position.set(0, 5, 20);

        // Create the renderer.
        rendererRef.current = new THREE.WebGLRenderer({antialias: true});
        rendererRef.current.setSize(1000, 1000);
        const container = document.getElementById("rocket-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(rendererRef.current.domElement);

        // --- Lights ---
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        sceneRef.current.add(ambientLight);
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        sceneRef.current.add(hemisphereLight);

        // --- Create a Tiled Ground Plane ---
        const groundTexture = textureLoader.load("dirt.jpg", (texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.repeat.set(20, 20);
            texture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
        });
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: groundTexture,
            color: 0xffffff,
            roughness: 1
        });
        groundRef.current = new THREE.Mesh(groundGeometry, groundMaterial);
        groundRef.current.rotation.x = -Math.PI / 2;
        sceneRef.current.add(groundRef.current);

        // --- Setup OrbitControls to enable dragging.
        const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // ---------------------------
        // Fire Particle System Parameters
        // ---------------------------
        const fireParams = {
            particleCount: 300,
            particleRadiusRange: {min: 0.1, max: 0.6},
            xVelocityRange: 0.5,
            zVelocityRange: 0.5,
            yVelocityRange: {min: 1, max: 3},
            initialFireY: 20, // Starting Y position relative to the rocket.
            fireResetThreshold: 10 // When a particle reaches this Y, it resets.
        };

        // ---------------------------
        // Load the Rocket Model & Attach Fire Particles
        // ---------------------------
        loader.load(
            "/rocket.obj",
            (object) => {
                rocketRef.current = object;
                // Rotate and scale the model.
                rocketRef.current.rotation.x = Math.PI / 2;
                rocketRef.current.scale.set(0.37, 0.37, 0.37);
                // Initialize the rocket's altitude (using flight data or default to 9).
                const initialAltitude =
                    flightRef.current?.altitude && flightRef.current.altitude > 0
                        ? flightRef.current.altitude
                        : 9;
                rocketRef.current.position.set(0, initialAltitude, 0);
                sceneRef.current.add(rocketRef.current);

                // --- Create a Fire Particle System ---
                const fireGroup = new THREE.Group();
                fireGroup.rotation.x = THREE.MathUtils.degToRad(90);
                const particles = [];
                for (let i = 0; i < fireParams.particleCount; i++) {
                    const radius =
                        Math.random() *
                            (fireParams.particleRadiusRange.max -
                                fireParams.particleRadiusRange.min) +
                        fireParams.particleRadiusRange.min;
                    const geometry = new THREE.SphereGeometry(radius, 8, 8);
                    const colorStart = new THREE.Color(0xffff00); // yellow
                    const colorEnd = new THREE.Color(0xffa500); // orange
                    const color = colorStart.clone().lerp(colorEnd, Math.random());
                    const material = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.8
                    });
                    const particle = new THREE.Mesh(geometry, material);
                    // Start each particle at the specified initial Y (beneath the rocket).
                    particle.position.set(0, fireParams.initialFireY, 0);
                    // Assign a random velocity.
                    particle.velocity = new THREE.Vector3(
                        Math.random() * fireParams.xVelocityRange - fireParams.xVelocityRange / 2,
                        Math.random() *
                            (fireParams.yVelocityRange.max - fireParams.yVelocityRange.min) +
                            fireParams.yVelocityRange.min,
                        Math.random() * fireParams.zVelocityRange - fireParams.zVelocityRange / 2
                    );
                    particles.push(particle);
                    fireGroup.add(particle);
                }
                // Save the fire particles for updating in the animation loop.
                fireParticlesRef.current = particles;
                // Attach the fire particles group to the rocket so it moves along with it.
                rocketRef.current.add(fireGroup);

                // Set the initial OrbitControls target to the rocket's position.
                controls.target.copy(rocketRef.current.position);
            },
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                console.error("Error loading rocket model:", error);
            }
        );

        // ---------------------------
        // Handle Resizing
        // ---------------------------
        const onWindowResize = () => {
            cameraRef.current.aspect = 1;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(1000, 1000);
        };
        window.addEventListener("resize", onWindowResize);

        // ---------------------------
        // Animation Loop
        // ---------------------------
        const animate = () => {
            requestAnimationFrame(animate);
            const time = performance.now() * 0.001;

            if (rocketRef.current) {
                // Smoothly interpolate the rocket's altitude.
                const currentAltitude = rocketRef.current.position.y;
                const targetAltitude =
                    flightRef.current?.altitude > 0 ? flightRef.current.altitude : 9 + time * 2;
                const smoothedAltitude = THREE.MathUtils.lerp(
                    currentAltitude,
                    targetAltitude,
                    0.05
                );
                const deltaY = smoothedAltitude - currentAltitude;
                rocketRef.current.position.y = smoothedAltitude;
                // Adjust the camera's vertical position by the same delta to maintain its relative offset.
                cameraRef.current.position.y += deltaY;

                // Update the ground texture's tiling as the rocket ascends.
                if (groundRef.current.material.map) {
                    const newRepeat = Math.max(20, smoothedAltitude / 5);
                    groundRef.current.material.map.repeat.set(newRepeat, newRepeat);
                }
                // Update OrbitControls target.
                controls.target.copy(rocketRef.current.position);
                setAltitudeDisplay(smoothedAltitude.toFixed(2));

                // -----------------------------------------
                // Update Rocket Roll Based on Flight Data
                // -----------------------------------------
                // Extract horizontal acceleration and velocity data from flight.
                // Default to zero if data are missing.
                const {
                    accelerationX = 0,
                    accelerationY = 0,
                    ecefVelocityX = 0,
                    ecefVelocityY = 0
                } = flightRef.current || {};
                // Compute the magnitude of the horizontal velocity.
                const velocityMagnitude = Math.hypot(ecefVelocityX, ecefVelocityY);
                // Only update roll if the rocket is moving to avoid jitter.
                if (velocityMagnitude > 0.001) {
                    // Calculate angles (in radians) for the acceleration and velocity vectors.
                    const accelerationAngle = Math.atan2(accelerationY, accelerationX);
                    const velocityAngle = Math.atan2(ecefVelocityY, ecefVelocityX);
                    // The target roll is the difference between these angles.
                    const targetRoll = accelerationAngle - velocityAngle;
                    // Smoothly interpolate the current roll (rotation.z) toward the target.
                    rocketRef.current.rotation.z = THREE.MathUtils.lerp(
                        rocketRef.current.rotation.z,
                        targetRoll,
                        0.05
                    );
                }
            }

            // Update the fire particles.
            if (fireParticlesRef.current.length > 0) {
                fireParticlesRef.current.forEach((particle) => {
                    // Move the particle upward.
                    particle.position.add(particle.velocity);
                    // Calculate a normalized progress factor for fading.
                    const t =
                        (particle.position.y - fireParams.initialFireY) /
                        (fireParams.initialFireY - fireParams.fireResetThreshold);
                    // Fade the particle as it rises.
                    particle.material.opacity = 0.8 * (1 - t);
                    // When fully faded, reset the particle.
                    if (t >= 1) {
                        particle.position.set(0, fireParams.initialFireY, 0);
                        particle.velocity.set(
                            Math.random() * fireParams.xVelocityRange -
                                fireParams.xVelocityRange / 2,
                            Math.random() *
                                (fireParams.yVelocityRange.max - fireParams.yVelocityRange.min) +
                                fireParams.yVelocityRange.min,
                            Math.random() * fireParams.zVelocityRange -
                                fireParams.zVelocityRange / 2
                        );
                        particle.material.opacity = 0.8;
                    }
                });
            }

            controls.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        // ---------------------------
        // Cleanup on Component Unmount
        // ---------------------------
        return () => {
            window.removeEventListener("resize", onWindowResize);
            controls.dispose();
            rendererRef.current.dispose();
        };
    }, [loader]);

    // ---------------------------
    // Render: Container & UI Controls
    // ---------------------------
    return (
        <div style={{position: "relative"}}>
            <div id="rocket-container" />
            <div
                className="controls"
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    color: "black",
                    background: "rgba(255,255,255,0.6)",
                    padding: "10px",
                    borderRadius: "5px",
                    fontFamily: "sans-serif"
                }}
            >
                <div>
                    <strong>Altitude:</strong> {altitudeDisplay} m
                </div>
                <div style={{marginTop: "10px", fontSize: "0.8em"}}>
                    <em>Drag on the canvas to orbit the camera.</em>
                </div>
            </div>
        </div>
    );
};

export default RocketSim;
