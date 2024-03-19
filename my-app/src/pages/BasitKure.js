import React, { useMemo } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Vector3, MathUtils } from 'three';
import { Sphere, Html, OrbitControls } from '@react-three/drei';
import earth from './world.jpg'; // Doku yolu

const haberNoktalari = [
  { id: 1, adi: "Haber 1", enlem: 40.7128, boylam: -74.0060 }, // New York
  { id: 2, adi: "Haber 2", enlem: 34.0522, boylam: -118.2437 }, // Los Angeles
  // Daha fazla haber noktası ekleyebilirsiniz...
];

const Nokta = ({ adi, enlem, boylam, onClick }) => {
  const { camera } = useThree();
  const pozisyon = useMemo(() => {
    const phi = MathUtils.degToRad(90 - enlem);
    const theta = MathUtils.degToRad(180 + boylam);
    const radius = 1; // Kürenin yarıçapı
    return new Vector3().setFromSphericalCoords(radius, phi, theta);
  }, [enlem, boylam]);

  return (
    <mesh position={pozisyon} onClick={() => onClick(adi)}>
      <sphereGeometry args={[0.02, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};

const BasitKure = ({ onNoktaClick }) => {
  const texture = useLoader(TextureLoader, earth);

  return (
    <>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial map={texture} />
      </Sphere>
      {haberNoktalari.map(nokta => (
        <Nokta key={nokta.id} {...nokta} onClick={onNoktaClick} />
      ))}
    </>
  );
};

const Sahne = () => {
  const handleNoktaClick = (adi) => {
    // Burada haber detayları için bir modal açabilirsiniz.
  };

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <BasitKure onNoktaClick={handleNoktaClick} />
      <OrbitControls />
    </Canvas>
  );
};

export default Sahne;
