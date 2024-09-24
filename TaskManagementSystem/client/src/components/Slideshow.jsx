import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import '../assets/styles/Slideshow.css';

const slideImages = [
  '/src/assets/images/about_slideshow/SS-Projects.png',
  '/src/assets/images/about_slideshow/SS-Kanban.png',
  '/src/assets/images/about_slideshow/SS-Calendar.png'
];

const slideCaptions = [
  "Home page listing all projects you are contributing to",
  "Kanban board for managing tasks in a project, categorised by status",
  "Calendar view categorised by date with a day, week, and month view"
];

const Slideshow = () => {
    return (
      <div className="slideshow-container">
        <Slide duration={4000} transitionDuration={1000}>
          {slideImages.map((image, index) => (
            <div className="each-slide" key={index}>
              <div className="image-container">
                <img src={image} alt={`slide-${index}`} />
              </div>
              <div className="caption-container">
                <p><i>{slideCaptions[index]}</i></p>
              </div>
            </div>
          ))}
        </Slide>
      </div>
    );
  };

export default Slideshow;