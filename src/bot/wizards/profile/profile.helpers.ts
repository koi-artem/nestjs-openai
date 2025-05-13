import { ACTIVITY_MULTIPLIERS } from './profile.constants';

export const formatResults = (
  age: number,
  height: number,
  weight: number,
  activity: number,
  gender: number,
  goal: number,
) => {
  const maleBMR = 10 * weight + 6.25 * height - 5 * age + 5;
  const femaleBMR = 10 * weight + 6.25 * height - 5 * age - 161;

  const BMR = gender === 1 ? maleBMR : femaleBMR;

  const TDEE = Math.floor(BMR * ACTIVITY_MULTIPLIERS[activity]);
  const lowerTDEE1 = Math.floor((TDEE * 0.8) / 100) * 100;
  const lowerTDEE2 = Math.floor((TDEE * 0.9) / 100) * 100;
  const upperTDEE1 = Math.floor((TDEE * 1.1) / 100) * 100;
  const upperTDEE2 = Math.floor((TDEE * 1.2) / 100) * 100;

  const maleBMRFormula = `<i>BMR = 10 × вага (кг) + 6.25 × зріст (см) − 5 × вік (років) + 5 = ${BMR}</i>`;
  const femaleBMRFormula = `<i>BMR = 10 × вага (кг) + 6.25 × зріст (см) − 5 × вік (років) + 5 = ${BMR}</i>`;

  let avgGoal = 0;
  if (goal === 1) {
    avgGoal = Math.floor((lowerTDEE1 + lowerTDEE2) / 2);
  } else if (goal === 2) {
    avgGoal = Math.floor(TDEE / 100) * 100;
  } else if (goal === 3) {
    avgGoal = Math.floor((upperTDEE1 + upperTDEE2) / 2);
  }

  const formattedResult = `<b>Твої дані</b>

Вік - ${age},
Зріст - ${height},
Вага - ${weight},

<b>BMR</b>
${gender === 1 ? maleBMRFormula : femaleBMRFormula}
    
<b>Коефіцієнти активності</b>:
1.2 — мінімальна активність (сидячий спосіб життя).
1.375 — легка активність (легкі вправи 1-3 рази на тиждень).
1.55 — помірна активність (помірні навантаження 3-5 разів на тиждень).
1.725 — висока активність (тренування 6-7 разів на тиждень).
1.9 — екстремальна активність (важка фізична праця або інтенсивні тренування 2 рази на день).

<i>TDEE = BMR × рівень активності = ${BMR} × ${ACTIVITY_MULTIPLIERS[activity]} = ${TDEE}</i>

<b>Результат:
Для підтримання ваги вам потрібно приблизно ${TDEE} ккал на день. Якщо ви хочете схуднути, рекомендується знизити споживання на 10-20% (приблизно ${lowerTDEE1}-${lowerTDEE2} ккал). Для набору маси — збільшити на 10-20% (приблизно ${upperTDEE1}-${upperTDEE2} ккал)</b>.

<b>Денна норма встановлена як <i>${avgGoal}</i> ккал!</b>
`;

  return {
    formattedResult,
    avgGoal,
  };
};
