let channelIndex = 0;
module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // This stuff is specifically for integrands messages only, everything else works only for commands
  let {
    integrandsID,
    dsgid
  } = require("../config.json");

  if ((message.guild && message.guild.id === integrandsID) && message.author.id !== dsgid) { // Integrands Self-Pinging
    const dsg = await client.users.fetch(dsgid);
    const dsgChannel = dsg.dmChannel || (await dsg.createDM());
    dsgChannel.send(`There was a new message in #${message.channel.name}!`);
    const messages = await dsgChannel.messages.fetch({limit:1});
    let deleter = messages.first();
    if (!deleter.author.bot) return;
    deleter.delete();
  }

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


  // If that command doesn't exist, silently exit and do nothing
  if (!command) return;


  if (message.channel.type === 1 && command.help.guildOnly) { //Server Only commands.
    return message.channel.send("This command only works in servers!");
  }

  if ((message.guild && message.guild.id === "619250321138515969") && message.channel.id !== "899763092219637850") {
    return message.channel.send("In this server, commands are only usable in <#899763092219637850>."); //Super spaghetti but idrc it's just for gnsCTF
  }

  let {
    queuePerChannel,
    channelList
  } = require("../config.json");

  //If you receive a message from a new channel, add it to the list.
  if (!channelList.includes(message.channel.id)) {
    channelList[channelIndex] = message.channel.id;
    queuePerChannel[channelIndex] = 0;
    channelIndex++;
  }

  let currentChannelInd = channelList.indexOf(message.channel.id);
  //console.log(channelList);
  //console.log(currentChannelInd);
  //If you receive a message, push it to the queue for that channel
  queuePerChannel[currentChannelInd]++;
  //console.log("Queues: " + queuePerChannel)
  // Run the command



  try {
    //console.log(queuePerChannel[currentChannelInd]);
    //If the queue is filled for that specific channel
    if (queuePerChannel[currentChannelInd] > 1) {
      message.channel.send("Only one command may be run at once!");
      queuePerChannel[currentChannelInd]--;
      return;
    }
    await command.run(client, message, args);
    queuePerChannel[currentChannelInd] = 0;
  } catch (e) {
    message.channel.send("An error has occurred!\nCheck logs for info...");
    console.log(e.stack);
    queuePerChannel[currentChannelInd] = 0; //Clear the queue.
  }

};
