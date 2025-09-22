

import { drawDiamondRectangle } from "./text";
import { contrastColor, empty } from "./util";


function rarity_string(str) {
  const rarity = str.toUpperCase();
  if (rarity === "COMMON") return "C";
  if (rarity === "UNCOMMON") return "U";
  if (rarity === "RARE") return "R";
  if (rarity === "SUPER RARE") return "SR";
  if (rarity === "SECRET RARE") return "SEC";
  return rarity.substring(0, 3).toUpperCase();
}

export function CircleAndBlock(ctx, color, rarity, block, x, y) {

    color = color.toLowerCase();
    const mycolor = contrastColor(color);
    rarity = rarity_string(rarity);

    let outlinecolor = "white";
    if (!empty(block)) {
        // if "white" background give this a solid border
        if (color === "white") {
            outlinecolor = "black";
        }
        //console.log(28, "color", color, "mycolor", mycolor, "outlinecolor", outlinecolor);
        drawDiamondRectangle(ctx, x, y + 145, 145, 95, "white", outlinecolor);
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';

        const numberFont = "'HelveticaNeue-CondensedBold', 'Helvetica Neue Condensed Bold', 'Neue Helvetica BQ', 'Helvetica Neue', 'AyarKasone', 'Helvetica'"
        ctx.font = "500 90px " + numberFont;
        ctx.fillText(block, x + 75, y + 100);
    }

    ctx.fillStyle = mycolor;
    if (!empty(rarity)) {
        let radius = 40;
        ctx.beginPath();
        let r_width = rarity.length;
        let left = 2740 - 220;
        let right = 2740 - 220;
        if (r_width > 2) {
            left -= 40;
            right += 0;
        }
        ctx.arc(left, y + radius / 2 + 80, radius, Math.PI / 2, Math.PI * 3 / 2);
        ctx.arc(right, y + radius / 2 + 80, radius, Math.PI * 3 / 2, Math.PI / 2);
        // stroke color same as fill color
        ctx.strokeStyle = mycolor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
        ctx.font = '100 70px "ProhibitionRough", "Big Shoulders Text"'
        //console.log(2350, ctx.strokeStyle, rarity);
        ctx.fillStyle = contrastColor(mycolor); // flip
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rarity, (left + right) / 2, y + radius / 2 + 80);
    }
}
