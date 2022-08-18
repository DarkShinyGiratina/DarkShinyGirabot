exports.aliases = [];

exports.help = {
  name: "cleardm",
  description: "Clears a DM with the mentioned user",
  aliases: exports.aliases,
  guildOnly: false,
  usage: " <user>"
};

exports.run = async (client, message, args) => {
    console.log("cleardm called");
    const user = message.mentions.users.first();
    const userChannel = user.dmChannel || (await user.createDM());
    const messages = await userChannel.messages.fetch({limit: 100});
    messages.forEach(message=> {
      if (!message.author.bot) return;
      message.delete().catch(console.log("Tried deleting a message I already deleted"));
    });
}