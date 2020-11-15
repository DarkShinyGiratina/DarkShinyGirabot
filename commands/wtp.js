let dex = require("../data/pokedex.js");
dex = dex.Pokedex;
const Discord = require("discord.js");
let http = require("http");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const {
  removeSpecialCharacters
} = require("../globalFunctions.js")
exports.run = async (client, message, args) => {
  if (!args.length) {
    message.channel.send("Please enter the amount of times you want to run the game! (1-25)");
    return;
  }
  let numTimes = args[0];
  if (numTimes < 1) return;
  if (numTimes > 25) {
    message.channel.send("That's too many... 25 is the max!");
    return;
  }

  let stopNext = false;

  let pointsTally = [];
  let listOfPlayers = [];
  let lastIndex = 0;
  let imageURL = "";

  message.channel.send("The game will begin in 3 seconds!");
  await timer(3000);
  for (let i = 0; i < numTimes; i++) {
    if (stopNext) return;
    message.channel.send("This is round " + (i+1) + "! Get ready...");
    let mon = Object.keys(dex)[Math.floor(Math.random() * Object.keys(dex).length)];
    //Certain Pokemon don't exist (they have negative numbers!) Also, ignore forms.
    while (dex[mon].num < 0 || dex[mon].baseSpecies) { 
      mon = Object.keys(dex)[Math.floor(Math.random() * Object.keys(dex).length)];
    }

    let name = dex[mon].name,
      correctAnswer = dex[mon].name;
    
    let imgPoke = name.toLowerCase();

    if (imgPoke.split("-").length - 1 > 1 && !(imgPoke.includes("totem"))) {
      imgPoke = removeAllButFirstHyphen(imgPoke);
    }

    if (imgPoke === "zygarde-10%") {
      imgPoke = "zygarde-10";
    }

    if (imgPoke.startsWith("farfetch") && imgPoke.endsWith("galar"))  { //Galarian Farfetch'd
      imgPoke = "farfetchd-galar";
    }

    //A bunch of really dumb hard coded error handling.
    if (imgPoke === ("kommo-o") || imgPoke === ("hakamo-o") || imgPoke === ("jangmo-o") || imgPoke === ("type: null") || imgPoke === ("nidoran-m") || imgPoke.startsWith("farfetch") && !imgPoke.endsWith("galar") || imgPoke === ("sirfetch")) {
      imgPoke = removeSpecialCharacters(imgPoke);
    }

    console.log(imgPoke + " before image!");
    let randomNum = Math.floor(Math.random()*64); //Random number from 0-64.
    imageURL = randomNum === 0 ? 'https://play.pokemonshowdown.com/sprites/xyani-shiny/' + imgPoke.replace(" ", "") + ".gif" : 'https://play.pokemonshowdown.com/sprites/xyani/' + imgPoke.replace(" ", "") + ".gif"; //Shiny!
    if (!UrlExists(imageURL) || imgPoke.includes("totem")) {
      console.log("Get out of here, pesky bad formatting and totems!");
      i--;
      continue; //This should get rid of anything breaking...
    }
    const monEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Guess The Pokemon!")
      .setDescription("Type your guess to answer :) (Don't use any spaces, and make sure the formatting is like Pokemon Showdown!)")
      .setImage(imageURL)
      .setTimestamp()
      .setFooter("Made by DarkShinyGiratina#0487 using Pokemon Showdown's Data!", ("https://cdn.rawgit.com/msikma/pokesprite/master/pokemon-gen8/regular/" + name.replace(" ", "-").replace(":", "").toLowerCase() + ".png"));

    message.channel.send(monEmbed)

    function filter(m) {
      if (m.author.bot) return false; //No bots here.
      let properStart = (m.content.startsWith(""));
      let guess = m.content.substring(0, correctAnswer.length); //Get the correct amount of characters.
      //Some typo handling: If two characters are swapped, you're good.
      let swapped = isEqualIfSwapped(guess.toLowerCase(), correctAnswer.toLowerCase());
      let isOneOff = oneOff(guess.toLowerCase(), correctAnswer.toLowerCase());
      console.log(isOneOff);
      return properStart && (swapped || (!swapped && isOneOff)); //Either two letters are swapped, or one letter is incorrect.
    }

    function stopFilter(m) {
      return m.content.startsWith("!stop");
    }

    message.channel.awaitMessages(stopFilter, {
        max: 1,
        time: 10000,
        errors: ['time']
      })
      .then(collected => {
        //console.log(collected);
        message.channel.send("Stopping after this one...");
        stopNext = true;
      })
      .catch(collected => {
        //console.log(collected);
      });

    message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
      })
      .then(collected => {
        //console.log(collected);
        message.channel.send(`${collected.first().author} got the correct answer! [` + correctAnswer + "]");
        if (!listOfPlayers.includes(collected.first().author.id)) {
          listOfPlayers[lastIndex] = collected.first().author.id;
          pointsTally[lastIndex] = 1;
          lastIndex++;
        } else {
          pointsTally[listOfPlayers.indexOf(collected.first().author.id)]++;
        }
        console.log(pointsTally);
        console.log(listOfPlayers);
      })
      .catch(collected => {
        //console.log(collected);
        message.channel.send('Nobody guessed it... It was ' + correctAnswer + "!");
      });



    await timer(10000);
    console.log("Timer finished.");
  }
  console.log(listOfPlayers + " after round.");
  console.log(pointsTally);
  let maxInds = findMaxIndex(pointsTally);
  console.log(maxInds);
  if (pointsTally[0] == undefined) {
    message.channel.send("Nobody won! Well, nobody got any points at all...");
    return;
  }

  let leaderboard = "";
  for (let i = 0; i < listOfPlayers.length; i++) {
    leaderboard += "<@" + listOfPlayers[i] + "> with " + pointsTally[i] + " point";
    if (pointsTally[i] > 1) {
      leaderboard += "s";
    }
    leaderboard += "\n";
  }

  if (maxInds.length == 1) {
    let pointOrPoints = "points";
    if (pointsTally[maxInds[0]] == 1) {
      pointOrPoints = "point";
    }
    message.channel.send("The round is done! Congratulations to <@" + listOfPlayers[maxInds[0]] + ">! You won with " +
      pointsTally[maxInds[0]] + " " + pointOrPoints + "!");
  }

  else {
    let winnerString = "";
    for (let i = 0; i < maxInds.length; i++) {
      if (i == maxInds.length-1) {
        winnerString += "and ";
      }
      winnerString += "<@" + listOfPlayers[maxInds[i]] + ">";
      if (maxInds.length == 2 && i < maxInds.length-1) {
        winnerString += " ";
      }
      else if (i < maxInds.length-1) {
        winnerString += ", ";
      }
    }
    let pointOrPoints = "points";
    if (pointsTally[maxInds[0]] == 1) {
      pointOrPoints = "point";
    }
    message.channel.send("The round is done! Congratulations to our winners: " + winnerString + " with " + pointsTally[maxInds[0]] + " " + pointOrPoints + " each!");
  }

  //Sort the arrays in tandem
  var inTandem = [];
  for (let i = 0; i < listOfPlayers.length; i++) { //Turn the arrays into a combined object.
    inTandem.push({"id": listOfPlayers[i], "points": pointsTally[i]});
  }

  inTandem.sort(function(a, b) {
    return ((a.points < b.points) ? 1 : ((a.points == b.points) ? 0 : -1));
  });

  for (let i = 0; i < inTandem.length; i++) { //Split up the object back into the arrays.
    listOfPlayers[i] = inTandem[i].id;
    pointsTally[i] = inTandem[i].points;
}

  const leaderboardEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Leaderboard")
      .setDescription("This is the leaderboard for WTP!")
      .setTimestamp()
      .setFooter("Made by DarkShinyGiratina#0487 using Pokemon Showdown's Data!");
  
  let boardString = "";
  for (let i = 0; i < listOfPlayers.length; i++) {
    let pointOrPoints = pointsTally[i] == 1 ? " point" : " points"; //Ternary operator to determine point or points.
    boardString += "<@" + listOfPlayers[i] + "> with " + pointsTally[i] + pointOrPoints;
    if (i < listOfPlayers.length-1) {
      boardString += "\n";
    }
  }

  leaderboardEmbed.addField("The Board", boardString, false);

  message.channel.send(leaderboardEmbed);

}

