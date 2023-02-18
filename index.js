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

    let topStocks = await getTopStocks();
    let channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

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
});

client.login(process.env.DISCORD_TOKEN);