// const { Telegraf } = require('telegraf');
const {
  Telegraf,
  session,
  Scenes: { BaseScene, Stage, WizardScene },
  Markup,
  Scenes,
} = require('telegraf');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const VIP = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Да', callback_data: 'yes' },
        { text: 'Нет', callback_data: 'not' },
      ],
    ],
  },
};

const contactDataWizard = new Scenes.WizardScene(
  'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    ctx.reply('Логин абонента');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    // if (ctx.message.text.length < 2) {
    //   ctx.reply('Please enter name for real');
    //   return;
    // }
    ctx.wizard.state.contactData.login_abontnta = ctx.message.text;
    ctx.reply('Номер муфты(номер выноса)');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.contactData.num_mufta = ctx.message.text;
    ctx.reply('номер порта(номер порта в выносе)');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.contactData.num_passport = ctx.message.text;
    ctx.reply('Серийный номер ONU');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.contactData.ser_num_ONU = ctx.message.text;
    ctx.reply('Акция ВИП на 12', VIP);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.vip = ctx.callbackQuery.data;

    console.log(ctx.wizard.state.contactData);
    // ctx.reply(ctx.wizard.state.contactData).then((data) => {
    //   chatId = data.chat.id;
    //   mesId = data.message_id;

    //   console.log(data);
    // });

    let logAbon = ctx.wizard.state.contactData.login_abontnta;
    let numberMufta = ctx.wizard.state.contactData.num_mufta;
    let numberPass = ctx.wizard.state.contactData.num_passport;
    let OnuText = ctx.wizard.state.contactData.ser_num_ONU;
    let VIPTEXT = ctx.wizard.state.contactData.vip;
    let nameOtpravitel = ctx.callbackQuery.from.username;

    // ctx.wizard.state.contactData.login_abontnta;

    chanelId = -1001160560461;
    let texForward = ctx.wizard.state.contactData.text;
    // ctx.reply(vipText);
    bot.telegram.sendMessage(
      chanelId,
      ` Логин абонента: ${logAbon} \n Номер муфты: ${numberMufta} \n Номер паспорта: ${numberPass} \n Серийный номер ONU: ${OnuText} \n Акция ВИП на 12: ${VIPTEXT} \n Отправитель: @${nameOtpravitel}`
    );
    return ctx.scene.leave();
  }
);
const stage = new Stage([contactDataWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter('CONTACT_DATA_WIZARD_SCENE_ID');
  let tta = ctx.update.message.chat.id;
  bot.telegram.getChat(tta).then(console.log(tta));
  console.log(ctx.message.from);
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();