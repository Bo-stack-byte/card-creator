export function fitTextToWidth(ctx, text, maxWidth, initialFontSize) {
  let fontSize = initialFontSize;
  ctx.font = `${fontSize}px Arial`;

  while (ctx.measureText(text).width > maxWidth && fontSize > 0) {
    fontSize -= 1;
    ctx.font = `${fontSize}px Arial`;
  }
  return fontSize;
}

function matchBrackets(array, phrase) {
//  let bob = ["f", "f"];
// can precalc all these regexps
  let match = array.find( str => { let regexp = new RegExp(`^${str}$`, "i"); return phrase.match(regexp) });
  return !!match;
}

const bracketedWords = [
  "Breeding",
  "Hand",
  "Trash",
  "Security", // this should be security as a location...  

  "Digixros.{1,6}",

  "Digivolve",
  "Evolve",
  "DNA Digivolve",
  "DNA Evolve",

  "All Turns",
  "Your Turn",
  "Opponent's Turn",
  "Start of Your Turn",
  "Start of Opponent's Turn",
  "Start of Your Main Phase",
  "Start of Opponent's Main Phase",
  "On Play",
  "On Deletion",
  "When Attacking",
  "When Evolving",
  "End of Attack",
  "End of Opponent's Turn",
  "End of Your Turn",
  "End of All Turns",
  "Counter",
  "Main",
  "Once Per Turn",
  "Twice Per Turn",
];

function splitTextIntoParts(text) {
  //  const words = text.split(/((\[＜).*?(\]＞))/);
  //const words = text.split(/((\[).*?(\]))/);
  const words = text.split(/(\[.*?\])/);
  //  console.log(words);
  let all_words = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes("[")) {
      all_words.push(words[i]);
    } else {
      all_words.push(...words[i].trim().split(" "));
    }
  }
  while (all_words[0] === '') all_words.shift(); // trim empty elements
  return all_words;
}

//x,y is upper left
function drawBlueRectangle(ctx, x, y, width, height, color) {
  //#922969 darker ois lower
  let color0, color1;
  switch (color) {
    case 'purple': color0 = '#720949'; color1 = '#b24999'; break;
    case 'green': color0 = 'darkgreen'; color1 = 'lightgreen'; break;
    case 'bubble': color0 = 'black'; color1 = 'black'; break;
    case 'darkblue': color0 = '#0D1544'; color1 = '#4D5584'; break;


    case 'blue':
    default:
      color0 = 'darkblue'; color1 = 'lightblue';
  }
  // Draw the background rectangle with gradient
  const gradient = ctx.createLinearGradient(x, y - 90, x, y);
  gradient.addColorStop(0, color0);
  gradient.addColorStop(1, color1);
  let d = 0;
  if (color === 'bubble') {
      ctx.globalAlpha = 0.4;
      d = 10;
  }  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - d, y - 90 - 10 - d, width + 10 + 2 * d, height + 2 * d);
  ctx.globalAlpha = 1;
  if (color === 'bubble') {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.strokeRect(x - d, y - 90 - 10 - d, width + 10 + d * 2, height + d * 2 );
  }
  ctx.strokeStyle = '';
  ctx.lineWidth = 0;



}

// x,y is upper left?
function drawDiamondRectangle(ctx, x, y, width, height) {
  // Calculate the half-height and half-width for the triangles
  y -= height;
  const halfHeight = height / 2;
  // Create the gradient from dark brown to medium brown
  const gradient = ctx.createLinearGradient(0, y, 0, y + height);
  gradient.addColorStop(0, '#7E3329'); // Dark brown
  gradient.addColorStop(1, '#C36327'); // Medium brown

  // Begin drawing the shape
  ctx.beginPath();
  ctx.moveTo(x, y + halfHeight); // Start at the left triangle point
  ctx.lineTo(x + halfHeight, y); // Top-left corner
  ctx.lineTo(x + width - halfHeight, y); // Top-right corner
  ctx.lineTo(x + width, y + halfHeight); // Right triangle point
  ctx.lineTo(x + width - halfHeight, y + height); // Bottom-right corner
  ctx.lineTo(x + halfHeight, y + height); // Bottom-left corner
  ctx.closePath(); // Close the path

  // Fill the shape with gradient
  ctx.fillStyle = gradient;
  ctx.fill();

  // Optionally, you can add a border/stroke around the shape
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}


function prepareKeywords(str) {
  return str.replace(/(＜[^＞]*?＞)/g, (match) => {
    return match.replace(/ /g, '_');
  });
}

