import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- NEW CONNECTED PARTICLES SYSTEM ---
const NetworkParticles = ({ count = 100, connectionDistance = 4.5, color = "#00f3ff" }) => {
  const { viewport } = useThree();

  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        vz: (Math.random() - 0.5) * 0.02,
      });
    }
    return temp;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);

  // Buffer for particle positions
  const particlePositions = useMemo(() => new Float32Array(count * 3), [count]);

  // Buffer for lines
  // Estimate max lines (optimization): avg 10 connections per node
  const maxConnections = count * 15;
  const linePositions = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);
  const lineColors = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);

  useFrame((state) => {
    // 1. Update Particle Positions
    const pPositions = pointsRef.current?.geometry.attributes.position.array;
    if (pPositions) {
      for (let i = 0; i < count; i++) {
        let p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce/Wrap
        if (p.x > 15) p.x = -15;
        if (p.x < -15) p.x = 15;
        if (p.y > 15) p.y = -15;
        if (p.y < -15) p.y = 15;

        // Update buffer
        (pPositions as Float32Array)[i * 3] = p.x;
        (pPositions as Float32Array)[i * 3 + 1] = p.y;
        (pPositions as Float32Array)[i * 3 + 2] = p.z;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Update Lines (Connect close particles)
    if (linesGeometryRef.current && pPositions) {
      let lineIndex = 0;
      const pArray = pPositions as Float32Array;

      // Color definitions
      const r1 = 0, g1 = 243 / 255, b1 = 1; // #00f3ff
      const r2 = 188 / 255, g2 = 19 / 255, b2 = 254 / 255; // #bc13fe

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pArray[i * 3] - pArray[j * 3];
          const dy = pArray[i * 3 + 1] - pArray[j * 3 + 1];
          const dz = pArray[i * 3 + 2] - pArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDistance * connectionDistance) {
            if (lineIndex >= maxConnections) break;

            // Set positions
            linePositions[lineIndex * 6] = pArray[i * 3];
            linePositions[lineIndex * 6 + 1] = pArray[i * 3 + 1];
            linePositions[lineIndex * 6 + 2] = pArray[i * 3 + 2];

            linePositions[lineIndex * 6 + 3] = pArray[j * 3];
            linePositions[lineIndex * 6 + 4] = pArray[j * 3 + 1];
            linePositions[lineIndex * 6 + 5] = pArray[j * 3 + 2];

            // Determine color
            const isEven = i % 2 === 0;
            lineColors[lineIndex * 6] = isEven ? r1 : r2;
            lineColors[lineIndex * 6 + 1] = isEven ? g1 : g2;
            lineColors[lineIndex * 6 + 2] = isEven ? b1 : b2;

            lineColors[lineIndex * 6 + 3] = isEven ? r1 : r2;
            lineColors[lineIndex * 6 + 4] = isEven ? g1 : g2;
            lineColors[lineIndex * 6 + 5] = isEven ? b1 : b2;

            lineIndex++;
          }
        }
      }

      linesGeometryRef.current.setDrawRange(0, lineIndex * 2);
      linesGeometryRef.current.attributes.position.needsUpdate = true;
      linesGeometryRef.current.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color={color}
          transparent={true}
          opacity={0.9}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={maxConnections * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={maxConnections * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};

const FloatingShape = ({ position, color, speed = 1, type = "icosahedron" }: { position: [number, number, number], color: string, speed?: number, type?: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.005 * speed;
      mesh.current.rotation.y += 0.01 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        {type === "icosahedron" && <icosahedronGeometry args={[0.6, 0]} />}
        {type === "octahedron" && <octahedronGeometry args={[0.5, 0]} />}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
};

// --- AVATAR PARTICLES ---
const AvatarParticles = () => {
  const count = 300;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    const colors = [];
    const colorPalette = [new THREE.Color('#00f3ff'), new THREE.Color('#bc13fe'), new THREE.Color('#ffffff')];

    for (let i = 0; i < count; i++) {
      const r = 1.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const speed = (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1);

      temp.push({ r, theta, phi, speed });

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors.push(color.r, color.g, color.b);
    }

    return { data: temp, colors: new Float32Array(colors) };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      const { x: mx, y: my } = state.mouse;
      const time = state.clock.getElapsedTime();

      const cx = 5.0;
      const cy = 1.2;
      const cz = 0;

      const distToAvatarScreen = Math.sqrt(Math.pow(mx - 0.8, 2) + Math.pow(my - 0.5, 2));
      const influence = Math.max(0, 1 - distToAvatarScreen);

      for (let i = 0; i < count; i++) {
        const p = particles.data[i];

        let t = p.theta + time * p.speed * 0.2;
        const activeR = p.r + (Math.sin(time * 2 + i) * 0.1);

        const cosPhi = Math.cos(p.phi);
        const sinPhi = Math.sin(p.phi);
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);

        positions[i * 3] = cx + activeR * cosT * cosPhi;
        positions[i * 3 + 1] = cy + activeR * sinPhi;
        positions[i * 3 + 2] = cz + activeR * sinT * cosPhi;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
      mesh.current.rotation.z = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// --- RESTORED SPACE CREATURE ---
export const SpaceCreature = ({ position = [6.5, 1.8, 0], scale = 0.7, isMini = false }: { position?: [number, number, number], scale?: number | [number, number, number], isMini?: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const headMesh = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const clickTime = useRef(0);

  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();
    const { x, y } = state.mouse;

    // --- IDLE ANIMATION ---
    const floatY = Math.sin(time * 2.5) * 0.15;

    // Position handling
    if (!isMini) {
      // Full mode: move towards mouse (parallax)
      const targetX = position[0] + x * 0.8;
      const targetY = position[1] + y * 0.8;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY + floatY, 0.05);
    } else {
      // Mini mode: simple float
      group.current.position.y = position[1] + floatY * 0.5;
    }

    // Rotation
    if (!clicked) {
      if (!isMini) {
        // Face mouse
        const rotX = -y * 0.5;
        const rotY = x * 0.5;
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotX, 0.1);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotY, 0.1);
      } else {
        // Mini mode: Look slightly forward/animated
        group.current.rotation.y = Math.sin(time) * 0.2;
        group.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      }
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(time * 1.5) * 0.05, 0.1);
    }
  });

  const spinStart = useRef(0);
  useFrame((state) => {
    if (clicked && spinStart.current === 0) {
      spinStart.current = state.clock.getElapsedTime();
    }

    if (clicked) {
      const t = state.clock.getElapsedTime() - spinStart.current;
      if (t < 0.8) {
        group.current!.rotation.y += 0.4;
        // Cast scale to number for arithmetic, assumes uniform scale if number provided
        const baseScale = typeof scale === 'number' ? scale : (scale as number[])[0];
        group.current!.scale.y = baseScale - Math.sin(t * Math.PI * 4) * (baseScale * 0.3);
      } else {
        setClicked(false);
        spinStart.current = 0;
        // Reset scale logic handled by prop update usually, but let's reset manually
        const s = scale;
        if (typeof s === 'number') group.current!.scale.setScalar(s);
        else group.current!.scale.set(s[0], s[1], s[2]);
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClicked(true);
  };

  const primaryColor = hovered ? "#bc13fe" : "#00f3ff";

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => { if (!isMini) { document.body.style.cursor = 'pointer'; setHovered(true); } }}
      onPointerOut={() => { if (!isMini) { document.body.style.cursor = 'auto'; setHovered(false); } }}
    >
      {/* HEAD */}
      <mesh ref={headMesh}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          metalness={0.6}
          roughness={0.2}
          emissive={primaryColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* FACE SCREEN */}
      <mesh position={[0, 0, 0.85]}>
        <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* EYES */}
      <group position={[-0.25, 0.1, 1.25]} rotation={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>
      <group position={[0.25, 0.1, 1.25]} rotation={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>

      {/* ANTENNA */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      {/* FLOATING HANDS */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-1.3, -0.5, 0.2]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="white" metalness={0.5} />
        </mesh>
      </Float>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[0, 0.2]}>
        <mesh position={[1.3, -0.5, 0.2]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="white" metalness={0.5} />
        </mesh>
      </Float>

      {/* HEADPHONES/EARS */}
      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

// --- PROFILE AVATAR ---
const ProfileAvatar = () => {
  const imageUrl = "https://cdn.gamma.app/wftu2z4hhtqynln/127853b3a0814efc9536eab933752233/original/Picsart_25-08-26_23-32-11-336.jpg";

  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const group = useRef<THREE.Group>(null);
  const glowRing = useRef<THREE.Mesh>(null);
  const pulsingBorder = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (group.current) {
      const { x, y } = state.mouse;

      const targetRotationX = -y * 0.2;
      const targetRotationY = x * 0.2;

      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.1);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.1);

      group.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }

    if (glowRing.current) {
      glowRing.current.rotation.z -= 0.005;
    }

    if (pulsingBorder.current) {
      const material = pulsingBorder.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;

      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.01;
      pulsingBorder.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={group} position={[5.0, 1.2, 0]} scale={[0.7, 0.7, 0.7]}>
      {/* Outer Glow Ring */}
      <mesh ref={glowRing} position={[0, 0, -0.1]}>
        <ringGeometry args={[1.55, 1.8, 64]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* BRIGHT RIM LIGHT */}
      <mesh position={[0, 0, -0.05]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Pulsing Neon Border */}
      <mesh ref={pulsingBorder} position={[0, 0, 0.01]}>
        <ringGeometry args={[1.5, 1.54, 64]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Background backing */}
      <mesh position={[0, 0, -0.2]} scale={[1.1, 1.1, 1]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.9} />
      </mesh>

      {/* Main Image */}
      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const Scene = () => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 30]} />

      {/* Lights - Adding lights to ensure standard materials render if used */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Background Elements */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* The Connected Network Layer */}
      <NetworkParticles count={130} connectionDistance={5.0} color="#00f3ff" />

      {/* Main Avatar */}
      <ProfileAvatar />
      <AvatarParticles />

      {/* Floating Geometric Shapes */}
      <FloatingShape position={[-4, 3, -1]} color="#00f3ff" type="icosahedron" speed={0.8} />
      <FloatingShape position={[4, -3, -2]} color="#bc13fe" type="icosahedron" speed={1.2} />
      <FloatingShape position={[-3, -3, -1]} color="#0aff0a" type="octahedron" speed={1} />
      <FloatingShape position={[3, 4, -2]} color="#00f3ff" type="octahedron" speed={0.5} />
      <FloatingShape position={[-5, 1, -3]} color="#bc13fe" type="icosahedron" speed={0.7} />
    </>
  );
};