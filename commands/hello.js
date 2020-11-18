exports.aliases = ["hi", "sup", "yo"];

exports.help = {
  name: "hello",
  description: "Says hi to you!",
  aliases: exports.aliases,
  guildOnly: false,
  usage: ""
};

exports.run = (client, message, args) => {
  message.channel.send("Hello there <@" + message.author.id + ">!");
}

