import type { RecapText } from './types';

type S = string;

const pt = {
  pMove: (next: S, up: boolean) => up
    ? `Indo para <b>${next}</b> (sentido horário), uma nota desta escala sobe meio tom. Para qual tecla ela vai? Toque.`
    : `Indo para <b>${next}</b> (sentido anti-horário), uma nota desta escala desce meio tom. Para qual tecla ela vai? Toque.`,
  pMoveRev: (deg: S, a: S, b: S) => `O ${deg} grau: ${a} → ${b}. É a única troca; as outras seis notas ficam onde estão.`,
  deg4: '4º', deg7: '7º',
  pRole: (up: boolean): S => up
    ? 'Na tonalidade nova, que papel a nota que subiu passa a ter?'
    : 'Na tonalidade nova, que papel a nota que desceu passa a ter?',
  roles: ['1º grau · tônica', '4º grau · subdominante', '5º grau · dominante', '7º grau · sensível'],
  pRoleRevUp: 'Vira a sensível, o 7º grau, meio tom abaixo da nova tônica. A subdominante de uma tonalidade, meio tom acima, é a sensível da vizinha.',
  pRoleRevDown: 'Vira a subdominante, o 4º grau, meio tom acima do novo 3º grau. A sensível de uma tonalidade, meio tom abaixo, é a subdominante da vizinha.',
  why: '<b>Por que justamente elas</b>: a fórmula tem dois semitons, entre os graus 3–4 e 7–8. Quando a tônica muda, esses semitons têm de acompanhá-la. No sentido horário, o semitom 7–8 precisa ficar logo abaixo da nova tônica, e quem está ali é o antigo 4º grau: ele sobe. No anti-horário, o semitom 3–4 precisa ficar logo acima do novo 3º grau, e quem está ali é o antigo 7º: ele desce.',
  transfer: (k: S) => `Em ${k}: qual nota sobe meio tom quando você anda uma casa no sentido horário? E qual desce no anti-horário?`,
  recap: {
    oneLine: 'São o 4º e o 7º graus, porque são as notas coladas nos dois semitons da fórmula (3–4 e 7–8): quando a tônica anda uma quinta, um desses semitons muda de lugar e só uma dessas notas precisa andar meio tom para acompanhá-lo.',
    confusions: [
      '<b>Horário × anti-horário</b>: cada sentido mexe numa dobradiça só: no horário o 4º sobe, no anti-horário o 7º desce. Nunca as duas no mesmo passo.',
      '<b>Mesma nota, papel novo</b>: a nota que se move não some, ela muda de função. A subdominante, meio tom acima, vira a sensível da vizinha.',
      '<b>Dobradiça × trítono</b>: as dobradiças são duas notas (4º e 7º graus); o trítono é a distância entre elas, 6 semitons.',
    ],
    show: 'Toque a escala; depois toque de novo com o 4º grau meio tom acima: é a escala da vizinha no sentido horário. Volte e toque com o 7º grau meio tom abaixo: é a vizinha do outro lado.',
  } as RecapText,
};

const en: typeof pt = {
  pMove: (next: S, up: boolean) => up
    ? `Going to <b>${next}</b> (clockwise), one note of this scale goes up a half step. Which key does it move to? Tap it.`
    : `Going to <b>${next}</b> (counter-clockwise), one note of this scale goes down a half step. Which key does it move to? Tap it.`,
  pMoveRev: (deg: S, a: S, b: S) => `Degree ${deg}: ${a} → ${b}. It is the only change; the other six notes stay where they are.`,
  deg4: '4', deg7: '7',
  pRole: (up: boolean): S => up
    ? 'In the new key, what role does the note that went up take on?'
    : 'In the new key, what role does the note that went down take on?',
  roles: ['degree 1 · tonic', 'degree 4 · subdominant', 'degree 5 · dominant', 'degree 7 · leading tone'],
  pRoleRevUp: 'It becomes the leading tone, degree 7, a half step below the new tonic. One key’s subdominant, raised a half step, is its neighbor’s leading tone.',
  pRoleRevDown: 'It becomes the subdominant, degree 4, a half step above the new degree 3. One key’s leading tone, lowered a half step, is its neighbor’s subdominant.',
  why: '<b>Why exactly these two</b>: the formula has two half steps, between degrees 3–4 and 7–8. When the tonic moves, those half steps have to follow it. Clockwise, the 7–8 half step must sit right below the new tonic, and the note there is the old degree 4: it goes up. Counter-clockwise, the 3–4 half step must sit right above the new degree 3, and the note there is the old degree 7: it goes down.',
  transfer: (k: S) => `In ${k}: which note goes up a half step when you move one step clockwise? And which goes down counter-clockwise?`,
  recap: {
    oneLine: 'Degrees 4 and 7, because they are the notes attached to the formula’s two half steps (3–4 and 7–8): when the tonic moves a fifth, one of those half steps moves, and only one of those notes has to shift a half step to follow it.',
    confusions: [
      '<b>Clockwise × counter-clockwise</b>: each direction moves only one hinge: clockwise degree 4 goes up, counter-clockwise degree 7 goes down. Never both in the same step.',
      '<b>Same note, new role</b>: the note that moves does not disappear, it changes function. The subdominant, raised a half step, becomes the neighbor’s leading tone.',
      '<b>Hinge × tritone</b>: the hinges are two notes (degrees 4 and 7); the tritone is the distance between them, 6 half steps.',
    ],
    show: 'Play the scale; then play it again with degree 4 a half step higher: that is the scale of the clockwise neighbor. Go back and play it with degree 7 a half step lower: that is the neighbor on the other side.',
  },
};

export const extras = { pt, en };
