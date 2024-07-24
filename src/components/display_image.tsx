'use client'
import React, { useEffect, useState } from 'react';
import { getImageURL } from './get_images'; // Adjust the path as needed

type ImageDisplayProps = {
  imagePath: string;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imagePath }) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageURL = async () => {
      try {
        const url = await getImageURL(imagePath);
        setImageURL(url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchImageURL();
  }, [imagePath]);

  if (!imageURL) {
    return <p> Loading image...</p>;
  }

  return <img src={imageURL} alt="Firebase Image" />;
};

export default ImageDisplay;