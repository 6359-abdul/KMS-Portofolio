import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Profile Avatar (Image) ---
const ProfileAvatar = () => {
    const texture = useTexture('profile.jpg');

    return (
        <group position={[7.0, 2.5, 0]} scale={[0.7, 0.7, 0.7]}>
            <mesh position={[0, 0, -0.1]}>
                <ringGeometry args={[1.55, 1.8, 64]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[1.5, 1.54, 64]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
            </mesh>
            <mesh>
                <circleGeometry args={[1.5, 64]} />
                <meshBasicMaterial map={texture} />
            </mesh>
        </group>
    );
};

// --- 3D Space Objects (Space Rocks) ---
const SpaceRock = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const rotationSpeed = useMemo(() => [
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
    ], []);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.x += rotationSpeed[0];
            mesh.current.rotation.y += rotationSpeed[1];
            mesh.current.rotation.z += rotationSpeed[2];
        }
    });

    return (
        <group position={position} scale={scale}>
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={mesh}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#8b5a2b" roughness={0.9} metalness={0.1} flatShading />
                </mesh>
            </Float>
        </group>
    );
};

// --- Solar System Component ---
const Planet = ({ distance, size, color, speed, offset, ring }: { distance: number, size: number, color: string, speed: number, offset: number, ring?: boolean }) => {
    const group = useRef<THREE.Group>(null);
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * speed + offset;
        }
        if (mesh.current) {
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={group}>
            {/* Orbit Path Visual */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
                <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* Planet Group at Distance */}
            <group position={[distance, 0, 0]}>
                <mesh ref={mesh}>
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial color={color} roughness={0.7} />
                </mesh>

                {/* Visual Ring for Saturn-like planets */}
                {ring && (
                    <mesh rotation={[Math.PI / 3, 0, 0]}>
                        <ringGeometry args={[size * 1.4, size * 2, 64]} />
                        <meshBasicMaterial color={color} opacity={0.6} transparent side={THREE.DoubleSide} />
                    </mesh>
                )}
            </group>
        </group>
    );
};

const SolarSystem = () => {
    // Config based on the uploaded image (Mercury -> Neptune ish) without labels
    // Sun is static center
    return (
        <group rotation={[0.4, 0, 0.3]}> {/* Tilt diagonally (X and Z axis) */}
            {/* Sun */}
            <mesh>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial color="#ffaa00" />
                <pointLight intensity={2} distance={50} color="#ffaa00" />
            </mesh>
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial color="#ff5500" transparent opacity={0.3} />
            </mesh>

            {/* Planets: Compacted Distances */}
            <Planet distance={2.5} size={0.3} color="#dbceca" speed={0.8} offset={0} /> {/* Mercury */}
            <Planet distance={3.5} size={0.5} color="#e3bb76" speed={0.6} offset={2} /> {/* Venus */}
            <Planet distance={5.0} size={0.6} color="#2f6a69" speed={0.5} offset={4} /> {/* Earth */}
            <Planet distance={6.5} size={0.4} color="#c1440e" speed={0.4} offset={1} /> {/* Mars */}
            <Planet distance={9.0} size={1.4} color="#d8ca9d" speed={0.2} offset={5} /> {/* Jupiter */}
            <Planet distance={12.0} size={1.2} color="#ead6b8" speed={0.15} offset={3} ring /> {/* Saturn */}
            <Planet distance={15.0} size={1.0} color="#d1e7e7" speed={0.1} offset={6} /> {/* Uranus */}
            <Planet distance={18.0} size={1.0} color="#5b5ddf" speed={0.08} offset={0} /> {/* Neptune */}
        </group>
    );
};

