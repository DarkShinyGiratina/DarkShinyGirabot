exports.aliases = [];

exports.help = {
  name: "purge",
  description: "Purges a channel of a certain number of messages.",
  aliases: exports.aliases,
  guildOnly: true,
  usage: " <number of messages>"
};

exports.run = async (client, message, args) => {
  let channel = message.channel; //Should get around a bulkDelete bug.
  const {dsgid} = client.config;
    if (message.author.id !== dsgid) {
      return channel.send("Only my owner can purge messages!");
    }

    let numToPurge = args[0];

    if (isNaN(numToPurge)) {
      return channel.send("You need to enter a number to purge.");
    }

    else if (numToPurge < 100) {
      channel.bulkDelete(numToPurge);
    }

    else {
      for (let i = numToPurge; i > 0; i -= 100) {
        channel.bulkDelete(100);
      }
    }
    console.log("done");
}

