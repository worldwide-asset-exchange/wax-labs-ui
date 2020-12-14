import {useState, useEffect} from 'react';

export function randomEosioName(length=12){
    var result = '';
    var validCharacters = "12345abcdefghijklmnopqrstuvxyz"
    for(let i = 0; i < length; i++){
        result += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length))
    }
    return result;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function requestedAmountToFloat(requestedAmount, symbol=" WAX"){
    return parseFloat(requestedAmount.slice(0, -symbol.length))
}

export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      breakpoint: 'mobile',
    });
    // Handler to call on window resize
    
  
    useEffect(() => {
      const handleResize = () => {
        // Set window width/height to state
        let width = window.innerWidth;
        let breakpoint = "mobile";
        if (width >= 577 && width <= 767){
            breakpoint = "tablet_mobile_up"
        }
        else if(width >= 768 && width <= 991){
            breakpoint = "tablet_up"
        }
        else if(width >= 992 && width <= 1199) {
            breakpoint = "tablet_landscape_up"
        }
        else if( width >= 1200){
            breakpoint = "desktop"
        }
        setWindowSize({
          breakpoint: breakpoint,
        });
      }
      
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
  
    return windowSize;
}
