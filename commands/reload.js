exports.aliases = ["r"]; //Aliases
exports.help = {
  name: "reload",
  description: "Reloads a command (Owner only)",
  aliases: exports.aliases,
  usage: " <command name>"
};

exports.run = (client, message, args) => {
  const { dsgid } = client.config;
  if (message.author.id !== dsgid) {
    return message.channel.send("Only the owner can reload my commands!");
  }
  if (!args.length) {
    return message.channel.send("Give me a command to reload!");
  }

  //Get our command (If it's an alias, then we find the alias and make the base command the name)
  const cmdName = args[0].toLowerCase();
  const command = message.client.commands.get(cmdName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

  //If that command doesn't exist, we tell them that.
  if (!command) {
    return message.channel.send(`Command/Alias \`${cmdName}\` doesn't exist!`);
  }

  delete require.cache[require.resolve(`./${command.help.name}.js`)]; //Delete this file from the cache.

  try {
    const newCommand = require(`./${command.help.name}.js`); //Try and get our file back (It's in this directory, the commands directory).
    message.client.commands.set(newCommand.help.name, newCommand); //Reset the command.
  } catch (error) {
    console.error(error); //log the error
    message.channel.send(`There was an error while reloading a command \`${command.help.name}\`:\n\`${error.message}\``);
  }
  
  message.channel.send(`Reloaded ${command.help.name}!`);


}