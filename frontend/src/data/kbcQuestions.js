// Kaun Banega Coder (KBC) Authentic 16-Level Question Bank - Pure SQL Master Edition (1,000+ Questions)
// Level 1 (₹1,000) to Level 16 (₹7 Crore Jackpot)
import sqlQuestionBank from './sqlQuestionBank1000.json';
import webQuestionBank from './webQuestionBank1000.json';

export const SQL_QUESTION_BANK = sqlQuestionBank;
export const WEB_QUESTION_BANK = webQuestionBank;

export const KBC_PRIZE_LADDER = [
  { level: 1,  prize: '₹1,000',       amount: 1000,       isSafe: false, label: '1,000' },
  { level: 2,  prize: '₹2,000',       amount: 2000,       isSafe: false, label: '2,000' },
  { level: 3,  prize: '₹3,000',       amount: 3000,       isSafe: false, label: '3,000' },
  { level: 4,  prize: '₹5,000',       amount: 5000,       isSafe: false, label: '5,000' },
  { level: 5,  prize: '₹10,000',      amount: 10000,      isSafe: true,  label: '10,000 (Padav 1)' },
  { level: 6,  prize: '₹20,000',      amount: 20000,      isSafe: false, label: '20,000' },
  { level: 7,  prize: '₹40,000',      amount: 40000,      isSafe: false, label: '40,000' },
  { level: 8,  prize: '₹80,000',      amount: 80000,      isSafe: false, label: '80,000' },
  { level: 9,  prize: '₹1,60,000',    amount: 160000,     isSafe: false, label: '1,60,000' },
  { level: 10, prize: '₹3,20,000',    amount: 320000,     isSafe: true,  label: '3,20,000 (Padav 2)' },
  { level: 11, prize: '₹6,40,000',    amount: 640000,     isSafe: false, label: '6,40,000' },
  { level: 12, prize: '₹12,50,000',   amount: 1250000,    isSafe: false, label: '12,50,000' },
  { level: 13, prize: '₹25,00,000',   amount: 2500000,    isSafe: false, label: '25,00,000' },
  { level: 14, prize: '₹50,00,000',   amount: 5000000,    isSafe: false, label: '50,00,000' },
  { level: 15, prize: '₹1 Crore',     amount: 10000000,   isSafe: true,  label: '1,00,00,000 (1 Crore)' },
  { level: 16, prize: '₹7 Crore',     amount: 70000000,   isSafe: true,  label: '7,00,00,000 (7 Crore Jackpot)' },
  { level: 17, prize: '₹7.5 Crore',   amount: 75000000,   isSafe: false, label: '7,50,00,000' },
  { level: 18, prize: '₹8 Crore',     amount: 80000000,   isSafe: false, label: '8,00,00,000' },
  { level: 19, prize: '₹8.5 Crore',   amount: 85000000,   isSafe: false, label: '8,50,00,000' },
  { level: 20, prize: '₹10 Crore',    amount: 100000000,  isSafe: true,  label: '10,00,00,000 (Padav 4)' },
  { level: 21, prize: '₹11 Crore',    amount: 110000000,  isSafe: false, label: '11,00,00,000' },
  { level: 22, prize: '₹12 Crore',    amount: 120000000,  isSafe: false, label: '12,00,00,000' },
  { level: 23, prize: '₹13 Crore',    amount: 130000000,  isSafe: false, label: '13,00,00,000' },
  { level: 24, prize: '₹14 Crore',    amount: 140000000,  isSafe: false, label: '14,00,00,000' },
  { level: 25, prize: '₹15 Crore',    amount: 150000000,  isSafe: true,  label: '15,00,00,000 (Padav 5)' },
  { level: 26, prize: '₹16 Crore',    amount: 160000000,  isSafe: false, label: '16,00,00,000' },
  { level: 27, prize: '₹17 Crore',    amount: 170000000,  isSafe: false, label: '17,00,00,000' },
  { level: 28, prize: '₹18 Crore',    amount: 180000000,  isSafe: false, label: '18,00,00,000' },
  { level: 29, prize: '₹20 Crore',    amount: 200000000,  isSafe: false, label: '20,00,00,000' },
  { level: 30, prize: '₹25 Crore',    amount: 250000000,  isSafe: true,  label: '25,00,00,000 (Padav 6)' },
  { level: 31, prize: '₹26 Crore',    amount: 260000000,  isSafe: false, label: '26,00,00,000' },
  { level: 32, prize: '₹27 Crore',    amount: 270000000,  isSafe: false, label: '27,00,00,000' },
  { level: 33, prize: '₹28 Crore',    amount: 280000000,  isSafe: false, label: '28,00,00,000' },
  { level: 34, prize: '₹29 Crore',    amount: 290000000,  isSafe: false, label: '29,00,00,000' },
  { level: 35, prize: '₹30 Crore',    amount: 300000000,  isSafe: true,  label: '30,00,00,000 (Padav 7)' },
  { level: 36, prize: '₹32 Crore',    amount: 320000000,  isSafe: false, label: '32,00,00,000' },
  { level: 37, prize: '₹34 Crore',    amount: 340000000,  isSafe: false, label: '34,00,00,000' },
  { level: 38, prize: '₹36 Crore',    amount: 360000000,  isSafe: false, label: '36,00,00,000' },
  { level: 39, prize: '₹38 Crore',    amount: 380000000,  isSafe: false, label: '38,00,00,000' },
  { level: 40, prize: '₹40 Crore',    amount: 400000000,  isSafe: true,  label: '40,00,00,000 (Padav 8)' },
  { level: 41, prize: '₹42 Crore',    amount: 420000000,  isSafe: false, label: '42,00,00,000' },
  { level: 42, prize: '₹44 Crore',    amount: 440000000,  isSafe: false, label: '44,00,00,000' },
  { level: 43, prize: '₹46 Crore',    amount: 460000000,  isSafe: false, label: '46,00,00,000' },
  { level: 44, prize: '₹48 Crore',    amount: 480000000,  isSafe: false, label: '48,00,00,000' },
  { level: 45, prize: '₹50 Crore',    amount: 500000000,  isSafe: true,  label: '50,00,00,000 (Maha Padav 9)' },
  { level: 46, prize: '₹55 Crore',    amount: 550000000,  isSafe: false, label: '55,00,00,000' },
  { level: 47, prize: '₹60 Crore',    amount: 600000000,  isSafe: false, label: '60,00,00,000' },
  { level: 48, prize: '₹65 Crore',    amount: 650000000,  isSafe: false, label: '65,00,00,000' },
  { level: 49, prize: '₹75 Crore',    amount: 750000000,  isSafe: false, label: '75,00,00,000' },
  { level: 50, prize: '₹100 Crore',   amount: 1000000000, isSafe: true,  label: '100 Crore Supreme Jackpot' },
];

