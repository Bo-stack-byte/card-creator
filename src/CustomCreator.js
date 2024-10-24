import React, { useRef, useState, useEffect } from 'react';
import { basics, options, tamers } from './images';
import { fitTextToWidth, drawBracketedText } from './text';
import banner from './banner.png';
import egg from './egg.png';

// version 0.3. At least as good as the prior one.

function contrastColor(color) {
  if (["red", "blue", "green", "purple", "black"].includes(color)) return "white";
  return "black";
}
function whiteColor(color) {
  if (color == "black") return "black";
  return "white";
}

const starter_text_1 = `  {
    "cardType": "Monster",
    "name": {  "english": "Shield Smasher"  },
    "cardLv": "Lv.6",
    "cardNumber": "CS2-11",
    "color": "Blue/Red",
    "playCost": "12",
    "evolveCondition": 
      [{ "color": "Blue", "cost": "4", "level": "5" },
       { "color": "Red", "cost": "4", "level": "5" } ],
    "evolveEffect": "-",
    "dp": "9000",
    "effect": "＜Vortex＞ \uff1cSecurity Attack +1\uff1e [Your Turn] When this monster attacks a Monster with [Shield] in its name, this Monster gets +5000 DP until the end of your opponent's turn.\\n[Security] Don't die.",
    "securityEffect": "-",
    "attribute": "Data",
    "form": "Ultimate",
    "type": "Sword",

    "aceEffect": "-",
    "block": ["00", "01"],
    "burstEvolve": "-",
    "digiXros": "-",
    "dnaEvolve": "-",
    "rarity": "Rare",
    "specialEvolve": "-"
  }
`
const starter_text_2 = `  {
  "cardType": "Option",
  "name": {      "english": "Double Bind"    },
  "cardNumber": "CS1-13",
  "color": "Yellow/Green",
  "evolveEffect": "-",
  "playCost": "7",
  "attribute": "Rock",
  "effect": "[Main] Suspend 2 of your opponent's Monsters. Then, return 1 of your opponent's suspended Monster to its owner's hand.",
  "securityEffect": "[Security] Activate this card's [Main] effect.",

  "block": ["01"],
  "rarity": "Rare"
  }`;

const starter_text_3 = `   {
    "attribute": "Data",
    "cardNumber": "CS2-17",
    "cardType": "Tamer",
    "color": "Blue/Red",
    "effect": "[Start of Your Main Phase] If you have a monster, gain 1 memory.\\n[Main] By suspending this Tamer, until the end of your opponent's turn, 1 of your opponent's Monsters gains \\"[Start of Your Main Phase] Attack with this Monster\\".",
    "name": {   "english": "Aggressive Amy"   },
    "playCost": "3",
    "securityEffect": "[Security] Play this card without paying the cost.",

    "rarity": "Rare",
    "block": ["00", "01"]
    }`;


const starter_text_4 = `{
  "name": "John",
  "details": {
    "age": 30,
    "city": "New York"
  },
  "items": [
    {"itemName": "Item 1", "value": "Value 1"},
    {"itemName": "Item 2", "value": "Value 2"}
  ]
}`
const starter_text = starter_text_1;

