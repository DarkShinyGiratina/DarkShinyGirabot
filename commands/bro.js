exports.aliases = [];

exports.help = {
  name: "bro",
  description: "Says \"prease bro......................\"",
  aliases: exports.aliases,
  usage: ""
};

exports.run = (client, message, args) => {
    message.channel.send("prease bro......................")
}

