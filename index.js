const { Telegraf, Input } = require('telegraf');
const { message } = require('telegraf/filters');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const bot = new Telegraf(process.env.BOT_TOKEN);

const USER_ID = {
  LONG: "5186919276",
  THONG: "1421003795",
  PHONG: "1471909653",
  DUNG: "751237479"
}

const getUserName = async (ctx, userId) => {
  try {
    return (await ctx.getChatMember(userId))?.user?.username;
  } catch (error) {
    return "#member"
  }
}

bot.start((ctx) => ctx.reply('oke oke'));
bot.help((ctx) => ctx.reply("Help yourself"));

bot.on(message('text'), async (ctx, next) => {
  if (ctx.entities) {
    return await next();
  }
  console.log("Message sent", ctx.message);

  if (ctx.message.from?.id == USER_ID.LONG && (ctx.message?.text?.toLowerCase()?.includes("emi"))) {
    await ctx.reply(`@${ctx.from.username} nhắc ít thôi`);
  }

  await next();
});

bot.command('image', async (ctx, next) => {
  const imageSize = '256x256';

  try {
    var prompt = ctx.message.text?.slice(7) + '';
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });

    const imageUrl = response.data.data[0].url;
    await ctx.replyWithPhoto(Input.fromURL(imageUrl))

    await next();
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

bot.command('music', async (ctx, next) => {
  console.log("MUSIC COMMAND", ctx.message.from);
  let userId = ctx.message.from?.id?.toString();
  switch (userId) {
    case USER_ID.PHONG:
      await ctx.reply(`@${await getUserName(ctx, USER_ID.THONG)} @${await getUserName(ctx, USER_ID.LONG)} @${await getUserName(ctx, USER_ID.DUNG)} xin một bản nhạc nào`);
      break;
    case USER_ID.DUNG:
      await ctx.reply(`@${await getUserName(ctx, USER_ID.THONG)} @${await getUserName(ctx, USER_ID.PHONG)} @${await getUserName(ctx, USER_ID.LONG)} xin một bản nhạc nào`);
      break;
    case USER_ID.THONG:
      await ctx.reply(`@${await getUserName(ctx, USER_ID.DUNG)} @${await getUserName(ctx, USER_ID.PHONG)} @${await getUserName(ctx, USER_ID.LONG)} xin một bản nhạc nào`);
      break;
    case USER_ID.LONG:
      await ctx.reply(`@${await getUserName(ctx, USER_ID.DUNG)} @${await getUserName(ctx, USER_ID.PHONG)} @${await getUserName(ctx, USER_ID.THONG)} xin một bản nhạc nào`);
      break;
    default:
      await ctx.reply("Who the fuck are you?");
      break;
  }

  await next();
});

bot.command('bruce', async (ctx, next) => {
  await ctx.replyWithPhoto(Input.fromURL("https://scontent.fhan14-1.fna.fbcdn.net/v/t1.18169-9/1982064_301028530058023_6464268228576422604_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=zGD77QRlPhoAX_mmnZ1&_nc_ht=scontent.fhan14-1.fna&oh=00_AfAQnX5eqF7IVCVKrbLV83ZyEvBuBnNq2A1m8_8KC0Y-eQ&oe=63CA31A4"))
  await next();
});

bot.catch((error) => {
  console.log(error);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