function removeAllButFirstHyphen(str) {
  return str.replace(/[-](?!.*[-])/g, "");
}

function findMaxIndex(arr) {
  let tempMax = arr[0];
  let maxIndices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == tempMax) { //Add on to the 'tie' array.
      maxIndices.push(i);
    }
    else if (arr[i] > tempMax) { //Reset, and add new max.
      maxIndices = [];
      maxIndices.push(i);
    }
  }
  return maxIndices;
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
}

async function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function isEqualIfSwapped(a, b) {
  if (a === b) {
    return true; //If they're the same, they're the same.
  }
  var chars = a.split(""); //Get all the characters in A.
  for (var i = 0; i < chars.length-1; i++) { //Check every character with all the ones it can be swapped with.
    for (var j = i+1; j < chars.length; j++) { //We don't need to start at 0, since we'd have already checked those pairs.
      var currentArr = [...chars]; //Copy the character array
      var temp = currentArr[i]; //A basic swap here.
      currentArr[i] = currentArr[j];
      currentArr[j] = temp; 
      if (currentArr.join("") === b) {
        return true; //If they're the same, two characters are swapped, return true.
      }
    }
  }
  return false; //Two characters are not swapped.
}

function oneOff(a, b) {
  if (a.length !== b.length) return false; //They have to be the same length.
  let mistakes = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) mistakes++;
    if (mistakes > 1) return false;
  }
  return true;
}
