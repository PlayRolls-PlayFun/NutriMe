// Локальная база продуктов (значения на порцию)
export const FOOD_IMAGES = {
  breakfast: require('../../assets/food/breakfast.png'),
  soups: require('../../assets/food/soups.png'),
  main: require('../../assets/food/main.png'),
  salads: require('../../assets/food/salads.png'),
  snacks: require('../../assets/food/snacks.png'),
  drinks: require('../../assets/food/drinks.png'),
  fruits: require('../../assets/food/fruits.png'),
  dairy: require('../../assets/food/dairy.png'),
};

export const getFoodImage = (category) => FOOD_IMAGES[category] || FOOD_IMAGES.main;

export const CATEGORIES = [
  { id: 'breakfast', name: 'Завтраки' },
  { id: 'soups', name: 'Супы' },
  { id: 'main', name: 'Основные блюда' },
  { id: 'salads', name: 'Салаты' },
  { id: 'snacks', name: 'Перекусы' },
  { id: 'drinks', name: 'Напитки' },
  { id: 'fruits', name: 'Фрукты и ягоды' },
  { id: 'dairy', name: 'Молочные продукты' },
];

export const FOODS = [
  { name: 'Овсянка с ягодами', category: 'breakfast', calories: 320, protein: 9, fat: 6, carbs: 58, weight: 250, portion: '1 тарелка', ingredients: ['Овсяные хлопья', 'Молоко 2.5%', 'Черника', 'Малина', 'Мёд'] },
  { name: 'Омлет из 2 яиц', category: 'breakfast', calories: 220, protein: 14, fat: 17, carbs: 2, weight: 120, portion: '1 порция', ingredients: ['Яйца', 'Молоко', 'Сливочное масло', 'Соль'] },
  { name: 'Сырники со сметаной', category: 'breakfast', calories: 380, protein: 21, fat: 16, carbs: 36, weight: 180, portion: '3 шт.', ingredients: ['Творог 5%', 'Яйцо', 'Мука', 'Сахар', 'Сметана'] },
  { name: 'Тост с авокадо', category: 'breakfast', calories: 290, protein: 7, fat: 18, carbs: 26, weight: 150, portion: '1 тост', ingredients: ['Цельнозерновой хлеб', 'Авокадо', 'Лимонный сок', 'Соль', 'Перец'] },
  { name: 'Гречневая каша', category: 'breakfast', calories: 250, protein: 8, fat: 3, carbs: 48, weight: 200, portion: '1 тарелка', ingredients: ['Гречка', 'Вода', 'Сливочное масло', 'Соль'] },
  { name: 'Борщ', category: 'soups', calories: 210, protein: 9, fat: 9, carbs: 22, weight: 300, portion: '1 тарелка', ingredients: ['Свёкла', 'Капуста', 'Картофель', 'Говядина', 'Морковь', 'Лук'] },
  { name: 'Куриный суп с лапшой', category: 'soups', calories: 180, protein: 12, fat: 5, carbs: 20, weight: 300, portion: '1 тарелка', ingredients: ['Куриное филе', 'Лапша', 'Морковь', 'Лук', 'Зелень'] },
  { name: 'Крем-суп из тыквы', category: 'soups', calories: 160, protein: 4, fat: 7, carbs: 21, weight: 280, portion: '1 тарелка', ingredients: ['Тыква', 'Сливки', 'Лук', 'Чеснок', 'Оливковое масло'] },
  { name: 'Куриная грудка на гриле', category: 'main', calories: 260, protein: 42, fat: 8, carbs: 1, weight: 180, portion: '1 порция', ingredients: ['Куриное филе', 'Оливковое масло', 'Специи'] },
  { name: 'Лосось запечённый', category: 'main', calories: 340, protein: 34, fat: 21, carbs: 1, weight: 160, portion: '1 стейк', ingredients: ['Лосось', 'Лимон', 'Оливковое масло', 'Укроп'] },
  { name: 'Паста болоньезе', category: 'main', calories: 480, protein: 24, fat: 17, carbs: 56, weight: 320, portion: '1 порция', ingredients: ['Спагетти', 'Говяжий фарш', 'Томаты', 'Лук', 'Пармезан'] },
  { name: 'Плов с курицей', category: 'main', calories: 420, protein: 22, fat: 14, carbs: 52, weight: 300, portion: '1 порция', ingredients: ['Рис', 'Курица', 'Морковь', 'Лук', 'Специи'] },
  { name: 'Гречка с котлетой', category: 'main', calories: 450, protein: 26, fat: 18, carbs: 44, weight: 320, portion: '1 порция', ingredients: ['Гречка', 'Куриная котлета', 'Масло'] },
  { name: 'Рис с овощами', category: 'main', calories: 310, protein: 7, fat: 8, carbs: 54, weight: 280, portion: '1 порция', ingredients: ['Рис', 'Брокколи', 'Морковь', 'Горошек', 'Соевый соус'] },
  { name: 'Салат Цезарь с курицей', category: 'salads', calories: 350, protein: 26, fat: 20, carbs: 15, weight: 250, portion: '1 порция', ingredients: ['Романо', 'Куриное филе', 'Пармезан', 'Сухарики', 'Соус цезарь'] },
  { name: 'Греческий салат', category: 'salads', calories: 230, protein: 7, fat: 18, carbs: 10, weight: 220, portion: '1 порция', ingredients: ['Помидоры', 'Огурцы', 'Фета', 'Оливки', 'Оливковое масло'] },
  { name: 'Салат с тунцом', category: 'salads', calories: 280, protein: 24, fat: 14, carbs: 12, weight: 230, portion: '1 порция', ingredients: ['Тунец', 'Листья салата', 'Яйцо', 'Огурец', 'Оливковое масло'] },
  { name: 'Овощной салат', category: 'salads', calories: 120, protein: 3, fat: 7, carbs: 12, weight: 200, portion: '1 порция', ingredients: ['Помидоры', 'Огурцы', 'Перец', 'Зелень', 'Масло'] },
  { name: 'Греческий йогурт', category: 'dairy', calories: 130, protein: 12, fat: 5, carbs: 8, weight: 170, portion: '1 стакан', ingredients: ['Йогурт греческий 4%'] },
  { name: 'Творог 5%', category: 'dairy', calories: 180, protein: 26, fat: 8, carbs: 5, weight: 150, portion: '1 пачка', ingredients: ['Творог 5%'] },
  { name: 'Кефир 1%', category: 'dairy', calories: 90, protein: 7, fat: 2, carbs: 9, weight: 250, portion: '1 стакан', ingredients: ['Кефир 1%'] },
  { name: 'Протеиновый батончик', category: 'snacks', calories: 210, protein: 20, fat: 8, carbs: 17, weight: 60, portion: '1 шт.', ingredients: ['Протеин', 'Орехи', 'Какао', 'Подсластитель'] },
  { name: 'Горсть миндаля', category: 'snacks', calories: 170, protein: 6, fat: 15, carbs: 5, weight: 30, portion: '30 г', ingredients: ['Миндаль'] },
  { name: 'Хлебцы с хумусом', category: 'snacks', calories: 150, protein: 5, fat: 6, carbs: 19, weight: 70, portion: '2 шт.', ingredients: ['Хлебцы', 'Хумус'] },
  { name: 'Яблоко', category: 'fruits', calories: 95, protein: 0.5, fat: 0.3, carbs: 25, weight: 180, portion: '1 шт.', ingredients: ['Яблоко'] },
  { name: 'Банан', category: 'fruits', calories: 105, protein: 1.3, fat: 0.4, carbs: 27, weight: 120, portion: '1 шт.', ingredients: ['Банан'] },
  { name: 'Апельсин', category: 'fruits', calories: 62, protein: 1.2, fat: 0.2, carbs: 15, weight: 130, portion: '1 шт.', ingredients: ['Апельсин'] },
  { name: 'Черника', category: 'fruits', calories: 85, protein: 1.1, fat: 0.5, carbs: 21, weight: 150, portion: '1 стакан', ingredients: ['Черника'] },
  { name: 'Кофе с молоком', category: 'drinks', calories: 60, protein: 3, fat: 3, carbs: 5, weight: 200, portion: '1 чашка', ingredients: ['Эспрессо', 'Молоко 2.5%'] },
  { name: 'Смузи ягодный', category: 'drinks', calories: 180, protein: 5, fat: 2, carbs: 36, weight: 300, portion: '1 стакан', ingredients: ['Клубника', 'Банан', 'Йогурт', 'Мёд'] },
  { name: 'Зелёный чай', category: 'drinks', calories: 2, protein: 0, fat: 0, carbs: 0.5, weight: 250, portion: '1 чашка', ingredients: ['Зелёный чай'] },
];

