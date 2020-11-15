exports.aliases = [];

exports.help = {
  name: "bro",
  description: "Says bro......................",
  aliases: exports.aliases,
  usage: ""
};

exports.run = (client, message, args) => {
    message.channel.send("bro......................")
}

