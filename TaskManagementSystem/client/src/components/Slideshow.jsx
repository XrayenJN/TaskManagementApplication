import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const slideImages = [
  '/src/assets/images/about_slideshow/image1.jpg',
  '/src/assets/images/about_slideshow/image2.jpg',
  '/src/assets/images/about_slideshow/image3.jpg'
];

const Slideshow = () => {
    return (
      <div className="slideshow-container">
        <Slide duration={5000} transitionDuration={1000}>
          {slideImages.map((image, index) => (
            <div className="each-slide" key={index}>
              <div className="image-container">
                <img src={image} alt={`slide-${index}`} />
              </div>
            </div>
          ))}
        </Slide>
      </div>
    );
  };

export default Slideshow;