/**
 * Returns a dynamically scaled prize ladder for any question count (e.g. 10, 16, 25, 30, 50, 100)
 */
export function getDynamicPrizeLadder(totalCount = 16) {
  const count = Math.max(1, parseInt(totalCount, 10) || 16);
  if (count <= KBC_PRIZE_LADDER.length) {
    return KBC_PRIZE_LADDER.slice(0, count).map((step, idx) => ({
      ...step,
      isJackpot: idx === count - 1,
      isSafe: step.isSafe || idx === count - 1
    }));
  }
  const result = [...KBC_PRIZE_LADDER];
  for (let lvl = KBC_PRIZE_LADDER.length + 1; lvl <= count; lvl++) {
    const cr = 100 + (lvl - 50) * 2;
    result.push({
      level: lvl,
      prize: `₹${cr} Crore`,
      amount: cr * 10000000,
      isSafe: lvl % 5 === 0 || lvl === count,
      isJackpot: lvl === count,
      label: `${cr} Crore`
    });
  }
  return result;
}

export function getPrizeForLevel(lvl, totalQuestions = 16) {
  const ladder = getDynamicPrizeLadder(totalQuestions);
  const idx = Math.min(Math.max(1, lvl) - 1, ladder.length - 1);
  return ladder[idx] || ladder[0];
}

export function getSafePoints(level, totalQuestions = 16) {
  const lvl = parseInt(level, 10) || 1;
  const totalQ = parseInt(totalQuestions, 10) || 16;
  let safeLevel = 0;
  if (totalQ > 16) {
    safeLevel = Math.floor((lvl - 1) / 5) * 5;
  } else {
    if (lvl > 15) safeLevel = 15;
    else if (lvl > 10) safeLevel = 10;
    else if (lvl > 5) safeLevel = 5;
    else safeLevel = 0;
  }
  return safeLevel * 100;
}

export const DEFAULT_SQL_QUESTIONS = {};
for (let lvl = 1; lvl <= 100; lvl++) {
  const matching = sqlQuestionBank.filter(q => q.level === lvl);
  if (matching.length > 0) {
    DEFAULT_SQL_QUESTIONS[lvl] = matching;
  } else {
    const wrapLvl = ((lvl - 1) % 16) + 1;
    DEFAULT_SQL_QUESTIONS[lvl] = sqlQuestionBank.filter(q => q.level === wrapLvl);
  }
}