// --- Nano Robot Component (Restored) ---
const NanoRobot = ({ position, scale = 1, speed = 1, type = 'orbit' }: { position: [number, number, number], scale?: number, speed?: number, type?: 'orbit' | 'figure8' | 'wander' }) => {
    const group = useRef<THREE.Group>(null);
    const randomOffset = useMemo(() => Math.random() * 100, []);

    // Floating & Flying Animation
    useFrame((state) => {
        if (group.current) {
            const t = state.clock.elapsedTime * speed + randomOffset;
            let x = 0, y = 0, z = 0;

            if (type === 'figure8') {
                const a = 6;
                x = position[0] + (a * Math.cos(t)) / (1 + Math.sin(t) ** 2);
                y = position[1] + Math.sin(t * 1.5) * 1.5;
                z = position[2] + (a * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
            } else if (type === 'wander') {
                x = position[0] + Math.sin(t) * 5 + Math.sin(t * 0.3) * 2;
                y = position[1] + Math.cos(t * 0.5) * 3 + Math.sin(t * 0.2);
                z = position[2] + Math.sin(t * 0.7) * 4 + Math.cos(t * 0.4) * 2;
            } else {
                x = position[0] + Math.sin(t) * 5;
                z = position[2] + Math.cos(t) * 5;
                y = position[1] + Math.sin(t * 0.5) * 2;
            }

            group.current.position.set(x, y, z);

            const delta = 0.1;
            const nextT = t + delta;
            let nx = 0, ny = 0, nz = 0;
            if (type === 'figure8') {
                const a = 6;
                nx = position[0] + (a * Math.cos(nextT)) / (1 + Math.sin(nextT) ** 2);
                ny = position[1] + Math.sin(nextT * 1.5) * 1.5;
                nz = position[2] + (a * Math.sin(nextT) * Math.cos(nextT)) / (1 + Math.sin(nextT) ** 2);
            } else if (type === 'wander') {
                nx = position[0] + Math.sin(nextT) * 5 + Math.sin(nextT * 0.3) * 2;
                ny = position[1] + Math.cos(nextT * 0.5) * 3 + Math.sin(nextT * 0.2);
                nz = position[2] + Math.sin(nextT * 0.7) * 4 + Math.cos(nextT * 0.4) * 2;
            } else {
                nx = position[0] + Math.sin(nextT) * 5;
                nz = position[2] + Math.cos(nextT) * 5;
                ny = position[1] + Math.sin(nextT * 0.5) * 2;
            }
            group.current.lookAt(nx, ny, nz);
        }
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.3,
        metalness: 0.1,
        emissive: "#ffffff",
        emissiveIntensity: 0.8
    });

    const internalScale = scale * 0.4;

    return (
        <group ref={group} scale={internalScale}>
            <Float speed={4} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[0, 0.8, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.55, 64, 64]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, 0, 0.35]} scale={[1, 0.8, 1]}>
                        <sphereGeometry args={[0.35, 32, 32]} />
                        <meshStandardMaterial color="#000000" roughness={0.0} metalness={0.8} />
                    </mesh>
                    <group position={[0, 0.05, 0.65]} rotation={[-0.2, 0, 0]}>
                        <mesh position={[-0.15, 0, 0]} rotation={[0, 0.1, 0]} scale={[1, 1.5, 1]}>
                            <capsuleGeometry args={[0.06, 0.12, 4, 8]} />
                            <meshBasicMaterial color="#00f3ff" toneMapped={false} />
                        </mesh>
                        <mesh position={[0.15, 0, 0]} rotation={[0, -0.1, 0]} scale={[1, 1.5, 1]}>
                            <capsuleGeometry args={[0.06, 0.12, 4, 8]} />
                            <meshBasicMaterial color="#00f3ff" toneMapped={false} />
                        </mesh>
                    </group>
                    <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                </group>
                <group position={[0, 0, 0]}>
                    <mesh position={[0, 0.1, 0]}>
                        <sphereGeometry args={[0.35, 32, 32]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, 0.15, 0.3]}>
                        <circleGeometry args={[0.08, 32]} />
                        <meshBasicMaterial color="#00f3ff" />
                    </mesh>
                    <mesh position={[0, -0.25, 0]}>
                        <cylinderGeometry args={[0.15, 0.25, 0.2, 32]} />
                        <meshStandardMaterial color="#222" roughness={0.5} />
                    </mesh>
                </group>
                <group position={[-0.45, 0.1, 0]}>
                    <mesh rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                </group>
                <group position={[0.45, 0.1, 0]}>
                    <mesh rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                </group>
                <group position={[-0.2, -0.5, 0]}>
                    <mesh>
                        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, -0.25, 0]}>
                        <coneGeometry args={[0.1, 0.3, 16]} />
                        <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} />
                    </mesh>
                </group>
                <group position={[0.2, -0.5, 0]}>
                    <mesh>
                        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
                        <primitive object={whiteMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, -0.25, 0]}>
                        <coneGeometry args={[0.1, 0.3, 16]} />
                        <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

