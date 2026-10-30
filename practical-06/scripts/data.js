/**
 * @file data.js
 * @description Початковий набір даних ігрових режимів Тетріс (GameMode).
 * Практична робота №6 з дисципліни "Інтернет-програмування".
 * Студент: Миколайчук М. О., група П-425.
 */

export const gameModes = [
  {
    id: 1,
    title: "Класичний Марафон",
    category: "classic",
    speed: 500,
    scoreMultiplier: 1.0,
    isAvailable: true,
  },
  {
    id: 2,
    title: "Спринт 40 ліній",
    category: "sprint",
    speed: 350,
    scoreMultiplier: 1.5,
    isAvailable: true,
  },
  {
    id: 3,
    title: "Ультра Швидкість (Бліц 2 хвилини)",
    category: "arcade",
    speed: 150,
    scoreMultiplier: 2.0,
    isAvailable: true,
  },
  {
    id: 4,
    title: "Майстер Блоків (Складні пентаміно та перешкоди)",
    category: "arcade",
    speed: 280,
    scoreMultiplier: 1.8,
    isAvailable: false,
  },
  {
    id: 5,
    title: "Хардкор Гравітація 20G (Миттєве падіння тетраміно на дно поля)",
    category: "survival",
    speed: 50,
    scoreMultiplier: 3.5,
    isAvailable: false,
  },
  {
    id: 6,
    title: "Неон Челендж",
    category: "arcade",
    speed: 220,
    scoreMultiplier: 1.6,
    isAvailable: true,
  },
  {
    id: 7,
    title: "Релакс Дзен (Повільна гра без обмеження часу та прискорення)",
    category: "classic",
    speed: 850,
    scoreMultiplier: 0.8,
    isAvailable: true,
  },
  {
    id: 8,
    title: "Дзеркальне Поле",
    category: "arcade",
    speed: 300,
    scoreMultiplier: 2.2,
    isAvailable: false,
  },
  {
    id: 9,
    title: "Виживання у темряві (Огляд обмежено радіусом трьох клітинок)",
    category: "survival",
    speed: 180,
    scoreMultiplier: 2.8,
    isAvailable: false,
  },
  {
    id: 10,
    title: "Абсолютний Чемпіонат Світу за класичними правилами Тетріс 1989 року",
    category: "classic",
    speed: 400,
    scoreMultiplier: 1.4,
    isAvailable: true,
  },
];
