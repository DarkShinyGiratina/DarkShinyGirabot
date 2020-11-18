exports.aliases = [];

exports.help = {
  name: "bro",
  description: "Says \"prease bro......................\"",
  aliases: exports.aliases,
  guildOnly: false,
  usage: ""
};

exports.run = (client, message, args) => {
    message.channel.send("prease bro......................")
}

