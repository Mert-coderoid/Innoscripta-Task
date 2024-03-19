import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere, OrbitControls, Html } from '@react-three/drei';
import axios from 'axios';
import earth from '../assets/textures/world.jpg';
import { MathUtils, Vector3 } from 'three';
import { useLoader } from '@react-three/fiber';
import ReadMoreButton from './ReadMoreButton';

const Point = ({ name, url, publishedAt, latitude, longitude, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const position = React.useMemo(() => {
        const phi = MathUtils.degToRad(90 - latitude);
        const theta = MathUtils.degToRad(longitude - 270 );
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
        // axios.get('http://localhost:8080/api/location-articles')
        // process.env.REACT_APP_BASE_URL + '/api/location-articles'
        axios.get(process.env.REACT_APP_BASE_URL + `/api/location-articles`)
            // $articles = Article::whereNotNull('latitude')->whereNotNull('longitude')->select('id', 'title', 'location', 'url', 'published_at', 'latitude', 'longitude')->get();

            .then(response => {
                console.log(response.data);
                const points = response.data.map(article => ({
                    id: article.id,
                    name: article.title,
                    url: article.url,
                    publishedAt: article.published_at,
                    latitude: article.latitude,
                    longitude: article.longitude,
                    onClick: handlePointClick // onClick tanımı burada güncellendi
                }));
                setNewsPoints(points);
                if (points.length > 0) {
                    setSelectedPoint(points[0]);
                }
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
            <div className="sub-globe-globe-info p-3 mb-3">
                {selectedPoint && (
                    <div className="sub-globe-card">
                        <div className="sub-globe-card-body">
                            <h5 className="sub-globe-card-title">{selectedPoint.name}</h5>
                            <p className="sub-globe-card-text">{selectedPoint.publishedAt}</p>
                            <ReadMoreButton url={selectedPoint.url} />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Scene;