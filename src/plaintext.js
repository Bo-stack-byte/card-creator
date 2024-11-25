

// shared from the tcg-sim project, un-typescripted

let all_colors = ["Red", "Blue", "Yellow", "Green", "Black", "Purpler", "White", "Rainbow"]; //rainbow unsupported right now
function abbr_parse_color(text) {
    let ret = [];
    // gets colors in wrong order, sorry
    for (let c of all_colors) {
        let abbr = c.substring(0, 3);
        if (text.includes(abbr)) {
            ret.push(c);
        }
    }
    return ret.join("/");
}

export const enterPlainText = (lines) => {
    let json = {
        "cardType": "Monster",
        "cardLv": "",
        "cardNumber": "",
        "color": "",
        "evolveCondition": [],
        "evolveEffect": "",
        "dp": "-",
        "effect": "",
        "name": { "english": "" },
        "playCost": "-",
        "form": "",
        "attribute": "",
        "type": "",
    }

    let m;
    let mode = "main";
    for (let line of lines) {
        if (line.length < 2) continue;
        // [ʟᴠ] [ᴛᴀᴍᴇʀ] [ᴏᴘᴛɪᴏɴ]
        //      ʟᴠ.4 — Armored Cat — CS1-18
        console.log(41, line);
        if ((m = line.match(/ʟᴠ.(\d+) [-—] (.*) [-—] (.*)-(\d+)/))) {
            console.error(m);
            json.name.english = m[2];
            json.cardType = "Monster"; // assumed
            json.cardNumber = m[3] + "-" + m[4];
            json.cardLv = "Lv." + parseInt(m[1]);
        } else if ((m = line.match(/\[(.*?)\|(.*?)\|(.*?)\] \[(.*)\]/))) {
            // [Champion | Data | Shield] [Yel.]
            json.form = m[1].trim();
            json.attribute = m[2].trim();
            json.type = m[3].trim().split("/");
            json.color = abbr_parse_color(m[4]);
        } else if ((m = line.match(/Play cost: (\d+)\s*\|\s*(E|Digi)volution: (\d+) from Lv.(\d+) \[(.*)\]/))) {
            // Play cost: (6) | Evolution: (3) from Lv.(3) [Yel.]
            json.playCost = parseInt(m[1]);
            let evo = {}
            evo.level = parseInt(m[4]);
            evo.cost = parseInt(m[3]);
            evo.color = abbr_parse_color(m[5])
            json.evolveCondition.push(evo);
        } else if ((m = line.match(/^\s*(\d+) DP/))) {
            //      6000 DP
            json.dp = parseInt(m[1]);
        } else if ((m = line.match(/Inherited Effect/))) {
                mode = "inherited";
        } else {
            console.log(69,line);
            if (mode === "inherited") {
                 json.evolveEffect += line + "\n";
             } else {
                 json.effect += line + "\n";
             }
        } 
    }
    return JSON.stringify(json, null, 2);
 //   return JSON.stringify(json);
}