"use client";

import { ContactShadows, Float, OrbitControls, RoundedBox, Sparkles as DreiSparkles, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Texture,
  Vector3,
} from "three";

const PAGE_IMAGES = [
  "/images/showcase/milo-moonbeam/page-01.jpg",
  "/images/showcase/milo-moonbeam/page-02.jpg",
  "/images/showcase/milo-moonbeam/page-03.jpg",
  "/images/showcase/milo-moonbeam/page-04.jpg",
  "/images/showcase/milo-moonbeam/page-05.jpg",
  "/images/showcase/milo-moonbeam/page-06.jpg",
];

function configureTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function StoryBook({ page }: { page: number }) {
  const book = useRef<Group>(null);
  const turningPage = useRef<Group>(null);
  const cover = useRef<Group>(null);
  const lastPage = useRef(page);
  const turnProgress = useRef(1);
  const textures = useTexture(PAGE_IMAGES).map(configureTexture);
  const pair = (page % 3) * 2;
  const previousPair = (lastPage.current % 3) * 2;

  useEffect(() => {
    if (lastPage.current !== page) {
      turnProgress.current = 0;
    }
  }, [page]);

  useFrame((state, delta) => {
    if (!book.current || !turningPage.current || !cover.current) return;

    const t = state.clock.getElapsedTime();
    book.current.rotation.y = MathUtils.lerp(book.current.rotation.y, -0.1 + state.pointer.x * 0.08, 0.035);
    book.current.rotation.x = MathUtils.lerp(book.current.rotation.x, -0.22 + state.pointer.y * 0.025, 0.035);
    book.current.position.y = Math.sin(t * 0.65) * 0.035 - 0.12;
    cover.current.rotation.z = MathUtils.damp(cover.current.rotation.z, -2.92, 4, delta);

    if (turnProgress.current < 1) {
      turnProgress.current = Math.min(1, turnProgress.current + delta * 1.18);
      const eased = 0.5 - Math.cos(turnProgress.current * Math.PI) / 2;
      turningPage.current.rotation.z = -Math.PI * eased;
      turningPage.current.rotation.x = Math.sin(eased * Math.PI) * -0.16;
      if (turnProgress.current >= 1) {
        lastPage.current = page;
        turningPage.current.rotation.z = 0;
        turningPage.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={book} rotation={[-0.22, -0.1, -0.03]} scale={0.88}>
      <RoundedBox args={[4.65, 0.16, 3.28]} radius={0.1} smoothness={5} position={[0, -0.12, 0]} castShadow>
        <meshStandardMaterial color="#4A2545" roughness={0.38} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[4.48, 0.2, 3.12]} radius={0.08} smoothness={4} position={[0, 0.01, 0]} castShadow>
        <meshStandardMaterial color="#f7e8c5" roughness={0.82} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.08, 0.18, 3.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.45} metalness={0.18} />
      </mesh>

      <mesh position={[-1.12, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.18, 3.02, 24, 24]} />
        <meshStandardMaterial map={textures[pair]} roughness={0.9} side={DoubleSide} />
      </mesh>
      <mesh position={[1.12, 0.135, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.18, 3.02, 24, 24]} />
        <meshStandardMaterial map={textures[pair + 1]} roughness={0.9} side={DoubleSide} />
      </mesh>

      <group ref={turningPage} position={[0.02, 0.16, 0]}>
        <mesh position={[1.08, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[2.14, 3, 20, 20]} />
          <meshStandardMaterial map={textures[previousPair + 1]} roughness={0.88} side={DoubleSide} />
        </mesh>
      </group>

      <group ref={cover} position={[-0.02, -0.04, 0]} rotation={[0, 0, -2.92]}>
        <RoundedBox args={[2.3, 0.12, 3.28]} radius={0.08} smoothness={4} position={[1.16, 0, 0]} castShadow>
          <meshStandardMaterial color="#4A2545" roughness={0.38} />
        </RoundedBox>
      </group>

      <PaperWorld />
    </group>
  );
}

function PaperWorld() {
  const world = useRef<Group>(null);
  const moon = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (world.current) world.current.rotation.y = Math.sin(t * 0.32) * 0.055;
    if (moon.current) moon.current.position.y = 1.7 + Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={world} position={[0, 0.2, 0]}>
      <mesh ref={moon} position={[0.7, 1.7, -0.32]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#fff1b8" emissive="#e8b85d" emissiveIntensity={1.4} roughness={0.8} />
      </mesh>
      <mesh position={[-0.55, 0.88, -0.34]} rotation={[0, 0.18, 0]} castShadow>
        <coneGeometry args={[0.48, 1.55, 7]} />
        <meshStandardMaterial color="#78b78e" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-1.22, 0.67, 0.15]} rotation={[0, -0.16, 0]} castShadow>
        <coneGeometry args={[0.34, 1.08, 6]} />
        <meshStandardMaterial color="#5f9875" roughness={0.86} flatShading />
      </mesh>
      <mesh position={[1.26, 0.62, 0.28]} rotation={[0, 0.18, 0]} castShadow>
        <coneGeometry args={[0.38, 1.15, 7]} />
        <meshStandardMaterial color="#93c9a2" roughness={0.86} flatShading />
      </mesh>
      <mesh position={[0.03, 0.48, 0.36]} castShadow>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#f4815c" roughness={0.72} flatShading />
      </mesh>
      <DreiSparkles count={42} scale={[4.2, 2.8, 3.4]} size={2.6} speed={0.32} color="#f4d48b" opacity={0.78} />
    </group>
  );
}