// drawbracketedtext calls splittextintoparts
export function drawBracketedText(ctx, text, x, y, maxWidth, lineHeight, extra) {
  //console.log("calling with " + text);
  text = prepareKeywords(text);
  const words = splitTextIntoParts(text);

  let line = '';
  let yOffset = y;

  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    //console.log(`is ${testWidth} bigger than ${maxWidth}, added word ${words[n]} to ${line}`);

    if (testWidth > maxWidth && n > 0) {
   //   wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
      lines.push( { ctx, line, x, yOffset, bracketedWords } );
      line = words[n] + ' ';
      yOffset += lineHeight;
    } else {
      line = testLine;
    }
  }

 // wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
  lines.push( { ctx, line, x, yOffset, bracketedWords } );
  yOffset += lineHeight;


  if (extra === 'bubble') {
    let width =  Math.max.apply(Math, lines.map( l => ctx.measureText(l.line).width ));
    drawBlueRectangle(ctx, x - 10, y, width, yOffset - y, 'bubble');

  }
  for (let line of lines) {
    wrapAndDrawText(line.ctx, line.line, line.x, line.yOffset, line.bracketedWords);
  }



  return yOffset + lineHeight;
}

function getColor(phrase) {
  if (phrase.match(/DigiXros/i)) return 'green';
  if (['Hand', 'Trash', 'Breeding', 'Security'].includes(phrase)) return 'purple';
  if (phrase.match(/(Digi|E)volve/i))  return 'darkblue';
  return 'blue';
}

const font = 'Arial'

function wrapAndDrawText(ctx, text, x, y, bracketedWords) {
  let lastX = x;
  text.split(/(\[.*?\])/).forEach(phrase => {
    const cleanPhrase = phrase.replace(/[[\]]/g, '');
    //console.log("clean is " + cleanPhrase);
    if (matchBrackets(bracketedWords, cleanPhrase)) {
//    if (bracketedWords.includes(cleanPhrase)) {
      // Calculate the width of the bracketed text
      ctx.font = `bold 90px ${font}`;
      const phraseWidth = ctx.measureText(cleanPhrase).width;
      //console.log("xxx is " + cleanPhrase);
      let color = getColor(cleanPhrase);
      drawBlueRectangle(ctx, lastX, y, phraseWidth + 10, 100, color);
      // Draw the text in white
      ctx.fillStyle = 'white';
      ctx.fillText(cleanPhrase, lastX + 5, y);
      lastX += phraseWidth + 15;
    } else {
      phrase.split(/(＜.*?＞)/).forEach(word => {
        if (word.includes("＜")) {
          const cleanWord = word.replace(/[＜＞]/g, '  ');
          const wordWidth = ctx.measureText(cleanWord).width;
          drawDiamondRectangle(ctx, lastX, y, wordWidth + 10, 100);
          ctx.font = `bold 90px ${font}`;
          ctx.fillStyle = 'white';
          ctx.fillText(cleanWord, lastX + 5, y);
          lastX += wordWidth + 15;
        } else {

          /*
 
// Create a controlled shadow effect
ctx.shadowColor = 'black';
ctx.shadowBlur = 20; // Adjust for desired thickness
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
 
// Draw the white fill with shadow
ctx.fillStyle = 'white';
ctx.fillText(word, lastX, y);
 
// Reset shadow properties to avoid affecting other elements
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
 
// Optionally, add a thin stroke to define the edges
ctx.lineWidth = 2;
ctx.strokeStyle = 'black';
ctx.strokeText(word, lastX, y);
lastX += ctx.measureText(word).width + ctx.measureText(' ').width;
*/

          // First, draw the black stroke
          ctx.lineWidth = 14; // Thicker stroke
          ctx.strokeStyle = 'black';
          ctx.strokeText(word, lastX, y);

          // Then, draw the white fill with a smaller stroke
          ctx.lineWidth = 2; // Smaller stroke to define the edges
          ctx.fillStyle = 'white';
          ctx.fillText(word, lastX, y);
          ctx.strokeText(word, lastX, y);
          lastX += ctx.measureText(word).width + ctx.measureText(' ').width;



          /*
        ctx.font = `90px ${font}`;
        ctx.fillStyle = 'black';
        ctx.fillText(word, lastX, y);
        lastX += ctx.measureText(word).width + ctx.measureText(' ').width;
        */
        }
      })
    }
  });
}

