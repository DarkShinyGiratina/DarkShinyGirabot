function getUserFromMention(client, mention) {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }
}

function capitalizeFirstLetter(str, withHyphen) {
  if (str.indexOf('-') == -1) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    const hyphen = str.indexOf('-')
    if (withHyphen) {
      return str.charAt(0).toUpperCase() + str.slice(1, hyphen + 1) + str.charAt(hyphen + 1).toUpperCase() + str.slice(hyphen + 2);
    }
    if (!withHyphen) {
      return str.charAt(0).toUpperCase() + str.slice(1, hyphen) + ' ' + str.charAt(hyphen + 1).toUpperCase() + str.slice(hyphen + 2);
    }
  }
}

function removeSpecialCharacters(str) {
  return str.replace(/[^\sa-zA-Z0-9]/g,"");
}

exports.getUserFromMention = getUserFromMention;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.removeSpecialCharacters = removeSpecialCharacters;