function FloatingMotifs() {
  const group = useRef<Group>(null);
  const positions = useMemo(
    () => [
      new Vector3(-3.3, 1.8, -1.2),
      new Vector3(3.2, 1.4, -0.5),
      new Vector3(-2.8, -1.45, 0.3),
      new Vector3(2.7, -1.55, -0.6),
    ],
    [],
  );

  useFrame((state) => {
    if (group.current) group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.18) * 0.025;
  });

  return (
    <group ref={group}>
      {positions.map((position, index) => (
        <Float key={index} speed={0.8 + index * 0.12} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={position} rotation={[0.2, index, 0.4]}>
            {index % 2 === 0 ? <octahedronGeometry args={[0.11, 0]} /> : <tetrahedronGeometry args={[0.13, 0]} />}
            <meshStandardMaterial
              color={index % 2 === 0 ? "#f4815c" : "#a8ddb5"}
              emissive={index % 2 === 0 ? "#c95c3b" : "#5a9b71"}
              emissiveIntensity={0.42}
              roughness={0.48}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Scene({ page }: { page: number }) {
  const background = useMemo(() => new Color("#fff4df"), []);
  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={["#fff4df", 7.5, 12]} />
      <ambientLight intensity={1.45} />
      <hemisphereLight args={["#fff7da", "#4a2545", 1.25]} />
      <directionalLight position={[-4, 7, 4]} intensity={3.2} color="#fff2cf" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[3.5, 2.8, 1]} intensity={12} distance={7} color="#f4815c" />
      <pointLight position={[-3.5, 1.2, -1]} intensity={7} distance={6} color="#a8ddb5" />
      <Suspense fallback={null}>
        <StoryBook page={page} />
      </Suspense>
      <FloatingMotifs />
      <ContactShadows position={[0, -1.15, 0]} opacity={0.34} scale={7.5} blur={2.6} far={4.2} color="#4a2545" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.25}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-0.35}
        maxAzimuthAngle={0.35}
        dampingFactor={0.055}
        enableDamping
      />
    </>
  );
}

export function StorybookUniverse({ page, active }: { page: number; active: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.4]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 2.9, 7.25], fov: 37, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={<div className="storybook-canvas-fallback" />}
    >
      <Scene page={page} />
    </Canvas>
  );
}
