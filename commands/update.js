const https = require("https");
const fs = require('fs');
exports.run = (client, message, args) => {
  if (message.author.id !== '130071963291877376') {
    message.channel.send("Only the owner can do this command!");
    return;
  }
  message.channel.send("Updating data... This will take a while!");
  let dexFile = fs.createWriteStream("./data/pokedex.ts");
  const dexRequire = https.get("https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/pokedex.ts", function(response) {
    console.log(response);
    response.pipe(dexFile);
  });

  let aliasFile = fs.createWriteStream("./data/aliases.ts");
  const aliasRequire = https.get("https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/aliases.ts", function(response) {
    response.pipe(aliasFile);
  });
  message.channel.send("Update complete!");
}
