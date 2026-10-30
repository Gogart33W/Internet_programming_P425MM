/**
 * @file mode-service.js
 * @description Модуль бізнес-логіки та чистих функцій опрацювання даних ігрових режимів Тетріс.
 * Реалізовано нормалізацію, валідацію, пошук, фільтрацію, агрегацію та незмінювані CRUD-операції.
 * Практична робота №6. Дисципліна: "Інтернет-програмування".
 * Студент: Миколайчук М. О., група П-425.
 */

// Допустимі категорії ігрових режимів
export const ALLOWED_CATEGORIES = Object.freeze(["classic", "sprint", "survival", "arcade"]);

/**
 * Нормалізація рядка назви режиму: видалення крайніх пробілів та заміна
 * множинних пробільних символів на один одинарний пробіл.
 * @param {any} value
 * @returns {string}
 */
export function normalizeTitle(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replaceAll(/\s+/g, " ");
}

/**
 * Нормалізація рядка категорії до нижнього регістру без зайвих пробілів.
 * @param {any} value
 * @returns {string}
 */
export function normalizeCategory(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().toLowerCase();
}

/**
 * Перевірка допустимості назви режиму (від 3 до 80 символів).
 * @param {string} title
 * @returns {boolean}
 */
export function isValidTitle(title) {
  return typeof title === "string" && title.length >= 3 && title.length <= 80;
}

/**
 * Перевірка приналежності категорії до дозволеного переліку.
 * @param {string} category
 * @returns {boolean}
 */
export function isValidCategory(category) {
  return ALLOWED_CATEGORIES.includes(category);
}

/**
 * Перевірка швидкості падіння тетраміно (число від 30 до 3000 мілісекунд).
 * @param {any} speed
 * @returns {boolean}
 */
export function isValidSpeed(speed) {
  return Number.isFinite(speed) && speed >= 30 && speed <= 3000;
}

/**
 * Перевірка коефіцієнта нарахування очок (число від 0.1 до 10.0).
 * @param {any} multiplier
 * @returns {boolean}
 */
export function isValidScoreMultiplier(multiplier) {
  return Number.isFinite(multiplier) && multiplier >= 0.1 && multiplier <= 10.0;
}

/**
 * Комплексна валідація даних ігрового режиму.
 * Не друкує в консоль, а повертає узгоджений об'єкт контракту { isValid, errors }.
 * @param {object} input
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateMode(input) {
  const errors = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ["Вхідні дані повинні бути непустим об'єктом."],
    };
  }

  const normalizedTitle = normalizeTitle(input.title);
  if (!isValidTitle(normalizedTitle)) {
    errors.push("Назва режиму повинна містити від 3 до 80 символів.");
  }

  const normalizedCat = normalizeCategory(input.category);
  if (!isValidCategory(normalizedCat)) {
    errors.push(`Неприпустима категорія '${input.category}'. Дозволені: ${ALLOWED_CATEGORIES.join(", ")}.`);
  }

  if (!isValidSpeed(input.speed)) {
    errors.push("Швидкість падіння блоків має бути скінченним числом у межах [30, 3000] мс.");
  }

  if (!isValidScoreMultiplier(input.scoreMultiplier)) {
    errors.push("Множник очок має бути числом у діапазоні [0.1, 10.0].");
  }

  if (typeof input.isAvailable !== "boolean") {
    errors.push("Поле доступності 'isAvailable' повинно мати булевий тип (true/false).");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Створення нового стандартизованого об'єкта режиму на основі сирих даних та ID.
 * Повертає null, якщо валідація зазнала невдачі.
 * @param {object} input
 * @param {number} id
 * @returns {object|null}
 */
export function createMode(input, id) {
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const validation = validateMode(input);
  if (!validation.isValid) {
    return null;
  }

  return {
    id,
    title: normalizeTitle(input.title),
    category: normalizeCategory(input.category),
    speed: Number(input.speed),
    scoreMultiplier: Number(input.scoreMultiplier),
    isAvailable: Boolean(input.isAvailable),
  };
}

/**
 * Пошук режиму за унікальним id через метод find.
 * @param {Array} modes
 * @param {number} id
 * @returns {object|undefined}
 */
export function findModeById(modes, id) {
  if (!Array.isArray(modes)) return undefined;
  return modes.find((mode) => mode.id === id);
}

/**
 * Фільтрація режимів за категорією через метод filter.
 * @param {Array} modes
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(modes, category) {
  if (!Array.isArray(modes)) return [];
  const normalized = normalizeCategory(category);
  return modes.filter((mode) => mode.category === normalized);
}

/**
 * Текстовий пошук за підрядком у назві без урахування регістру.
 * @param {Array} modes
 * @param {string} query
 * @returns {Array}
 */
export function searchModesByTitle(modes, query) {
  if (!Array.isArray(modes)) return [];
  if (typeof query !== "string") return [];
  const cleaned = query.trim().toLowerCase();
  if (cleaned.length === 0) return [...modes];
  return modes.filter((mode) => mode.title.toLowerCase().includes(cleaned));
}

/**
 * Комбінований фільтр: вибирає лише доступні режими зі швидкістю не гірше (не вище) maxSpeed.
 * @param {Array} modes
 * @param {number} maxSpeed
 * @returns {Array}
 */
export function filterAvailableFastModes(modes, maxSpeed = 300) {
  if (!Array.isArray(modes)) return [];
  return modes.filter((mode) => mode.isAvailable && mode.speed <= maxSpeed);
}

/**
 * Перевірка через some: чи є серед режимів недоступні (заблоковані) для початківця.
 * @param {Array} modes
 * @returns {boolean}
 */
