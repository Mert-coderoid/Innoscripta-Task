import React from 'react';

const ReadMoreButton = ({ url }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="read-more-button">
      Daha Fazla
    </a>
  );
};

export default ReadMoreButton;
