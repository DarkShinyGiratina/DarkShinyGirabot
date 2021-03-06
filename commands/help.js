const Discord = require("discord.js");
exports.aliases = ["h", "halp"];

exports.help = {
  name: "help",
  description: "Gives help information!",
  aliases: exports.aliases,
  guildOnly: false,
  usage: " <command name>"
}

exports.run = (client, message, args) => {
  const { embedColor } = client.config; //Import the embed color.
  const { commands } = client; //client.commands
  const { prefix } = client.config;
  if (!args.length) { //help with no args.
    const genericHelpEmbed = new Discord.MessageEmbed()
        .setTitle("Help for DarkShinyGirabot")
        .setColor(embedColor)
        .setDescription(`Generic help information. 
        Type \`${prefix}help <command name>\` for specific info!`)
        .addField("Commands", commands.map(command => "`" + command.help.name + "`").join(", "))
        .setFooter("Made by DarkShinyGiratina#0487 using Pokemon Showdown's Data!")
        .setTimestamp();
    return message.channel.send(genericHelpEmbed)
  }
  else { //help with args.
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)); //The actual command object.
    if (!command) {
      return message.channel.send("That's not a valid command!");
    }

    const guildOnlyStr = command.help.guildOnly ? " (Can only be used in servers)" : ""; //If it's guildOnly, add this to the description.
    const specificHelpEmbed = new Discord.MessageEmbed()
        .setTitle(`Help for ${prefix}${command.help.name}`)
        .setDescription(command.help.description + guildOnlyStr)
        .setColor(embedColor)
        .addField("Usage", `\`${prefix}${command.help.name}${command.help.usage}\``, true)
        .setTimestamp()
        .setFooter("Made by DarkShinyGiratina#0487 with Pokemon Showdown's Data!");
    if (command.help.aliases.length > 0) { //If there are aliases.
      specificHelpEmbed.addField("Aliases", `\`${command.help.aliases.join(", ")}\``);
    }
    message.channel.send(specificHelpEmbed);
  }
};
