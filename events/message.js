let serverIndex = 0;
module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // If that command doesn't exist, silently exit and do nothing
  if (!command) return;

  let {
    queuePerServer,
    serverList
  } = require("../config.json");

  //If you receive a message from a new server, add it to the list.
  if (!serverList.includes(message.guild.id)) {
    serverList[serverIndex] = message.guild.id;
    queuePerServer[serverIndex] = 0;
    serverIndex++;
  }

  let currentServInd = serverList.indexOf(message.guild.id);
  console.log(serverList);
  console.log(currentServInd);
  //If you receive a message, push it to the queue for that server
  queuePerServer[currentServInd]++;
  console.log("Queues: " + queuePerServer)
  // Run the command



  try {
    console.log(queuePerServer[currentServInd]);
    //If the queue is filled for that specific server
    if (queuePerServer[currentServInd] > 1) {
      message.channel.send("Only one command may be run at once!");
      queuePerServer[currentServInd]--;
      return;
    }
    await command.run(client, message, args);
    queuePerServer[currentServInd] = 0;
  } catch (e) {
    message.channel.send("An error has occurred!\nCheck logs for info...");
    console.log(e.stack);
    queuePerServer[currentServInd] = 0; //Clear the queue.
  }

};
