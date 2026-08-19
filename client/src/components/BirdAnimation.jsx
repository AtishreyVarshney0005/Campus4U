import React, { useEffect, useState } from 'react';
import '../styles/bird.css';

const BirdAnimation = () => {
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    // Create multiple birds
    const birdArray = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 2,
      randomLeft: Math.random() * 30, // Random position within left 30% of screen
    }));
    setBirds(birdArray);
  }, []);

  return (
    <div className="bird-container">
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="bird"
          style={{
            left: `${bird.randomLeft}%`,
            animationDelay: `${bird.delay}s`,
          }}
        >
          <span className="bird-emoji">🐦</span>
        </div>
      ))}
    </div>
  );
};

export default BirdAnimation;
