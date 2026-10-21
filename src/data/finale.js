import { adventure } from './adventure.js';

export const candleIds = ['candle-1', 'candle-2', 'candle-3', 'candle-4', 'candle-5'];
export const starLights = [
  { id: 'memories', label: 'Recuerdos', icon: 'camera', color: '#e9b9cd', clue: 'Primero, ilumina los pequeños momentos que guardamos en el corazón.' },
  { id: 'trust', label: 'Confianza', icon: 'flask', color: '#cbb6e2', clue: 'Ahora, busca el ingrediente que nos permite creer el uno en el otro.' },
  { id: 'flowers', label: 'Flores', icon: 'flower', color: '#bdd6b9', clue: 'Sigue con las que abrieron sus pétalos para contarte razones de amor.' },
  { id: 'wish', label: 'Deseo', icon: 'cake', color: '#edcf9a', clue: 'Enciende eso que pedimos en silencio antes de apagar las velitas.' },
  { id: 'love', label: 'Amor', icon: 'heart', color: '#d8a6bf', clue: 'Por último, ilumina lo que dio vida a toda esta aventura.' },
];

export const finaleCopy = {
  birthday: {
    instruction: 'Piensa en un deseo bonito y toca cada llama para apagar las cinco velitas.',
    guideTitle: 'Este momento es solo tuyo.',
    guideMessage: 'No hace falta soplar la pantalla. Un toquecito en cada velita bastará para que tu deseo viaje muy, muy lejos.',
    finishedMessage: '¡Que este nuevo año de vida te regale muchas razones para sonreír!',
    relightLabel: 'Volver a encender las velitas',
    counterLabel: 'Velitas apagadas',
    rewardMessage: '¡Feliz cumpleaños! Tu deseo ya está en camino y esta estrella viene a celebrar contigo.',
  },
  stars: {
    instruction: 'Sigue las pistas de Mochi e ilumina las cinco luces en el orden del corazón.',
    guideTitle: 'La última estrella nos está esperando.',
    wrongMessage: 'Casi, casi… Esa lucecita esperará su turno. Mira la pista y prueba otra vez.',
    correctMessage: '¡Esa era! Una lucecita más en nuestro camino.',
    finishedMessage: '¡Las cinco luces están despiertas! En su centro ha aparecido nuestra última estrella.',
    retryLabel: 'Volver a iluminar el cielo',
    rewardMessage: '¡Encontraste la quinta estrella! Ahora podemos reunirlas y descubrir lo que guardaban para ti.',
  },
  constellation: {
    eyebrow: 'CINCO ESTRELLAS · UN MISMO CARIÑO',
    title: 'La magia siempre fuiste tú.',
    instruction: 'Cada pequeño descubrimiento nos ha traído hasta aquí.',
    joinLabel: 'Unir nuestras cinco estrellas',
    giftLabel: 'Descubrir mi regalo',
    joinedLabel: 'Cinco estrellas unidas en un corazón',
    messages: [
      { id: 'heart', expression: 'love', text: 'Mira, {name}… Los recuerdos, la confianza, las razones, tu deseo y el amor han encontrado su lugar. Juntos forman este corazón.' },
      { id: 'gift', expression: 'excited', text: 'Todas las estrellas eran una forma de decirte algo muy sencillo: eres muy especial. Ahora sí, hay un regalo esperando por ti.' },
    ],
  },
  gift: {
    eyebrow: 'EL FINAL MÁS BONITO ES CONTIGO',
    title: 'Un regalo solo para ti.',
    instruction: 'Dentro de esta cajita hay algo que no cabe en ningún lazo.',
    openLabel: 'Abrir mi regalo',
    letterEyebrow: 'UNAS PALABRAS, TODO MI CORAZÓN',
    surpriseLabel: 'Hay una sorpresa más…',
    drawWishLabel: 'Sacar un deseo para ti',
    anotherWishLabel: 'Descubrir otro deseo',
    replayLabel: 'Volver a vivir la aventura',
    backLabel: 'Volver al jardín',
    linkLabel: 'Descubrir mi sorpresa',
  },
};

const fallbackLetter = {
  title: 'Para mi persona favorita',
  paragraphs: [
    'Feliz cumpleaños, {name}. Este pequeño jardín nació con una intención muy sencilla: regalarte un ratito de alegría y recordarte cuánto te quiero.',
    'Admiro tu inteligencia, tu curiosidad y la dedicación con la que haces las cosas. Ojalá nunca dejes de mirar el mundo con esas ganas de descubrirlo.',
    'Entre recuerdos, flores y un poquito de química, cada estrella ha guardado una forma de decirte lo especial que eres para mí. La parte más bonita de esta aventura siempre fuiste tú.',
    'Deseo que este nuevo año de vida te encuentre rodeada de cariño, de oportunidades que te ilusionen y de momentos que quieras guardar para siempre.',
    'Gracias por formar parte de mi vida. Hoy celebro tu sonrisa, tu forma de ser y todo lo bonito que todavía está por venir. Te quiero muchísimo.',
  ],
  signature: 'Con todo mi amor',
};

const defaultWishes = [
  { id: 'calm', text: 'Que encuentres calma para disfrutar de las pequeñas cosas.' },
  { id: 'dreams', text: 'Que tus sueños encuentren caminos y manos que te acompañen.' },
  { id: 'laughter', text: 'Que nunca te falten risas que te hagan olvidar la hora.' },
  { id: 'love', text: 'Que te sientas querida, cuidada y libre de ser tú.' },
  { id: 'wonder', text: 'Que este año te sorprenda con algo todavía más bonito de lo que imaginas.' },
];

export function personalize(text, config = adventure) {
  return String(text).replaceAll('{name}', config.recipient);
}

export function getBirthdayLabel(config = adventure) {
  if (typeof config.birthday !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(config.birthday)) return null;
  const date = new Date(`${config.birthday}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== config.birthday) return null;
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(date);
}

export function getFinalLetter(config = adventure) {
  const letter = config.finalLetter ?? {};
  const paragraphs = Array.isArray(letter.paragraphs) ? letter.paragraphs.filter(text => typeof text === 'string' && text.trim()) : [];
  return {
    title: personalize(typeof letter.title === 'string' && letter.title.trim() ? letter.title : fallbackLetter.title, config),
    paragraphs: (paragraphs.length ? paragraphs : fallbackLetter.paragraphs).map(text => personalize(text, config)),
    signature: personalize(typeof letter.signature === 'string' && letter.signature.trim() ? letter.signature : fallbackLetter.signature, config),
    photo: typeof letter.photo === 'string' && letter.photo ? letter.photo : null,
  };
}

export function getWishes(config = adventure) {
  const wishes = Array.isArray(config.surprise?.wishes) ? config.surprise.wishes : [];
  const seen = new Set();
  const valid = wishes.filter(item => {
    if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id) || typeof item.text !== 'string' || !item.text.trim()) return false;
    seen.add(item.id);
    return true;
  });
  return valid.length ? valid : defaultWishes;
}

export function getSurpriseUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return value;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
