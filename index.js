require('dotenv').config();
const TelrgramAPI = require('node-telegram-bot-api');
const {buttonOptions, againButtonOptions} = require('./options.js');
const sequelize = require('./db.js');
const UserModel = require('./models.js')

const token = process.env.TG_TOKEN;

const bot = new TelrgramAPI(token, { polling: true });

const startRandom = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Let's play`, buttonOptions);
}

const chats = {};

const run = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
    } catch (e) {
        console.log('Ошибка подключения к БД', e);
    }

    bot.setMyCommands([
        { command: '/run', description: 'Run, Vasya, run' },
        { command: '/stop', description: 'Ooops.... Stop, I did it again...' },
        { command: '/random', description: `Let's play the game :)` },
        { command: '/info', description: `Info aboute game` }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const userName = msg.from.first_name;
        const premium = msg.from.is_premium;

        try {
            if (text === '/run') {
                await UserModel.create({chatId})
                bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/d54/48b/d5448b04-0f8f-324e-8ee4-537ef1618b08/1.webp');
                return bot.sendMessage(chatId, `Hi ${userName}, it's me! \nStitch!`);
            }
    
            if (text === '/info') {
                const user = await UserModel.findOne({chatId});
                let countAnswers = `You have ${user.right} correct answers and ${user.wrong} wrong`;
                return bot.sendMessage(chatId, premium ? `Heh, respected ${userName}` + countAnswers : `Mhe, poor ${userName}` + countAnswers);
            }
            if (text === '/stop') {
                bot.sendSticker(chatId, 'https://media.stickerswiki.app/full_stitch/744123.512.webp');
                return bot.sendMessage(chatId, `Ooops.... Stop, ${userName} did it again...`);
            }
    
            if (text === `/random`) {
                return startRandom(chatId);
            }

            const unknownCommand = () => {
                bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/d54/48b/d5448b04-0f8f-324e-8ee4-537ef1618b08/6.webp');
                bot.sendMessage(chatId, `I don't understand you`)
            }
            // return unknownCommand();
        } catch (e) {
            return bot.sendMessage(chatId, 'Ой... Чет поломалось...');
        }

        
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const user = await UserModel.findOne({chatId});

        if (data === '/again') {
            return startRandom(chatId);
        }

        if (data == chats[chatId]) {
            user.right++;
            await bot.sendMessage(chatId, `Congratulations! It's ${chats[chatId]}`, againButtonOptions)
        } else {
            user.wrong++;
            await bot.sendMessage(chatId, `I believe, u can. It was ${chats[chatId]}`, againButtonOptions)
        }
        await user.save();
        // bot.sendMessage(chatId, `You got ${data}`)
        // console.log(msg)
    })
};

run()