function CustomCreator() {
  const canvasRef = useRef(null);
  const [userImg, setUserImg] = useState(null);
  const [jsonText, setJsonText] = useState(starter_text);
  const [imageUrl, setImageUrl] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [formData, setFormData] = useState({});

  const toggleView = () => {
    setShowJson(!showJson);
  };

  const flattenJson = (obj, parentKey = '', result = {}) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenJson(obj[key], propName, result);
      } else if (Array.isArray(obj[key])) {
        for (let element in obj[key]) {
          flattenJson(obj[key][element], `${propName}.${element}`, result);
          //          result[`${propName}.${element}`] = JSON.stringify(obj[key][element]); // Convert arrays to string for display
        }
        //        result[propName] = JSON.stringify(obj[key]); // Convert arrays to string for display
      } else {
        result[propName] = obj[key];
      }
    }
    console.log(result);
    return result;
  };

  const handleInputChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);

    // Update the JSON text based on form data
    try {
      const updatedJson = JSON.parse(jsonText);
      const keys = key.split('.');
      let current = updatedJson;
      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = value;
        } else {
          current = current[k];
        }
      });

      setJsonText(JSON.stringify(updatedJson, null, 2));
    } catch {
      // json error
    }
  };

  let parsedJson, flattenedJson;
  try {
    parsedJson = JSON.parse(jsonText);
    flattenedJson = flattenJson(parsedJson);
  } catch {
    // json error
  }
  useEffect(() => {
    draw();
  }, [userImg, jsonText]); // Redraw on image or text change

  const loadUserImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setUserImg(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const loadImageFromUrl = () => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // of CORS
    img.src = imageUrl;
    img.onload = () => {
      setUserImg(img);
    };
  };

  const sample = (number) => {

    switch (number) {
      case 1: setJsonText(starter_text_1); break;
      case 2: setJsonText(starter_text_2); break;
      case 3: setJsonText(starter_text_3); break;
    }
    draw();
  }

  const draw = () => {
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch {
      console.log("json error");
      return;
    }
    console.log(json);

    const colors = (json && json.color && json.color.toLowerCase().split("/")) || ["white", "black"]; // todo: better default
    // default to 2 colors
    if (colors.length == 1) colors.push(colors[0]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const leftImg = new Image();
    const rightImg = new Image();
    const eggImg = new Image();

    let t;
    let array = basics;
    if (t = json.cardType) {
      if (t.match(/option/i)) array = options;
      if (t.match(/tamer/i)) array = tamers;
    }

    leftImg.src = array[colors[0]];
    rightImg.src = array[colors[1]];
    eggImg.src = egg;

    leftImg.onload = () => {
      rightImg.onload = () => {
        // Set the canvas dimensions
        canvas.width = 2977;
        canvas.height = 4158;

        //        canvas.width = 296;
        //      canvas.height = 416;

        // drawImage(image,
        // sx, sy, sWidth, sHeight,
        // dx, dy, dWidth, dHeight)

        if (userImg) {
          ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.drawImage(eggImg, 0, 0, canvas.width, canvas.height);

        }


        // Draw the left half of the left image scaled down
        ctx.drawImage(leftImg,
          0, 0, leftImg.width / 2, leftImg.height,
          0, 0, canvas.width / 2, canvas.height);

        // Draw the right half of the right image scaled down
        ctx.drawImage(rightImg,
          rightImg.width / 2, 0, rightImg.width / 2, rightImg.height,
          canvas.width / 2, 0, canvas.width / 2, canvas.height);


        let _dp = parseInt(json.dp);
        let dp_k, dp_m;
        if (isNaN(_dp)) {
        } else {
          dp_k = parseInt(_dp / 1000);
          if (dp_k == 0) dp_k = "";
          dp_m = (_dp % 1000).toString().padStart(3, '0');
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let x = 355;
        //playcost
        const playcost = json.playCost;
        if (playcost && playcost != "-") {
          ctx.font = 'bold 220px Roboto';
          ctx.fillStyle = 'white';
          ctx.fillText(playcost, x, 395);
        }

        if (t.match(/mon/i)) {
          // dp
          ctx.fillStyle = 'black';
          x = 2450;
          ctx.font = 'bold 300px Roboto';
          if (dp_k)
            ctx.fillText(dp_k, x, 380 - 60);
          ctx.font = 'bold 150px Roboto';
          if (dp_k > 9) x += 100;
          if (dp_m)
            ctx.fillText(dp_m, x + 200, 380 - 30);

          // level
          const level = (json.cardLv == "-") ? "Lv.-" : json.cardLv;
          ctx.font = '900 200px "Big Shoulders Text"'
          ctx.fillStyle = whiteColor(colors[0]);
          ctx.fillText(level, 410, 3400);
        }

        let delta_y = 0;
        if (t.match(/option/i)) {
          delta_y -= 100;
        }
        if (t.match(/tamer/i)) {
          delta_y -= 150;
        }

        // name
        const name = json.name.english;
        const maxWidth = 1400;
        const initialFontSize = 240;
        const fontSize = fitTextToWidth(ctx, name, maxWidth, initialFontSize);
        console.log(`fs is ${fontSize}`);
        ctx.font = `bold ${fontSize}px Roboto`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white'; // Text color

        ctx.lineWidth = 30; // Border width
        ctx.strokeStyle = 'black'; // Border color       
        ctx.strokeText(name, 1480, 3380 + delta_y);

        ctx.lineWidth = 10; // Border width
        ctx.fillText(name, 1480, 3380 + delta_y);

        // evo
        const _evos = json.evolveCondition;
        const evo1 = (_evos && _evos.length && _evos[0]);
        if (evo1) {
          const evo_level = `Lv.${evo1.level}`;
          const evo_cost = evo1.cost;
          // TODO: contrasting colors
          ctx.font = `bold 60px Roboto`;
          ctx.fillStyle = contrastColor(colors[0]);
          ctx.fillText(evo_level, 355, 850);
          ctx.font = `bold 170px Roboto`;
          ctx.fillStyle = contrastColor(colors[0]);
          ctx.fillText(evo_cost, 355, 970);
          ctx.strokeText(evo_cost, 355, 970);
        }

        // card number
        const id = json.cardNumber;
        ctx.textAlign = 'right';
        ctx.fillStyle = contrastColor(colors[1]);
        ctx.font = `bold 100px Arial`;
        ctx.fillText(id, 2780, 3400 + delta_y);

        // traits: form, attribute, type
        const traits = ` ${json.form}      |     ${json.attribute}      |      ${json.type}      `;
        ctx.fillStyle = whiteColor(colors[1]);
        ctx.font = `60px Roboto`;
        ctx.fillText(traits, 2780, 3500 + delta_y * 0.9);

        // effect
        ctx.font = `bold 90px Arial`;
        //        ctx.font = `bold 90px Rubik`;
        ctx.textAlign = 'start';
        //ctx.textBaseline = 'alphabetic';
        //ctx.textAlign = 'center'; // Align horizontally to the center
        ctx.textBaseline = 'bottom'; // Align text to the bottom

        const effect = json.effect;
        ctx.fillStyle = 'black';

        if (effect) {
          drawBracketedText(ctx, effect,
            //wrapText(ctx, effect, // + effect, 
            300, 2800 - 400,
            2400, 90);
        }

        // evo effect
        ctx.font = `bold 100px Arial`;
        ctx.font = `bold 90px Roboto`;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'bottom'; // Align text to the bottom

        const evo_effect = json.evolveEffect;
        const sec_effect = (evo_effect != "-") ? evo_effect : json.securityEffect;
        ctx.fillStyle = 'black';
        if (sec_effect) {
          drawBracketedText(ctx, sec_effect,
            //wrapText(ctx, effect, // + effect, 
            900 + delta_y * 2, 3800 + delta_y * 2,
            1600, 90);
        }

      };
    };
  }

  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'exported-image.png';
    link.click();
  };
  /*
            <button onClick={sample(1)}> Sample Monster </button><br />
            <button onClick={sample(2)}> Sample Option </button><br />
            <button onClick={sample(3)}> Sample Tamer </button><br />
  
            */
  console.log(1);
  console.log(flattenedJson);
  return (
    <table>
      <tr>
        <td>
          Ask support or request features over on <a href="https://discord.gg/MWEZYxG2">Discord</a>.
          <br />
          <button onClick={() => sample(1)}> Sample Monster </button><br />
          <button onClick={() => sample(2)}> Sample Option </button><br />
          <button onClick={() => sample(3)}> Sample Tamer </button><br />

        </td>
        <td colSpan={2}>
          <img src={banner} style={{ width: "792px", height: "224px", transform: "rotate(10deg)" }} />
        </td></tr>
      <tr>
        <td><br /><br /><br /></td>
      </tr>
      <tr>
        <td valign={"top"}>
          <button onClick={toggleView}>
            {showJson ? 'Show Key:Value Pairs' : 'Show JSON'}
          </button>
          <br />
          {showJson ? (

            <textarea cols={40} rows={20}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
          ) : (
            <div>
              <table>
                {!flattenedJson ? (<tr><td>Error in JSON, try again </td></tr>
                ) :
                  Object.entries(flattenedJson).map(([key, value]) =>
                    <tr>
                      <td key={key}>
                        <label>{key}: </label>
                      </td>
                      <td>
                        {key.match(/effect/i) ? (
                          <textarea
                            value={formData[key] ?? value}
                            onChange={(e) => handleInputChange(key, e.target.value)} />) : (
                          <input
                            value={formData[key] ?? value}
                            onChange={(e) => handleInputChange(key, e.target.value)} />)
                        }
                      </td>
                    </tr>
                  )}
              </table>
            </div>
          )}

        </td>
        <td valign={"top"}>
          <div>
            <canvas ref={canvasRef}
              style={{
                width: '296px',  // Visually scale the canvas down for easier editing
                height: '416px'  // Visually scale the canvas down for easier editing
              }}>

            </canvas>
          </div>
        </td>
        <td valign={"top"}>

          <input type="file" onChange={loadUserImage} />
          <br />
          --- OR ---
          <br />
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <br />
          <button onClick={loadImageFromUrl}>Load Image from URL</button>
          <br />
          <hr />
          <button onClick={draw}>Force Draw</button>
          <hr />
          <button onClick={handleExport}>Export Image</button>
          <hr />
          <span> Unimplemented: ace, block, burst, digixros, <br />
            multiple evos, dna, rarity, special evolve  <br />
          </span>
        </td>
      </tr>
    </table>

  );
}

export default CustomCreator;

