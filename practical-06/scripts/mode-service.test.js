/**
 * @file mode-service.test.js
 * @description Автоматизовані тести (self-checks) та консольний демонстраційний звіт
 * для модуля опрацювання ігрових режимів Тетріс без зовнішніх бібліотек.
 * Практична робота №6. Дисципліна: "Інтернет-програмування".
 * Студент: Миколайчук М. О., група П-425.
 */

import { gameModes } from "./data.js";
import {
  normalizeTitle,
  normalizeCategory,
  validateMode,
  createMode,
  findModeById,
  filterByCategory,
  searchModesByTitle,
  filterAvailableFastModes,
  hasLockedModes,
  allModesHaveValidSpeed,
  getModeSummaries,
  getFormattedLabels,
  calculateAverageSpeed,
  countModesByCategory,
  calculateTotalScorePotential,
  sortModesByTitle,
  sortModesBySpeed,
  addMode,
  updateMode,
  removeMode,
} from "./mode-service.js";

// ==========================================
// Утиліти для тестування (Self-Check Runner)
// ==========================================
let passedTests = 0;
let totalTests = 0;

function assertEqual(actual, expected, message) {
  totalTests++;
  if (actual !== expected) {
    throw new Error(`[FAIL] ${message}: Очікувалося '${expected}', отримано '${actual}'`);
  }
  passedTests++;
  console.log(`  [OK] ${message}`);
}

function assertTrue(condition, message) {
  totalTests++;
  if (!condition) {
    throw new Error(`[FAIL] ${message}: Умова не виконана (false)`);
  }
  passedTests++;
  console.log(`  [OK] ${message}`);
}

function assertDeepEqual(actual, expected, message) {
  totalTests++;
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`[FAIL] ${message}:\n Очікувалося: ${expectedStr}\n Отримано:   ${actualStr}`);
  }
  passedTests++;
  console.log(`  [OK] ${message}`);
}

console.log("===============================================================");
console.log("  ПРАКТИЧНА РОБОТА №6: АВТОМАТИЗОВАНІ ТЕСТИ (SELF-CHECKS)     ");
console.log("  Студент: Миколайчук М. О. | Дисципліна: Інтернет-програмування");
console.log("===============================================================\n");

// -------------------------------------------------------------
// Тест 1: Нормалізація рядка назви (обрізка та згортання пробілів)
// -------------------------------------------------------------
console.log("Група 1: Нормалізація та валідація даних");
assertEqual(
  normalizeTitle("   Тетріс   Турбо    Бліц   "),
  "Тетріс Турбо Бліц",
  "Тест 1: Нормалізація назви з множинними пробілами"
);

assertEqual(
  normalizeTitle(12345),
  "",
  "Тест 2: Нормалізація нерядкового значення (число) повертає порожній рядок"
);

assertEqual(
  normalizeCategory("   SpRinT  "),
  "sprint",
  "Тест 3: Нормалізація категорії до нижнього регістру без пробілів"
);

// -------------------------------------------------------------
// Тест 4: Успішна валідація коректного об'єкта
// -------------------------------------------------------------
const validTestInput = {
  title: " Кастомний Режим 2026 ",
  category: "classic",
  speed: 400,
  scoreMultiplier: 1.2,
  isAvailable: true,
};
const validResult = validateMode(validTestInput);
assertTrue(validResult.isValid && validResult.errors.length === 0, "Тест 4: Валідація коректного об'єкта");

// -------------------------------------------------------------
// Тест 5: Неуспішна валідація некоректних полів
// -------------------------------------------------------------
const invalidTestInput = {
  title: "AB", // занадто коротка назва (< 3)
  category: "unknown-space", // неприпустима категорія
  speed: -50, // від'ємна швидкість
  scoreMultiplier: 15.0, // перевищує 10.0
  isAvailable: "yes", // не boolean
};
const invalidResult = validateMode(invalidTestInput);
assertTrue(!invalidResult.isValid && invalidResult.errors.length === 5, "Тест 5: Виявлення всіх 5 помилок валідації");

