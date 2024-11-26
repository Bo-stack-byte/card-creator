
const font = 'Asimov'
let px = 80;  const g_width = 2800
const size = `${px}px`; 




export function fitTextToWidth(ctx, text, maxWidth, initialFontSize) {
  const font = 'Asimov'

  let fontSize = initialFontSize;
  ctx.font = `${fontSize}px ${font}`;

  while (ctx.measureText(text).width > maxWidth && fontSize > 0) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${font}`;
  }
  return fontSize;
}

function matchMagic(array, phrase) {
  // can precalc all these regexps
  let match = array.find(str => { let regexp = new RegExp(`^${str}$`, "i"); return phrase.match(regexp) });
  return !!match;
}

const magicWords = [
  "Breeding",
  "Hand",
  "Trash",
  "Security",

  "Digixros.{1,6}",

  "(DNA )?(Digi|E)volve",

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
]

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
function drawColoredRectangle(ctx, x, y, width, height, color) {
  //#922969 darker ois lower
  let color0, color1;
  switch (color) {
    case 'purple': color0 = '#720949'; color1 = '#b24999'; break;
    case 'green': color0 = 'darkgreen'; color1 = 'lightgreen'; break;
    case 'bubble': color0 = 'black'; color1 = 'black'; break;
    case 'darkblue': color0 = '#0D1544'; color1 = '#4D5584'; break;


    case 'blue':
    default:
      color0 = 'darkblue'; color1 = '#8080ff';
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
    ctx.strokeRect(x - d, y - 90 - 10 - d, width + 10 + d * 2, height + d * 2);
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

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function replaceBracketsAtStart(line) {
  // Tokenize the input string to handle both types of brackets
  const tokens = line.match(/(\[[^\]]+\]|＜[^＞]+＞|\S+)/g);
  if (!tokens) return line;


  let replacing = true;

  for (let i = 0; i < tokens.length; i++) {
    // Check for brackets at the start of the line
    if (replacing && tokens[i].startsWith('[') && tokens[i].endsWith(']')) {
      tokens[i] = tokens[i].replace('[', '⟦').replace(']', '⟧');
    } else if (replacing && tokens[i].startsWith('＜') && tokens[i].endsWith('＞')) {
      // don't replace <＞ yet
    } else {
      // Stop replacing when a token is not in brackets
      replacing = false;
    }
  }

  return tokens.join(' ');
}


function prepareKeywords(str, replaceBrackets) {
  const output = (replaceBrackets ?
    replaceBracketsAtStart(str) :
    str);

  return output.replace(/(＜[^＞]*?＞)/g, (match) => {
    return match.replace(/ /g, '_');
  });
}

// ⟦ ⟧
// MAIN ENTRY POINT
// drawbracketedtext calls splittextintoparts

// if "extra" is "bubble", put text in black bubble
// if "extra" is "effect", then put all [bracketed text] at start of line in blue
export function drawBracketedText(ctx, text, x, y, maxWidth, lineHeight, extra) {
  //console.log("calling with " + text);
  let yOffset = y;
  let lines = [];
  text = text.replaceAll(/</ig,"＜").replaceAll(/>/ig,"＞");

  const paragraphs = text.split("\n");
  for (let p = 0; p < paragraphs.length; p++) {
    let graf = prepareKeywords(paragraphs[p], extra.startsWith("effect"));

    const words = splitTextIntoParts(graf);

    let line = '';


    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      //console.log(`is ${testWidth} bigger than ${maxWidth}, added word ${words[n]} to ${line}`);

      if (testWidth > maxWidth && n > 0) {
        //   wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
        lines.push({ ctx, line, x, yOffset });
        line = words[n] + ' ';
        yOffset += lineHeight;
      } else {
        line = testLine;
      }
    }

    // wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
    lines.push({ ctx, line, x, yOffset });
    yOffset += lineHeight;


    if (extra === 'bubble') {
      let width = Math.max.apply(Math, lines.map(l => ctx.measureText(l.line).width));
      drawColoredRectangle(ctx, x - 10, y, width, yOffset - y, 'bubble');
    }
  }
  for (let line of lines) {
    wrapAndDrawText(line.ctx, line.line, line.x, line.yOffset, extra);
  }



  return yOffset + lineHeight;

}

function getColor(phrase) {
  if (phrase.match(/DigiXros/i)) return 'green';
  if (['Hand', 'Trash', 'Breeding', 'Security', 'Once Per Turn', 'Twice Per Turn'].includes(phrase)) return 'purple';
  if (phrase.match(/(Digi|E)volve/i)) return 'darkblue';
  return 'blue';
}

function wrapAndDrawText(ctx, text, x, y, style) {
  let cardWidth = 4400; // shouldn't be hard-coded
  let lastX = x;
  let scale;
  // ⟦⟧ 
  text.split(/([[⟦].*?[\]⟧])/).forEach(phrase => {
    const cleanPhrase = phrase.replace(/[⟦[\]⟧]/gi, "");

    if (
      (phrase.startsWith("⟦") && phrase.endsWith("⟧")) ||
      (phrase.startsWith("[") && phrase.endsWith("]") && matchMagic(magicWords, cleanPhrase))
    ) {
      // Calculate the width of the bracketed text
      ctx.font = ` ${size} ${font}`;
      const phraseWidth = ctx.measureText(cleanPhrase).width;
      let color = getColor(cleanPhrase);
      drawColoredRectangle(ctx, lastX, y + 20, phraseWidth + 10, 80, color);
      // Draw the text in white on special background
      ctx.fillStyle = 'white';
      ctx.fillText(cleanPhrase, lastX + 5, y);
      lastX += phraseWidth + 15;
    } else {
      phrase.split(/(＜.*?＞)/).forEach(word => {
        if (word.includes("＜")) {
          const cleanWord = word.replace(/[＜＞_]/g, '  ');
          ctx.font = ` ${size} ${font}`;
          const wordWidth = ctx.measureText(cleanWord).width;
          scale = (cardWidth - lastX) / wordWidth; 
          if (scale > 1) scale = 1; 
          drawDiamondRectangle(ctx, lastX, y, scale * wordWidth + 10, px + 10);
          ctx.save();
          ctx.scale(scale, 1);
          ctx.font = ` ${size} ${font}`;
          ctx.fillStyle = 'white'; // white on colored background
          
          ctx.fillText(cleanWord, lastX  / scale + 5, y);
          lastX += scale * wordWidth + 15;
          ctx.restore();
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

          let width = 12;
          let stroke = 'black';
          let fill = 'white';
          if (style.includes("option")) {
            width = 3;
            stroke = 'white';
            fill = 'black';
          }

         // First, draw the black stroke
         ctx.lineWidth = width; // Thicker stroke
          ctx.strokeStyle = stroke;
          ctx.strokeText(word, lastX, y);


          ctx.lineWidth = 2; // Smaller stroke to define the edges
          ctx.fillStyle = fill;
          ctx.fillText(word, lastX, y);
     //     ctx.strokeText(word, lastX, y);
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

