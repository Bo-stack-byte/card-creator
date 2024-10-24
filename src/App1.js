// src/App.js
import React, { useRef, useState } from 'react';

//import bluecommon from './frames/COMMONBLUE.png';
import bluecommon from './frames/test.png';
console.log(2222);


function App() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const background = bluecommon;


      const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = bluecommon; // Use the imported image here
    img.onload = () => {
      canvas.width = 296; // Set canvas width
      canvas.height = 416; // Set canvas height
      ctx.drawImage(img, 0, 0, 296, 416); // Draw image with specified dimensions
      ctx.font = '30px Arial'; // Customize your font here
      ctx.fillText(text, 50, 50); // Customize your text position here
    };
  };


    
    /*
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = background;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.font = '30px Arial'; // Customize your font here
      ctx.fillText(text, 50, 50); // Customize your text position here
    };
  };*/

  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'exported-image.png';
    link.click();
  };
// <!--	<input        type="text"        value={text}        onChange={(e) => setText(e.target.value)}        placeholder="Enter text"      /> -->

    let _json =   {
    "aceEffect": "-",
    "attribute": "Data",
    "block": ["00", "01"],
    "burstEvolve": "-",
    "cardLv": "Lv.6",
    "cardNumber": "CS2-11",
    "cardType": "Monster",
    "color": "Blue/Red",
    "digiXros": "-",
      "evolveCondition": [{ "color": "Blue", "cost": "4", "level": "5" },
                          { "color": "Red", "cost": "4", "level": "5" }
                         ],
    "evolveEffect": "-",
    "dnaEvolve": "-",
    "dp": "9000",
    "effect": "[Your Turn] When this monster attacks a Monster with [Shield] in its name, this Monster gets +5000 DP until the end of your opponent's turn.",
    "form": "Ultimate",
    "id": "CS2-11",
    "name": {
      "english": "Shield Smasher"
    },
    "playCost": "12",
    "rarity": "Rare",
    "restrictions": {
      "chinese": "Unrestricted",
      "english": "Unrestricted",
      "japanese": "Unrestricted",
      "korean": "Unrestricted"
    },
    "securityEffect": "-",
    "specialEvolve": "-",
    "type": "Sword",
    "version": "Normal"
    };
    let json = JSON.stringify(_json);


  return (
    <div>
      <canvas ref={canvasRef} width={296} height={416}></canvas>
	<textarea cols={30} rows={40}
        value={json}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={draw}>Draw</button>
      <button onClick={handleExport}>Export Image</button>
    </div>
  );

}

export default App;