// -------------------------------------------------------------
// Тест 6: Фабрика createMode з граничним значенням швидкості (30 мс)
// -------------------------------------------------------------
const edgeMode = createMode(
  {
    title: "Надшвидкісний режим 30мс",
    category: "survival",
    speed: 30, // мінімально допустима швидкість
    scoreMultiplier: 10.0, // максимально допустимий множник
    isAvailable: false,
  },
  99
);
assertTrue(edgeMode !== null && edgeMode.id === 99 && edgeMode.speed === 30, "Тест 6: Створення об'єкта з граничними числовими параметрами");

// -------------------------------------------------------------
// Тест 7: Пошук за id через find (наявний та відсутній запис)
// -------------------------------------------------------------
console.log("\nГрупа 2: Пошук, фільтрація та умови");
const found = findModeById(gameModes, 2);
assertEqual(found?.title, "Спринт 40 ліній", "Тест 7.1: find знаходить існуючий запис за id=2");

const notFound = findModeById(gameModes, 9999);
assertEqual(notFound, undefined, "Тест 7.2: find повертає undefined для неіснуючого id");

// -------------------------------------------------------------
// Тест 8: Фільтрація за категорією та текстовий пошук без урахування регістру
// -------------------------------------------------------------
const classicModes = filterByCategory(gameModes, "classic");
assertEqual(classicModes.length, 3, "Тест 8.1: filter знаходить 3 режими категорії 'classic'");

const emptyFilter = filterByCategory(gameModes, "non-existent-cat");
assertEqual(emptyFilter.length, 0, "Тест 8.2: filter повертає порожній масив, якщо категорія не знайдена");

const searchResults = searchModesByTitle(gameModes, "гравітація");
assertEqual(searchResults.length, 1, "Тест 8.3: Текстовий регістронезалежний пошук за словом 'гравітація'");

const combinedFast = filterAvailableFastModes(gameModes, 250);
assertTrue(
  combinedFast.every((m) => m.isAvailable && m.speed <= 250),
  "Тест 8.4: Комбінований фільтр (isAvailable && speed <= 250)"
);

// -------------------------------------------------------------
// Тест 9: Перевірка предикатів some та every
// -------------------------------------------------------------
assertTrue(hasLockedModes(gameModes), "Тест 9.1: some підтверджує наявність заблокованих режимів");
assertTrue(allModesHaveValidSpeed(gameModes), "Тест 9.2: every підтверджує валідність швидкостей усіх режимів");

// -------------------------------------------------------------
// Тест 10: Агрегація через reduce та захист від ділення на нуль
// -------------------------------------------------------------
console.log("\nГрупа 3: Перетворення, агрегація та сортування");
const avgSpeed = calculateAverageSpeed(gameModes);
assertTrue(avgSpeed > 0 && typeof avgSpeed === "number", `Тест 10.1: calculateAverageSpeed повертає ${avgSpeed} мс`);

const zeroDivisionCheck = calculateAverageSpeed([]);
assertEqual(zeroDivisionCheck, 0, "Тест 10.2: calculateAverageSpeed на порожньому масиві повертає 0 (захист від NaN)");

const categoryStats = countModesByCategory(gameModes);
assertEqual(categoryStats["arcade"], 4, "Тест 10.3: reduce коректно підрахував 4 режими категорії 'arcade'");

// -------------------------------------------------------------
// Тест 11: Сортування українських назв через localeCompare без мутації
// -------------------------------------------------------------
const originalFirstId = gameModes[0].id;
const sortedByTitle = sortModesByTitle(gameModes);
assertEqual(
  sortedByTitle[0].title.startsWith("Абсолютний"),
  true,
  "Тест 11.1: sortModesByTitle ставить 'Абсолютний...' на перше місце (українська локаль)"
);
assertEqual(
  gameModes[0].id,
  originalFirstId,
  "Тест 11.2: Початковий масив НЕ зазнав мутацій після сортування за назвою"
);

