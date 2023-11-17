import * as dotenv from 'dotenv';

dotenv.config();

import axios from "axios";

const headers = {
    'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
    'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY,
};

const ASSET_CHUNK_SIZE = 5_000;
const TOP_STOCK_COUNT = 5;

export async function getTopStocks(startDate, endDate) {
    let assetResp = await axios.get('https://paper-api.alpaca.markets/v2/assets', {
        headers,
        params: {
            status: 'active',
            asset_class: 'us_equity',
        },
    });

    let symbols = assetResp.data.filter(a => a.tradable).map(a => a.symbol);
    let symbolChunks = [...Array(Math.ceil(symbols.length / ASSET_CHUNK_SIZE))].map(_ => symbols.splice(0, ASSET_CHUNK_SIZE));

    let bars = await Promise.all(symbolChunks.map(async chunk => {
        let resp = await axios.get('https://data.alpaca.markets/v2/stocks/bars',
            {
                headers,
                params: {
                    symbols: chunk.join(','),
                    limit: 10000,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    timeframe: '1Day',
                },
            }
        );

        return resp.data.bars;
    }));

    bars = Object.assign({}, ...bars);

    return Object.entries(bars)
        .map(([symbol, bars]) => ({ symbol, ...bars[0] }))
        .map(bar => ({ ...bar, diff: bar.c / bar.o }))
        .sort((a, b) => b.diff - a.diff)
        .slice(0, TOP_STOCK_COUNT);
}