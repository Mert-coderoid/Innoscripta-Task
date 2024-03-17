import React, { useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere, OrbitControls } from '@react-three/drei';
import axios from 'axios';
import earth from '../assets/textures/world.jpg'; // Doku yolu
import { MathUtils, Vector3 } from 'three';
import { useMemo } from 'react';
import { Html } from '@react-three/drei';


const Point = ({ name, latitude, longitude }) => {
    const [hovered, setHovered] = useState(false);

    const position = React.useMemo(() => {
        const phi = MathUtils.degToRad(90 - latitude);
        const theta = MathUtils.degToRad(longitude + 90);
        return new Vector3().setFromSphericalCoords(1, phi, theta);
    }, [latitude, longitude]);

    return (
        <mesh
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshBasicMaterial color={hovered ? 'blue' : 'red'} />
            {hovered && (
                <Html scaleFactor={10} style={{ pointerEvents: 'none', zIndex: 99999 }}>
                    <div className="tooltip text-white bg-black p-2 rounded" style={{ position: 'absolute', top: 0, left: 0 }}>
                        {name}
                    </div>
                </Html>
            )}
        </mesh>
    );
};

const SimpleGlobe = ({ onPointClick, newsPoints }) => {
    const texture = useLoader(TextureLoader, earth);

    return (
        <>
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial map={texture} />
            </Sphere>
            {newsPoints.map(point => (
                <Point key={point.id} {...point} onClick={onPointClick} />
            ))}
        </>
    );
}

const Scene = () => {
    const [newsPoints, setNewsPoints] = useState([]);
    const cameraRef = React.useRef();
    
    useEffect(() => {
        axios.get('http://localhost:8080/api/location-articles')
            .then(response => {
                console.log('News points:', response.data);
                const points = response.data.map(article => ({
                    id: article.id,
                    name: article.title,
                    latitude: parseFloat(article.latitude),
                    longitude: parseFloat(article.longitude),
                    onClick: () => console.log(`${article.title} clicked`)
                }));
                setNewsPoints(points);
            })
            .catch(error => console.error('Error fetching news points:', error));
    }, []);

    const handlePointClick = (name) => {
        console.log(`${name} clicked`);
    };

    return (
        <div className="globe-container">
            <Canvas className="globe-canvas" camera={{ position: [0, 0, 2.5] }} ref={cameraRef}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SimpleGlobe onPointClick={handlePointClick} newsPoints={newsPoints} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene;