// -------------------------------------------------------------
// Тест 12: Чисті незмінювані CRUD-операції (Add, Update, Remove)
// -------------------------------------------------------------
console.log("\nГрупа 4: Незмінювані CRUD-операції та цілісність даних");
const newCustomMode = {
  id: 101,
  title: "Тестовий Ретро Мод",
  category: "classic",
  speed: 600,
  scoreMultiplier: 1.1,
  isAvailable: true,
};

// Add
const initialLength = gameModes.length;
const withAdded = addMode(gameModes, newCustomMode);
assertEqual(withAdded.length, initialLength + 1, "Тест 12.1: addMode повертає новий масив збільшеної довжини");
assertEqual(gameModes.length, initialLength, "Тест 12.2: Початковий масив не змінено після addMode");

// Update & захист ID
const updatedList = updateMode(withAdded, 101, {
  title: "Оновлений Ретро Мод",
  id: 999, // Спроба підмінити ID повинна бути проігнорована!
  speed: 550,
});
const updatedItem = findModeById(updatedList, 101);
assertEqual(updatedItem?.title, "Оновлений Ретро Мод", "Тест 12.3: updateMode оновив назву");
assertEqual(updatedItem?.id, 101, "Тест 12.4: updateMode ЗАХИСТИВ id від модифікації (залишився 101, а не 999)");

// Remove
const withRemoved = removeMode(updatedList, 101);
assertEqual(withRemoved.length, initialLength, "Тест 12.5: removeMode видалив доданий елемент");
assertEqual(findModeById(withRemoved, 101), undefined, "Тест 12.6: Режим із id=101 відсутній у новому масиві");

// -------------------------------------------------------------
// Підсумок тестів
// -------------------------------------------------------------
console.log("\n---------------------------------------------------------------");
console.log(`РЕЗУЛЬТАТ ТЕСТУВАННЯ: Успішно пройдено ${passedTests} з ${totalTests} перевірок (100%).`);
console.log("---------------------------------------------------------------\n");

// ==========================================
// Демонстраційний консольний звіт
// ==========================================
console.log("===============================================================");
console.log("           ДЕМОНСТРАЦІЙНИЙ КОНСОЛЬНИЙ ЗВІТ РОБОТИ              ");
console.log("===============================================================");
console.log(`1. Загальна кількість ігрових режимів: ${gameModes.length} шт.`);

console.log("\n2. Розподіл режимів за категоріями (reduce):");
const catCounts = countModesByCategory(gameModes);
Object.entries(catCounts).forEach(([cat, count]) => {
  console.log(`   - ${cat.padEnd(12)}: ${count} режим(ів)`);
});

console.log(`\n3. Статистичні показники:`);
console.log(`   - Середня швидкість падіння блоків: ${calculateAverageSpeed(gameModes)} мс`);
console.log(`   - Загальний потенціал множників доступних режимів: ${calculateTotalScorePotential(gameModes)}x`);

console.log("\n4. Зразок коротких представлень (map):");
const summaries = getModeSummaries(gameModes).slice(0, 3);
summaries.forEach((s) => console.log(`   [#${s.id}] ${s.title} (${s.category})`));

console.log("\n5. Приклад комбінованої фільтрації (доступні швидкісні режими, speed <= 250мс):");
const fastModes = filterAvailableFastModes(gameModes, 250);
fastModes.forEach((m) => {
  console.log(`   * #${m.id} "${m.title}" -> швидкість ${m.speed}мс (множник x${m.scoreMultiplier})`);
});

console.log("\n6. Приклад форматованого лейблу (user-facing label):");
const labels = getFormattedLabels(gameModes);
console.log(`   ${labels[0]}`);
console.log(`   ${labels[4]}`);

console.log("\n7. Сортування за швидкістю (від найшвидших/найскладніших):");
const sortedSpeed = sortModesBySpeed(gameModes, true).slice(0, 3);
sortedSpeed.forEach((m, idx) => {
  console.log(`   ТОП-${idx + 1}: #${m.id} "${m.title}" — швидкість ${m.speed} мс/блок`);
});

console.log("\n===============================================================");
console.log("             ЗВІТ УСПІШНО ЗГЕНЕРОВАНО ТА ЗАВЕРШЕНО             ");
console.log("===============================================================");