export const MEAL_TYPES = [
  { id: 'breakfast', name: 'Завтрак' },
  { id: 'lunch', name: 'Обед' },
  { id: 'dinner', name: 'Ужин' },
  { id: 'snack', name: 'Перекус' },
];

export const ACHIEVEMENTS = [
  { id: 'first_meal', title: 'Первый шаг', description: 'Добавьте первое блюдо в дневник', target: 1 },
  { id: 'water_goal', title: 'Водный баланс', description: 'Выполните дневную цель по воде', target: 1 },
  { id: 'meals_10', title: 'Дисциплина', description: 'Добавьте 10 блюд в дневник', target: 10 },
  { id: 'weight_log', title: 'Контроль веса', description: 'Запишите свой вес', target: 1 },
  { id: 'scanner_used', title: 'Технологии', description: 'Воспользуйтесь сканером еды', target: 1 },
  { id: 'streak_3', title: 'Серия из 3 дней', description: 'Ведите дневник 3 дня подряд', target: 3 },
  { id: 'activity_first', title: 'В движении', description: 'Добавьте первую тренировку', target: 1 },
  { id: 'meals_50', title: 'Мастер учёта', description: 'Добавьте 50 блюд в дневник', target: 50 },
  { id: 'steps_goal', title: 'Ходок', description: 'Пройдите 10 000 шагов за день', target: 1 },
];

export const TIPS = [
  'Пейте стакан воды сразу после пробуждения — это запускает метаболизм.',
  'Белок на завтрак помогает контролировать аппетит в течение дня.',
  'Старайтесь есть медленно: сигнал о насыщении приходит через 20 минут.',
  '10 000 шагов в день — простой способ увеличить расход калорий.',
  'Готовьте еду заранее, чтобы избежать спонтанных перекусов.',
  'Овощи должны занимать половину вашей тарелки.',
  'Сон менее 7 часов усиливает чувство голода на следующий день.',
];
