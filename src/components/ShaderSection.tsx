'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform float uTime;

  //
  // Simplex noise function
  //
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    float m = max(0.6 - dot(x0,x0), 0.0);
    float m1 = max(0.6 - dot(x1,x1), 0.0);
    float m2 = max(0.6 - dot(x2,x2), 0.0);
    float m3 = max(0.6 - dot(x3,x3), 0.0);
    return 42.0 * (m*m*m*m * dot(p0,x0) + m1*m1*m1*m1 * dot(p1,x1) + m2*m2*m2*m2 * dot(p2,x2) + m3*m3*m3*m3 * dot(p3,x3));
  }

  void main() {
    vUv = uv;
    float displacement = snoise(vec3(position.x * 2.0, position.y * 2.0, uTime * 0.4)) * 0.3;
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform float uTime;

  void main() {
    float r = 0.3 + 0.3 * sin(uTime * 0.5 + vDisplacement * 5.0);
    float g = 0.1 + 0.2 * sin(uTime * 0.3 + vUv.x * 3.0);
    float b = 0.6 + 0.3 * cos(uTime * 0.4 + vDisplacement * 3.0);

    vec3 color = vec3(r, g, b);

    // Fresnel-like edge glow
    float edge = pow(1.0 - abs(vDisplacement) * 2.0, 3.0);
    color += vec3(0.2, 0.1, 0.4) * edge;

    gl_FragColor = vec4(color, 1.0);
  }
`

function ShaderSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime()
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}

export default function ShaderSection() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <ShaderSphere />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-6 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          WebGL Shaders
        </h2>
        <p className="text-gray-300 text-lg max-w-xl mx-auto drop-shadow-lg">
          Custom GLSL shaders rendered with Three.js & React Three Fiber.
          <br />
          Simplex noise displacement with dynamic coloring in real-time.
        </p>
      </div>
    </section>
  )
}