export function hasLockedModes(modes) {
  if (!Array.isArray(modes) || modes.length === 0) return false;
  return modes.some((mode) => !mode.isAvailable);
}

/**
 * Перевірка через every: чи всі режими мають коректно визначену додатну швидкість.
 * @param {Array} modes
 * @returns {boolean}
 */
export function allModesHaveValidSpeed(modes) {
  if (!Array.isArray(modes) || modes.length === 0) return false;
  return modes.every((mode) => Number.isFinite(mode.speed) && mode.speed > 0);
}

/**
 * Трансформація списку через map: повертає короткі представлення для селектора UI.
 * @param {Array} modes
 * @returns {Array<{id: number, title: string, category: string}>}
 */
export function getModeSummaries(modes) {
  if (!Array.isArray(modes)) return [];
  return modes.map(({ id, title, category }) => ({ id, title, category }));
}

/**
 * Формування людиночитабельних лейблів через map.
 * @param {Array} modes
 * @returns {string[]}
 */
export function getFormattedLabels(modes) {
  if (!Array.isArray(modes)) return [];
  return modes.map((mode) => {
    const status = mode.isAvailable ? "ВІДКРИТО" : "ЗАБЛОКОВАНО";
    return `[${mode.category.toUpperCase()}] ${mode.title} (швидкість: ${mode.speed}мс, множник: x${mode.scoreMultiplier}) - ${status}`;
  });
}

/**
 * Обчислення середньої швидкості реакції/падіння фігур через reduce.
 * Безпечно обробляє порожній масив (унеможливлює division by zero).
 * @param {Array} modes
 * @returns {number}
 */
export function calculateAverageSpeed(modes) {
  if (!Array.isArray(modes) || modes.length === 0) {
    return 0;
  }
  const totalSpeed = modes.reduce((sum, mode) => sum + (Number.isFinite(mode.speed) ? mode.speed : 0), 0);
  return Number((totalSpeed / modes.length).toFixed(2));
}

/**
 * Агрегація та підрахунок кількості режимів за категоріями через reduce.
 * @param {Array} modes
 * @returns {Record<string, number>}
 */
export function countModesByCategory(modes) {
  if (!Array.isArray(modes)) return {};
  return modes.reduce((acc, mode) => {
    const cat = mode.category || "unknown";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Підрахунок сумарного множника очок усіх доступних режимів через reduce.
 * @param {Array} modes
 * @returns {number}
 */
export function calculateTotalScorePotential(modes) {
  if (!Array.isArray(modes) || modes.length === 0) return 0;
  const total = modes.reduce((sum, mode) => {
    return mode.isAvailable ? sum + mode.scoreMultiplier : sum;
  }, 0);
  return Number(total.toFixed(2));
}

/**
 * Незмінюване сортування за назвою з урахуванням української локалі (localeCompare).
 * Початковий масив НЕ мутується.
 * @param {Array} modes
 * @returns {Array}
 */
export function sortModesByTitle(modes) {
  if (!Array.isArray(modes)) return [];
  return [...modes].sort((a, b) => a.title.localeCompare(b.title, "uk", { sensitivity: "base" }));
}

/**
 * Незмінюване числове сортування за швидкістю падіння тетраміно.
 * Початковий масив НЕ мутується.
 * @param {Array} modes
 * @param {boolean} ascending
 * @returns {Array}
 */
export function sortModesBySpeed(modes, ascending = true) {
  if (!Array.isArray(modes)) return [];
  return [...modes].sort((a, b) => (ascending ? a.speed - b.speed : b.speed - a.speed));
}

/**
 * Незмінюване додавання нового запису (CRUD - Create).
 * Повертає новий масив без зміни вхідного.
 * @param {Array} modes
 * @param {object} newMode
 * @returns {Array}
 */
export function addMode(modes, newMode) {
  if (!Array.isArray(modes)) return [];
  const validation = validateMode(newMode);
  if (!validation.isValid || !newMode.id) {
    throw new Error(`Неможливо додати режим: невалідна структура або відсутній id. Помилки: ${validation.errors.join("; ")}`);
  }
  const isDuplicateId = modes.some((m) => m.id === newMode.id);
  if (isDuplicateId) {
    throw new Error(`Режим із id=${newMode.id} вже існує в базі даних.`);
  }
  return [...modes, Object.freeze({ ...newMode })];
}

/**
 * Незмінюване оновлення існуючого запису (CRUD - Update).
 * Забороняє зміну id через об'єкт змін changes.
 * Якщо modeId відсутній, повертає новий масив із незміненими елементами.
 * @param {Array} modes
 * @param {number} modeId
 * @param {object} changes
 * @returns {Array}
 */
export function updateMode(modes, modeId, changes) {
  if (!Array.isArray(modes)) return [];
  if (!changes || typeof changes !== "object") return [...modes];

  // Деструктуризація для захисту від модифікації ідентифікатора
  const { id: _ignoredId, ...safeChanges } = changes;

  return modes.map((mode) => {
    if (mode.id !== modeId) {
      return mode;
    }
    const updatedCandidate = { ...mode, ...safeChanges };
    const validation = validateMode(updatedCandidate);
    if (!validation.isValid) {
      throw new Error(`Оновлення режиму id=${modeId} відхилено: ${validation.errors.join("; ")}`);
    }
    return Object.freeze(updatedCandidate);
  });
}

/**
 * Незмінюване видалення запису за ідентифікатором (CRUD - Delete).
 * Повертає новий масив через filter.
 * @param {Array} modes
 * @param {number} modeId
 * @returns {Array}
 */
export function removeMode(modes, modeId) {
  if (!Array.isArray(modes)) return [];
  return modes.filter((mode) => mode.id !== modeId);
}
