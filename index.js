import * as dotenv from 'dotenv';
dotenv.config();

import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { randomEmojis } from "./random.js";
import { getTopStocks } from "./stocks.js";
import { generateChart } from './chart.js';
import lodash from 'lodash';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

    while (true) {
        // Wait until 16:15 EST+5
        // (We have to wait 15 mins past closing due API plan not allowing real-time data)
        let now = new Date();
        let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16 + 5, 15, 0, 0);
        if (now > target)
            target.setDate(target.getDate() + 1);

        let diff = target.getTime() - now.getTime();
        await new Promise(resolve => setTimeout(resolve, diff));

        // If today is a weekend, skip
        if (target.getDay() === 0 || target.getDay() === 6)
            continue;

        let topStocks = await getTopStocks();

        const embed = new EmbedBuilder()
            .setColor(0x00FFBB)
            .setTitle('Today\'s Potential Gains')
            .setDescription('What ***YOU*** could have earned today! :calendar:')
            .addFields(
                topStocks.map(bar => {
                    let emojis = randomEmojis();
                    let chart = generateChart(bar.diff);

                    return {
                        name: `­\n${emojis} $${bar.symbol} ${emojis}`,
                        value: `\`${lodash.padStart('+' + (bar.diff * 100 - 100).toFixed(1), 6)}%\` ${chart}`,
                    };
                })
            );

        await channel.send({ embeds: [embed] });
    }
});

client.login(process.env.DISCORD_TOKEN);