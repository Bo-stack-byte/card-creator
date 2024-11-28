

// shared from the tcg-sim project, un-typescripted

let all_colors = ["Red", "Blue", "Yellow", "Green", "Black", "Purpler", "White", "Rainbow"]; //rainbow unsupported right now

function split_colors(input) {
    if (input.includes("/")) {
        return input.split("/").map( c => c.trim());
    }
    if (input.includes(" or ")) {
        return input.split(" or ").map( c => c.trim());
    }
    return input;
}

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
        "rule": "",
        "securityEffect": "-",
        "specialEvolve": "-",
        "digiXros": "",
        "dnaEvolve": "-",
        "burstEvolve": "-",
        "rarity": ""
      
    }

    let m;
    let mode = "main";
    for (let line of lines) {
        if (line.length < 2) continue;
        // [ʟᴠ] [ᴛᴀᴍᴇʀ] [ᴏᴘᴛɪᴏɴ]
        //      ʟᴠ.4 — Armored Cat — CS1-18
        console.log(41, line);
        //                            1              2   3          4    5
        if ((m = line.match(/^\s*[Lʟ][ᴠv].(\d+)(.*)/i))) {
            console.log(55,m);
            json.cardLv = "Lv." + parseInt(m[1]);

            let fields = line.split(/ [-—] /i);
            console.log(47, fields);
            json.name.english = fields[1] && fields[1].trim();
            if (fields[2]) json.cardNumber = fields[2].trim();

            //\s+[-—]\s+(.*)(\s+[-—]\s+(.*)-(\d+))?/i))) {
            console.error(m);
            //            json.name.english = m[2];
            //          json.cardType = "Monster"; // assumed
            //        json.cardNumber = m[4] + "-" + m[5];
            //      json.cardLv = "Lv." + parseInt(m[1]);
        } else if (( m = line.match(/(.*)\[(option|ᴏᴘᴛɪᴏɴ|tamer|ᴛᴀᴍᴇʀ)\]/))) {
            if (m[2].match(/option|ᴏᴘᴛɪᴏɴ/i)) {
                json.cardType = "Option";
            }
            if (m[2].match(/tamer|ᴛᴀᴍᴇʀ/i)) {
                json.cardType = "Tamer";
            }
            if (m[1].trim().length > 2) {
                json.name.english = m[1].trim();
            }
        } else if ((m = line.match(/^\s*(\[Rule.*:.*)/))) {
        // [Rule] Trait: Has the [Insectoid] type.
            json.rule = m[1];
        } else if ((m = line.match(/^\s*\[(.*?)\|(.*?)\|(.*?)\]( \[(.*)\])?/))) {
            // [Champion | Data | Shield] [Yel.]
            json.form = m[1].trim();
            json.attribute = m[2].trim();
            json.type = m[3].trim();
            json.color = abbr_parse_color(m[4]);
            //  Purple/Red | Lv.6
        } else if ((m = line.match(/^\s*(.*)\s+\|\s+Lv.(\d+)/i))) {
            json.cardLv = "Lv." + m[2];
            json.color = m[1];
            // level 3 yellow/purple
        } else if ((m = line.match(/^\s*(level|Lv\.|lvl)\s*(\d+)\s+(.*)/i))) {
            json.cardLv = "Lv." + m[2];
            json.color = m[3];
        } else if ((m = line.match(/^\s*Play cost: (\d+)\s*\|\s*(E|Digi)volution: (\d+) from Lv.(\d+) \[(.*)\]/))) {
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
        } else if ((m = line.match(/^(Play|Use)?.?cost\s*:\s*(\d+)/i))) {
            json.playCost = parseInt(m[2]);
        } else if ((m = line.match(/^\[(.*)\]$/i))) {
            json.color = abbr_parse_color(m[1]);
        } else if ((m = line.match(/(.*)\|(.*)\|(.*)/))) {
            json.form = m[1].trim();
            json.attribute = m[2].trim();
            json.type = m[3].trim().split("/");
    //            Digivolve: 1 from lvl 2 yellow/purple
    //  Digivolution cost: 5 from purple or red Lv.5
        } else if ((m = line.match(/Digivol(\w*)\s*(cost)?\s*:\s*(\d+) from (.*)/i))) {
            let evo = {}
            evo.cost = parseInt(m[3]);
            let from = m[4];
            let n;
            if ((n = from.match(/(.*)(Level|lvl|Lv\.)\s*(\d+)(.*)/i))) {
                evo.level = parseInt(n[3]);                
                from = n[1] + n[4];
            }
            console.log(109, "XXX");
            let colors = split_colors(from);
            console.log(110, colors);
            for (let c of colors) {
                evo.color = c;
                json.evolveCondition.push(evo);
                evo = {...evo}; // make copy

            }
        } else if ((m = line.match(/inherited effect\s*:\s*(.*)/i))) {
            console.log(124, m);
            json.evolveEffect += m[1] + "\n";
        } else if ((m = line.match(/inherited effect\s*:\s*(.*)/i))) {
            console.log(124, m);
            json.evolveEffect += m[1] + "\n";

        } else if ((m = line.match(/Inherited Effect/))) {
            mode = "inherited";
            // translator format
        } else {
            console.log(69, line);
            // first line assumed to be plain name if no match
            if (!json.name.english) {
                json.name.english = line.trim();
            } else if (mode === "inherited") {
                json.evolveEffect += line + "\n";
            } else {
                json.effect += line + "\n";
            }
        }
    }
    return JSON.stringify(json, null, 2);
    //   return JSON.stringify(json);
}