// --- Rocket Component (Corrected) ---
const Rocket = ({ position, scale = 1, speed = 1, type = 'orbit' }: { position: [number, number, number], scale?: number, speed?: number, type?: 'orbit' | 'figure8' | 'wander' }) => {
    const group = useRef<THREE.Group>(null);
    const randomOffset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if (group.current) {
            const t = state.clock.elapsedTime * speed + randomOffset;
            let x = 0, y = 0, z = 0;

            if (type === 'figure8') {
                const a = 6;
                x = position[0] + (a * Math.cos(t)) / (1 + Math.sin(t) ** 2);
                y = position[1] + Math.sin(t * 1.5) * 1.5;
                z = position[2] + (a * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
            } else if (type === 'wander') {
                x = position[0] + Math.sin(t) * 5 + Math.sin(t * 0.3) * 2;
                y = position[1] + Math.cos(t * 0.5) * 3 + Math.sin(t * 0.2);
                z = position[2] + Math.sin(t * 0.7) * 4 + Math.cos(t * 0.4) * 2;
            } else {
                x = position[0] + Math.sin(t) * 5;
                z = position[2] + Math.cos(t) * 5;
                y = position[1] + Math.sin(t * 0.5) * 2;
            }
            group.current.position.set(x, y, z);

            const nextT = t + 0.1;
            let nx = 0, ny = 0, nz = 0;
            if (type === 'figure8') {
                const a = 6;
                nx = position[0] + (a * Math.cos(nextT)) / (1 + Math.sin(nextT) ** 2);
                ny = position[1] + Math.sin(nextT * 1.5) * 1.5;
                nz = position[2] + (a * Math.sin(nextT) * Math.cos(nextT)) / (1 + Math.sin(nextT) ** 2);
            } else if (type === 'wander') {
                nx = position[0] + Math.sin(nextT) * 5 + Math.sin(nextT * 0.3) * 2;
                ny = position[1] + Math.cos(nextT * 0.5) * 3 + Math.sin(nextT * 0.2);
                nz = position[2] + Math.sin(nextT * 0.7) * 4 + Math.cos(nextT * 0.4) * 2;
            } else {
                nx = position[0] + Math.sin(nextT) * 5;
                nz = position[2] + Math.cos(nextT) * 5;
                ny = position[1] + Math.sin(nextT * 0.5) * 2;
            }
            group.current.lookAt(nx, ny, nz);
        }
    });

    const internalScale = scale * 0.5;

    return (
        <group ref={group} scale={internalScale}>
            <group rotation={[Math.PI / 2, 0, 0]}>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.3, 0.4, 1.2, 32]} />
                    <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <coneGeometry args={[0.3, 0.4, 32]} />
                    <meshStandardMaterial color="#ff2a2a" roughness={0.2} />
                </mesh>
                <group position={[0, -0.4, 0]}>
                    <mesh position={[0.4, 0, 0]} rotation={[0, 0, -0.5]}>
                        <boxGeometry args={[0.3, 0.6, 0.05]} />
                        <meshStandardMaterial color="#aa0000" />
                    </mesh>
                    <mesh position={[-0.4, 0, 0]} rotation={[0, 0, 0.5]}>
                        <boxGeometry args={[0.3, 0.6, 0.05]} />
                        <meshStandardMaterial color="#aa0000" />
                    </mesh>
                    <mesh position={[0, 0, 0.4]} rotation={[0.5, 0, 0]}>
                        <boxGeometry args={[0.05, 0.6, 0.3]} />
                        <meshStandardMaterial color="#aa0000" />
                    </mesh>
                    <mesh position={[0, 0, -0.4]} rotation={[-0.5, 0, 0]}>
                        <boxGeometry args={[0.05, 0.6, 0.3]} />
                        <meshStandardMaterial color="#aa0000" />
                    </mesh>
                </group>

                {/* Window FIXED: rotation moved to mesh */}
                <mesh position={[0, 0.2, 0.33]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
                    <meshBasicMaterial color="#00f3ff" />
                </mesh>
                <mesh position={[0, 0.2, 0.31]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.04, 32]} />
                    <meshStandardMaterial color="#555" />
                </mesh>

                <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.2, 0.5, 16]} />
                    <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
                </mesh>
            </group>
        </group>
    );
};

