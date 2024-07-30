const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

console.log('Starting bot...');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    if (message.content === '!ping') {
      message.channel.send('Pong!');
    }
    
    if (message.content.startsWith('!timezone')) {
        const args = message.content.split(' ');
        const cityName = args[1];
        
        if (!cityName) {
            message.channel.send('Please provide a city name.');
            return;
        }
        
        try {
            const response = await axios.get(`https://timely-backend-five.vercel.app/api/worldtime`, { params: { city: cityName } });
            const { datetime, day_of_week } = response.data;
            
            message.channel.send(`The current time in ${cityName} is ${datetime} and it's ${day_of_week}`);
        } catch (error) {
            console.error('Error fetching time data:', error);
            console.error('Error response:', error.response ? error.response.data : 'No response data');
            message.channel.send('Error fetching time data. Please try again.');
        }
    }
});

// Note: DISCORD_TOKEN should be your bot's token, not the application ID
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to log in:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Keep the process running
process.on('exit', code => {
    console.log(`About to exit with code: ${code}`);
});

console.log('Bot setup complete, attempting to log in...');