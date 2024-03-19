import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere, OrbitControls, Html } from '@react-three/drei';
import axios from 'axios';
import earth from '../assets/textures/world.jpg';
import { MathUtils, Vector3 } from 'three';
import { useLoader } from '@react-three/fiber';

const Point = ({ name, latitude, longitude, onClick }) => {
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
            onClick={() => onClick(name)} // Buradaki değişiklik
        >
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshBasicMaterial color={hovered ? 'blue' : 'red'} />
            {hovered && (
                <Html scaleFactor={10}>
                    <div className="tooltip text-white bg-black p-2 rounded">
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
            {newsPoints.map((point) => (
                <Point key={point.id} {...point} onClick={onPointClick} />
            ))}
        </>
    );
};

const Scene = () => {
    const [newsPoints, setNewsPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    
    useEffect(() => {
        axios.get('http://localhost:8080/api/location-articles')
            .then(response => {
                const points = response.data.map(article => ({
                    id: article.id,
                    name: article.title,
                    latitude: parseFloat(article.latitude),
                    longitude: parseFloat(article.longitude),
                    onClick: handlePointClick // onClick tanımı burada güncellendi
                }));
                setNewsPoints(points);
            })
            .catch(error => console.error(error));
    }, []);

    const handlePointClick = (name) => {
        const point = newsPoints.find(p => p.name === name);
        setSelectedPoint(point);
    };

    return (
        <div className="globe-container">
            <Canvas className="globe-canvas" camera={{ position: [0, 0, 2.5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SimpleGlobe onPointClick={handlePointClick} newsPoints={newsPoints} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
            <div className="globe-info">
                {selectedPoint && (
                    <div>
                        <h2>{selectedPoint.name}</h2>
                        <p>Latitude: {selectedPoint.latitude}</p>
                        <p>Longitude: {selectedPoint.longitude}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scene;