// --- Dynamic Connecting Particles (Moving Particulars) ---
const MovingParticles = () => {
    const mesh = useRef<THREE.Points>(null);
    const count = 2000;

    // Generate a simple circle texture
    const circleTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            context.beginPath();
            context.arc(16, 16, 14, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, [count]);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * 0.05;
            mesh.current.rotation.x += delta * 0.02;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.25} // Slightly larger to account for circle texture transparency
                color="#00f3ff"
                map={circleTexture}
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// --- Main Galaxy Scene ---
export const GalaxyScene = () => {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 10, 50]} />

            {/* Dynamic Lighting */}
            <ambientLight intensity={0.4} /> {/* Increased ambient for planets */}
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#bc13fe" />
            <spotLight position={[0, 5, 5]} intensity={1} angle={0.5} penumbra={1} color="white" />

            {/* Sun Light (Center) */}
            <pointLight position={[0, 0, 0]} intensity={3} color="#ffaa00" distance={50} />

            {/* BACKGROUND EFFECTS */}
            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
            <MovingParticles />

            {/* SOLAR SYSTEM (Centerpiece) */}
            {/* Moved Up slightly as requested */}
            <group position={[0, 1, -10]} scale={0.55}>
                <SolarSystem />
            </group>

            {/* 3D SPACE OBJECTS (Small Rocks) */}
            <SpaceRock position={[-8, 6, -10]} scale={0.5} />
            <SpaceRock position={[10, -5, -12]} scale={0.7} />
            <SpaceRock position={[-12, -8, -15]} scale={0.4} />
            <SpaceRock position={[5, 10, -20]} scale={0.6} />
            <SpaceRock position={[0, -8, -8]} scale={0.5} />
            <SpaceRock position={[15, 5, -15]} scale={0.8} />
            <SpaceRock position={[-15, 2, -10]} scale={0.3} />
            <SpaceRock position={[8, -8, -5]} scale={0.4} />

            {/* ROCKETS AND ROBOTS (Traffic) */}
            {/* Rocket Squad */}
            <Rocket position={[0, 0, -4]} scale={0.8} speed={0.5} type="figure8" />
            <Rocket position={[2, 2, 0]} scale={0.6} speed={0.7} type="wander" />

            {/* Robot Squad (Restored) */}
            <NanoRobot position={[-2, 0, -2]} scale={0.7} speed={0.4} type="wander" />
            <NanoRobot position={[3, -2, -5]} scale={0.8} speed={0.3} type="orbit" />

            {/* Avatar (Image) - Top Right (Moved down slightly) */}
            <ProfileAvatar />
        </>
    );
};
