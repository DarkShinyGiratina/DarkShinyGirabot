exports.run = (client, message, args) => {
    message.channel.send("You can donate at https://www.google.com")
}

exports.aliases = [];

exports.help = {
  name: "donate",
  description: "Tells you how to donate to the bot!",
  aliases: exports.aliases,
  guildOnly: false,
  usage: ""
};