const { Routes, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js')
const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const { REST } = require('@discordjs/rest'); //allows you to interact with the Discord API specifically
const dotenv = require('dotenv');

dotenv.config();

//create Client
const client = new Client({
    intents: [
        Guilds,
        GuildMessages,
        MessageContent
    ]
});

//ready the bot
client.on('ready', () => {
    console.log("The bot is ready!");

    //there are guild and global commands

    const guildId = '994017923389734912'; //store Js group server id
    const guild = client.guilds.cache.get(guildId);
    let commands

    if (guild) {
        commands = guild.commands
    }
    else {
        commands = client.application?.commands
    }

    //creates the ping/pong command
    commands?.create({
        name: 'ping',
        description: 'replies with pong.'
    })

    //creates an add command
    commands?.create({
        name: 'add',
        description: 'Adds two numbers.',
        options: [
            {
                name: 'num1',
                description: 'The first number.',
                required: true,
                type: 10
            },
            {
                name: 'num2',
                description: 'The second number.',
                required: true,
                type: 10
            }
        ]

    })

    //custom attempt at creating a random number generator
    commands?.create({
        name: 'random',
        description: 'Returns a random number between the two inputs.',
        options: [
            {
                name: 'number1',
                description: 'Minimum value',
                required: true,
                type: 10
            },
            {
                name: 'number2',
                description: 'Maximum value',
                required: true,
                type: 10
            }
        ]
    })

    commands?.create({
        name: 'roll',
        description: 'Rolls dice of the inputted value.',
        options: [
            {
                name: 'amount',
                description: 'The amount of dice to be rolled',
                required: true,
                type: 10
            },
            {
                name: 'value',
                description: 'The value of the die (e.g., 8, 12, 20, etc).',
                required: true,
                type: 10
            }
        ]
    })

    commands?.create({
        name: 'better-poke',
        type: 2
    })
});

//adds function to slash commands
client.on('interactionCreate', async (interaction: any) => {
    // if (!interaction.isCommand()) {
    //     return
    // }
    if (interaction.isChatInputCommand()){

    const { commandName, options } = interaction

    

    if (commandName === 'ping') {
        interaction.reply({
            content: 'pong',
            ephemeral: true //ensures only the user can see the reply. Disable for entire server to see.
        })
    }
    else if (commandName === 'add') {
        const num1 = options.getNumber('num1')!
        const num2 = options.getNumber('num2')!

        interaction.reply({
            content: `The sum is ${num1 + num2}`,
            ephemeral: true
        })
    }
    else if (commandName === 'random') {
        //minimum
        const number1 = options.getNumber('number1')!
        //maximum
        const number2 = options.getNumber('number2')!

        //get random number
        var randomValue = Math.floor(Math.random() * (number2 - number1 + 1)) + number1;

        //reply with random number
        interaction.reply({
            content: `Your random number is ${randomValue}`,
            ephemeral: true
        })
    }
    else if (commandName === 'roll') {
        //get the amount
        const amount = options.getNumber('amount')!
        //get the value of the dice
        const value = options.getNumber('value')!

        //var rollValue = Math.floor(Math.random() * (value - 1 + 1)) + 1;
        var rollValue = 0 //default 0
        let values = ""; //string that will hold all the roll values

        //loop creates random values and adds them to the total value and the array
        for (var i = 0; i < amount; i++) {
            var tempValue = Math.floor(Math.random() * value) + 1;
            rollValue += tempValue;

            if (amount === 1) {
                values = tempValue + '.';
            }
            else {

                //add a period if it is that last number
                if (i === (amount - 1)) {
                    values = values + 'and ' + tempValue + '.';
                }
                else {
                    values = values + tempValue + ', ';
                }
            }
        }

        //reply
        if (amount === 1){
            interaction.reply({
                content: `You rolled ${amount}d${value} and got: ${rollValue}.`
                //ephemeral: true
        })
        }
        else{
            interaction.reply({
                content: `You rolled ${amount}d${value} and got: ${rollValue}.\n Rolls were: ${values}`
                //ephemeral: true
            })
        }
    }
}
else if (interaction.isUserContextMenuCommand()){
    if(interaction.commandName === "better-poke"){
        //reply with user name of who initiated the poke
        interaction.reply({
            content: `${interaction.user.tag.slice(0, -5)} is the one who poked.`
        })
    }
}
})

//listen for commands
client.on('messageCreate', (message: any) => {
    if (message.content === "ping") { //listen for ping
        message.reply({
            content: "pong" //reply with pong
        })
    }
});

//login using the token we got from the bot page
client.login(process.env.TOKEN);