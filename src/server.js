const telegramBot = require("node-telegram-bot-api");
const Moralis = require("moralis/node");

const serverUrl = "";
const appId = "";
Moralis.start({ serverUrl, appId });

const TOKEN = "";

const bot = new telegramBot(TOKEN, { polling: true });

const setupLaunch = async (launchId, chatId) => {
  const Launch = Moralis.Object.extend("Launches");
  const query = new Moralis.Query(Launch);
  query.equalTo("tgBotKey", launchId);
  const results = await query.find();

  if(results) {
      const object = results[0]
      object.set("isLaunched", true);
      await object.save().then(() => bot.sendMessage(
          chatId,
          `Contract has been succesfuly Launched https://debotbsc.com/launches/${object.id}`,
            
      ).then((res) => bot.pinChatMessage(chatId, res.message_id)))
  }

};

bot.onText(/\/setup (.+)/, (msg, match) => {
  bot.getChatMember(msg.chat.id, msg.from.id).then((res) => {
    if (res.status === "creator" || res.status === "administrator") { 
      setupLaunch(match[1], msg.chat.id);
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Sorry this command can only be executed by admins."
      );
    }
  });
});

bot.onText(/\/contract/, (msg, match) => {
    bot.exportChatInviteLink(msg.from.id).then((res) => console.log(res))
})
