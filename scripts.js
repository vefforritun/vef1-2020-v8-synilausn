/**
 * Verkefni 8 – Caesar dulmál með vefviðmóti
 *
 * Verður að passa _nákvæmlega_ við gefið HTML, mun annars brotna.
 * Þ.e.a.s., ekki meðhöndlun á HTML elementum sem vantar
 */

/**
 * Kóðar streng með því að hliðra honum um n stök.
 *
 * @param {string} str Strengur sem skal kóða, aðeins stafir í stafrófi
 * @param {number} n Hliðrun, heiltala á bilinu [0, lengd stafrófs]
 * @param {string} alphabet Stafróf sem afkóða á út frá
 * @returns {string} Upprunalegi strengurinn hliðraður um n til hægri
 */
function encode(str, n, alphabet = '') {
  // dæmi sem notar for lykkju

  // Skilum tómastreng ef hliðrun lengri en stafróf
  if (n > alphabet.length) {
    return '';
  }

  // Skilum tómastreng ef str er falsy
  if (!str) {
    return '';
  }

  const upper = str.toLocaleUpperCase();

  let result = '';
  for (let i = 0; i < str.length; i += 1) {
    const index = alphabet.indexOf(upper[i]);

    // Bara birta stafi sem eru ekki í stafrófi
    if (index >= 0) {
      result += alphabet[(index + n) % alphabet.length];
    }
  }
  return result;
}

/**
 * Afkóðar streng með því að hliðra honum um n stök.
 *
 * @param {string} str Strengur sem skal afkóða, aðeins stafir í stafrófi
 * @param {number} n Hliðrun, heiltala á bilinu [0, lengd stafrófs]
 * @param {string} alphabet Stafróf sem afkóða á út frá
 * @returns {string} Upprunalegi strengurinn hliðraður um n til vinstri
 */
function decode(str, n, alphabet = '') {
  // dæmi sem notar „fallaforritun“

  // Skilum tómastreng ef hliðrun lengri en stafróf
  if (n > alphabet.length) {
    return '';
  }

  // Strengur eða tómi strengur ef str er falsy
  return (str || '')
    .toLocaleUpperCase()
    .split('')
    // hliðruð staðsetning stafs, eða ef ekki í stafrófi, null
    .map((s) => (alphabet.indexOf(s) < 0 ? null : alphabet.indexOf(s) - n))
    // ef i verður neikvætt, förum aftast í stafróf, null verður sent áfram
    .map((i) => (i < 0 ? alphabet.length + i : i))
    // prenta staf eða tómastreng ef i null
    .map((i) => (alphabet[i] ? alphabet[i] : ''))
    .join('');
}

const Caesar = (() => {
  // Default stafróf, uppfært þegar slegið inn í "alphabet"
  let alphabet = 'AÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖ';

  // Default type, uppfært af radio input
  let type = 'encode';

  // Default hliðrun, uppfært af "shift"
  let shift = 3;

  // Vísun í hliðrunar element og gildi, breytum max þegar input er breytt
  let shiftEl;
  let shiftValueEl;

  // Núverandi input, breytist þegar slegið inn í "input"
  let currentInput;

  // Vísir í element þar sem við sýnum niðurstöðu
  let result = '';

  /**
   * Skrifar út niðurstöðu af því að afkóða eða kóða það sem skrifað er
   */
  function writeResult() {
    const args = [currentInput, shift, alphabet];
    const output = type === 'encode' ? encode(...args) : decode(...args);

    result.textContent = output;
  }

  /**
   * Uppfærir
   * @param {InputEvent} e Event sem kom upp
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
   */
  function updateAlphabet(e) {
    console.log('e :>> ', e);
    alphabet = e.target.value;
    shiftEl.setAttribute('max', alphabet.length);

    if (shift > alphabet.length) {
      shift = alphabet.length;
      shiftEl.value = shift;
      shiftValueEl.textContent = shift;
    }

    writeResult();
  }

  function updateType(e) {
    type = e.target.value;
    writeResult();
  }

  function updateShift(e) {
    shift = parseInt(e.target.value, 10);
    shiftValueEl.textContent = shift;
    writeResult();
  }

  function updateInput(e) {
    currentInput = e.target.value;
    shiftEl.setAttribute('max', alphabet.length);
    writeResult();
  }

  function init(el) {
    // Finnum öll input sem eiga við element og festum event handlera

    // Breytingar á stafrófi
    el
      .querySelector('[name=alphabet]')
      .addEventListener('input', updateAlphabet);

    // Bæði radio input
    el
      .querySelectorAll('[name=type]')
      .forEach((i) => i.addEventListener('change', updateType));

    // Strengur til að afkóða/kóða
    el
      .querySelector('[name=input]')
      .addEventListener('input', updateInput);

    shiftValueEl = el.querySelector('.shiftValue');
    shiftEl = el.querySelector('[name=shift]');
    shiftEl.addEventListener('input', updateShift);

    // Geyma vísun í result til að geta skrifað út jafnóðum
    result = el.querySelector('.result');
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const ceasarForm = document.querySelector('.ceasar');

  Caesar.init(ceasarForm);
});
