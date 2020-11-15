exports.run = (client, message, args) => {
  message.channel.send("Hello there <@" + message.author.id + ">!");
}
