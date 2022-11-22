const {
  capitalizeFirstLetter,
  removeSpecialCharacters
} = require("../globalFunctions.js");
let aliases = require("../data/aliases.js").Aliases;
let dex = require("../data/pokedex.js").Pokedex;
let formats = require("../data/formats.js").FormatsData;
const {EmbedBuilder} = require("discord.js");



exports.aliases = ["dt", "data"];

exports.help = {
  name: "dex",
  description: "Gives information on a specific Pokemon.",
  aliases: exports.aliases,
  guildOnly: false,
  usage: " <pokemon>"
};

exports.run = async (client, message, args) => {
  const { embedColor } = client.config; //Import the embed color.
  if (!args.length) {
    message.channel.send("Please actually give a Pokemon.");
    return;
  }

  let name = args.join(" ").toLowerCase();
  //If the name is an alias, replace it with the real name.
  if (aliases[name] != undefined) {
    name = aliases[name].toLowerCase();
  }
  //console.log("https://pokeapi.co/api/v2/pokemon/" + name);
  //console.log(name);
  name = removeSpecialCharacters(name);

  let splitName = name.split(" ");
  if (splitName[0] == "mega") { //Megas
    name = splitName[1] + splitName[0];
    if (splitName[2]) {
      name += splitName[2];
    }
  } 

  else if (splitName[0] == "alolan") { //Alolan Forms
    name = splitName[1] + "alola";
  }

  else { //Things with spaces in their names.
    name = "";
    for (const portion of splitName) {
      name += portion;
    }
  }



  //console.log("Step 1!");
  //console.log("Name: " + name);

  //console.log(name);
 
  let monData = dex[name];
  //console.log(monData);

  if (!monData) {
    //console.log("Dex Number Checker");
    for (const mon in dex) {
      if (dex[mon].num == Number(name)) {
        name = dex[mon].name.toLowerCase();
        name = removeSpecialCharacters(name);
        monData = dex[name];
        break;
      }
    }
  }

  let baseName = name; //This will be the name that gets used for other things down the line.

  if (!monData) {
    message.channel.send("Pokemon not found! :(");
    return;
  }

  if (monData) {
    name = monData.name;

    var typeString = "Type:";
    if (monData.types.length > 1) {
      typeString = "Types:";
    }

    //Abilities
    //console.log("About to make abilities!");
    var abilityString = monData.abilities[0];
    for (var i = 1; i < Object.keys(monData.abilities).length; i++) {

      if (Object.keys(monData.abilities)[i] == 'H') {
        abilityString = abilityString + ", *" + monData.abilities.H + "*";
      }

      else if (Object.keys(monData.abilities)[i] == 'S') {
        abilityString = abilityString + ", **" + monData.abilities.S + "**";
      }

      else {
        abilityString = abilityString + ", " + monData.abilities[i];
      }

      //console.log(abilityString);
    }

    if (abilityString === '' || abilityString === undefined) abilityString = 'None';


    //Image stuff
    let imgPoke = name.toLowerCase();
    
    if (imgPoke.split("-").length - 1 > 1 && !(imgPoke.includes("totem"))) {
      imgPoke = removeAllButFirstHyphen(imgPoke);
    }

    if (imgPoke === "zygarde-10%") {
      imgPoke = "zygarde-10";
    }

    if (imgPoke === "flabébé") {
      imgPoke = "flabebe";
    }

    if (imgPoke.startsWith("farfetch") && imgPoke.endsWith("galar"))  { //Galarian Farfetch'd
      imgPoke = "farfetchd-galar";
    }

    //A bunch of really dumb hard coded error handling.
    if (imgPoke === ("kommo-o") || imgPoke === ("hakamo-o") || imgPoke === ("jangmo-o") || imgPoke === ("type: null") || imgPoke === ("nidoran-m") || imgPoke.startsWith("farfetch") && !imgPoke.endsWith("galar") || imgPoke === ("sirfetch")) {
      imgPoke = removeSpecialCharacters(imgPoke);
    }
    
    //console.log(imgPoke + " before image!");
    let urlExist = await import("url-exist");
    let imageURL = 'https://play.pokemonshowdown.com/sprites/ani/' + imgPoke.replace(" ", "") + ".gif";

    if (!await urlExist.default(imageURL)) imageURL = 'https://play.pokemonshowdown.com/sprites/dex/' + imgPoke.replace(" ", "") + ".png";
    //console.log(imageURL);

    //Base Stats
    let statsString = "";

    for (let i in monData.baseStats) {
      //console.log(i);
      //console.log(Number(monData.baseStats[i]));
      statsString += Number(monData.baseStats[i]);
      //console.log(statsString);
      if (i != "spe") {
        statsString += "/"
      }
    }

    //Tier
    let tierString = formats[baseName].tier;
    if (tierString === undefined) {
      tierString = "Illegal";
    }

    let natDexTierString = formats[baseName].natDexTier;
    if (natDexTierString === undefined) {
      natDexTierString = tierString;
    }

    const monEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle("Your Pokedex Entry")
      .setAuthor({name:"A Pokedex Bot!"})
      .setDescription("These are the stats on: " + capitalizeFirstLetter(monData.name, true))
      .addFields({
        name: typeString,
        value: monData.types.join("/"),
        inline: true
      }, {
        name: "Abilities:",
        value: abilityString,
        inline: true
      }, {
        name: 'Base Stats:',
        value: statsString,
        inline: false
      }, {
        name: "Current Gen Tier:",
        value: tierString,
        inline: true
      }, {
        name: "National Dex Tier:",
        value: natDexTierString,
        inline: true
      }
      )
      .setImage(imageURL)
      .setTimestamp()
      .setFooter({text: "Made by DarkShinyGiratina#0487 using Pokemon Showdown's Data!", iconURL: ("https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/" + name.replace(" ", "-").replace(":","").toLowerCase() + ".png")});

    message.channel.send({embeds: [monEmbed]});
  }
}

function removeAllButFirstHyphen(str) {
  return str.replace(/[-](?!.*[-])/g, "");
}