export const DEFAULT_WEB_QUESTIONS = {};
for (let lvl = 1; lvl <= 100; lvl++) {
  const matching = webQuestionBank.filter(q => q.level === lvl);
  if (matching.length > 0) {
    DEFAULT_WEB_QUESTIONS[lvl] = matching;
  } else {
    const wrapLvl = ((lvl - 1) % 16) + 1;
    DEFAULT_WEB_QUESTIONS[lvl] = webQuestionBank.filter(q => q.level === wrapLvl);
  }
}

// Backward compatibility alias for any component expecting DEFAULT_MERN_SQL_QUESTIONS
export const DEFAULT_MERN_SQL_QUESTIONS = DEFAULT_SQL_QUESTIONS;

// Amitabh Bachchan authentic dialogues & voiceover prompts for KBC MERN & SQL Edition
export const AMITABH_QUOTES = {
  welcome: [
    "Deviyo aur sajjano! Swagat hai aapka Kaun Banega Coder — MERN Stack & SQL Grand Edition mein!",
    "Namaskar! Full Stack aur Database ke is mahamukable mein aapka hardik swagat hai!",
    "Hot seat par swagat hai! Yahan MongoDB, Express, React, Node.js aur SQL ke prashn aapko 7 Crore ki unchayion par le jayenge!"
  ],
  questionIntro: (level, prize) => `Prashn sankhya ${level}, yeh raha aapki screen par ${prize} ke liye!`,
  optionSelected: (optLabel, optText) => `Aapne chuna hai Option ${optLabel}: "${optText}". Kya ise lock kiya jaaye?`,
  lockConfirmed: (optLabel) => `Computer Ji! Option ${optLabel} ko lock kiya jaaye!`,
  correctAnswer: [
    "Adbhut! Bilkul sahi uttar!",
    "Shandar! Aapka Full-Stack aur SQL concepts be-misaal hain!",
    "Sahi uttar! Aur isi ke saath aap badh gaye hain agle padav ki or!"
  ],
  padavCleared: (prize) => `Badhai ho! Aapne safalta-poorvak paar kar liya hai apna padav aur ab aapki guaranteed dhanrashi hai ${prize}!`,
  wrongAnswer: (correctOption) => `Afsos! Ye galat uttar hai... Sahi jawab tha Option ${correctOption}. Khel yahin samapt hota hai.`,
  timeOut: "Samay samapt! Tik-tiki ji ne ghanti baja di hai. Khel yahin par rukta hai.",
  quitConfirm: "Kya aap sach mein khel chhodkar apni jeeti hui dhanrashi lekar jana chahte hain?",
  quitSuccess: (prize) => `Bohot hi samajhdari bhara nirnay! Aap jeet chuke hain ${prize}! Badhai ho!`,
  crorepati: "GRAND FINALE VICTORY!! Deviyo aur sajjano, itihaas rach diya hai! Aap ban chuke hain MAHA CODER CHAMPION!!",
  lifelines: {
    fifty: "Computer Ji, 2 galat uttar mita diye jayein!",
    poll: "Deviyo aur sajjano, audience poll ka samay aa gaya hai. Kripya apna mat dein!",
    friend: "Aaiye video call milate hain hamare Tech Expert friend se!",
    flip: "Computer Ji, is prashn ko badal kar ek naya MERN/SQL prashn pesh kiya jaaye!"
  }
};

// Simulated Expert Tech Mentors for "Phone-A-Friend / Video Call"
export const EXPERT_FRIENDS = [
  {
    name: "Manish Kumar",
    title: "Chief Tech Instructor & MERN Architect",
    avatar: "👨‍🏫",
    advice: (correctLetter, isConfident) => 
      isConfident 
        ? `Namaskar Host Sir! Main 95% confident hoon ki iska sahi uttar Option ${correctLetter} hi hai. Concepts clear hain, lock kar sakte hain!`
        : `Namaskar Bachchan Sahab! Prashn thoda tricky hai, par MERN aur SQL architecture ke hisab se Option ${correctLetter} hi sahi answer hai (~85%).`
  },
  {
    name: "Sneha Reddy",
    title: "Senior Full Stack Engineer & DBA",
    avatar: "👩‍💻",
    advice: (correctLetter, isConfident) =>
      isConfident
        ? `Hello Sir! Production mein hum is pattern ko frequently use karte hain. Option ${correctLetter} is 100% correct!`
        : `Hello Host Sir! Internal execution logic dekhein toh Option ${correctLetter} is the most solid answer.`
  }
];
