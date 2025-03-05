import React from "react";
import PropTypes from "prop-types";
import Button from './assets/Button'; 
import ChickenRunner from "./assets/ChickenRunner";

// Youtube Embed Component
const YoutubeEmbed = ({ embedId }) => (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
);

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired
};

const App = () => {
    return (
        <div 
        className="flex flex-col w-screen h-screen justify-center items-center space-y-10"
        style={{ 
          backgroundImage: 'url("/Chicken_Runner_BG_1.png")',
          backgroundSize: 'cover', // Ensures the image covers the entire background
          backgroundPosition: 'center', // Centers the image
          backgroundRepeat: 'no-repeat', // Prevents repeating
          width: '100vw', // Ensure it spans the full viewport width
          height: '100vh' // Ensure it spans the full viewport height
        }}
      >
            {/* <h1> <b> CHICKEN RUNNER </b> </h1> */}
            {/* <p> Catch the chicken! </p> */}
            {/* Wrapping the Button in a centering container */}
            <div className="flex justify-center w-full">
                {/* Uncomment the buttons if needed */}
                {/* 
                <Button url='https://pbozzuti.github.io/' text='lets play bruh' />
                <Button url= 'https://egggame.org/' text = 'egg me bruh' />
                <Button url='https://classic.minecraft.net/' text='minecraft but bad' />
                */}
            </div>

            {/* Chicken Runner Game */}
            <ChickenRunner />
        </div>
    );
};

export default App;