const EMOJIS = [
    ':bomb::fire:',
    ':money_with_wings::chart_with_upwards_trend::champagne_glass:',
    ':gem::palms_up_together:',
    ':rocket::rainbow::last_quarter_moon_with_face:'
];

const PHRASES = [

]

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const randomPhrase = () => random(PHRASES);
export const randomEmojis = () => random(EMOJIS);