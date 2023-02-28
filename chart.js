const EMOJIS = [
    '',
    '<:0083p_2:1038927372931567677>',
    '<:0167p_2:1038927375938891857>',
    '<:0250p_2:1038927378174451832>',
    '<:0333p_2:1038927380976242708>',
    '<:0417p_2:1038927383073390683>',
    '<:0500p:1038927384163926037>',
    '<:0583p:1038927384839196693>',
    '<:0667p:1038927386323992587>',
    '<:0750p:1038927387318026282>',
    '<:0833p:1038927389390032996>',
    '<:0917p:1038927390518296749>',
    '<:1000p:1038927391688503327>',
];

const PRIOR_EMOJIS = [
    '<:1000p:1038927391688503327>',
    '<:0083p_1:1038927371807498332>',
    '<:0167p_1:1038927374181482636>',
    '<:0250p_1:1038927377121693877>',
    '<:0333p_1:1038927379361452062>',
    '<:0417p_1:1038927382058369135>',
];

const CONT_EMOJI = '<:cont:1038927392753848402>';

// 1 <= n <= 2
export function generateChart(n) {
    let chartLength = 10;
    let filled = Math.min(n, 2) * chartLength - chartLength;

    let emojiIndex = Math.round((n - 1) % (Math.floor(filled) * (1 / chartLength)) * chartLength * (EMOJIS.length - 1));
    let emoji = EMOJIS[emojiIndex];
    let priorEmoji = PRIOR_EMOJIS[emojiIndex] ?? CONT_EMOJI;

    let chart = [...Array(Math.max(Math.ceil(filled) - 2, 0)).fill(CONT_EMOJI), n > 1.1 ? priorEmoji : '', emoji].join('');

    // Since an entirely filled chart will be full of conts, and has an emoji of 0 (blank),
    // it will be 1 character too short, append a cont to fix this
    if (n >= 2 + 1 / chartLength)
        chart += CONT_EMOJI;

    return chart;
}