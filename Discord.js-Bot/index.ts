import { ClientEvents } from "discord.js";

const { Routes, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js')
const { REST } = require('@discordjs/rest');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on('ready', () => {
    console.log('bot is running');
})

client.login(process.env.TOKEN);

client.on('messageCreate', (message: any) => {
    if(!message.author.bot) {
        if(message.content === "car noise") {
            message.reply('Vroom!')
        }

        if(message.content.includes('I\'m going')) {
            message.reply('Please don\'t go!')
        }

        if(message.mentions.members.size) {
            const name = message.mentions.users.first().username;
            message.reply(`That is Mr. ${name} to you !`)
        }
    }
})