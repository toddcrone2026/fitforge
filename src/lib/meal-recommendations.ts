import type { DietaryPreference, MealType } from '@/types'

export interface MealRecommendation {
  name: string
  description: string
  meal_type: MealType
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  ingredients: string[]
  prep_time_min: number
  tag: string
}

export const RECOMMENDATIONS: Record<DietaryPreference, MealRecommendation[]> = {
  plant_based: [
    // Breakfast
    {
      name: 'Tofu Scramble Bowl',
      description: 'Crumbled firm tofu with turmeric, spinach, bell peppers and nutritional yeast',
      meal_type: 'breakfast',
      calories: 320, protein_g: 24, carbs_g: 18, fat_g: 16, fiber_g: 5,
      ingredients: ['firm tofu', 'spinach', 'bell pepper', 'nutritional yeast', 'turmeric', 'olive oil'],
      prep_time_min: 12, tag: 'High Protein',
    },
    {
      name: 'Overnight Oats with Hemp Seeds',
      description: 'Rolled oats soaked with almond milk, topped with hemp seeds, banana and almond butter',
      meal_type: 'breakfast',
      calories: 480, protein_g: 18, carbs_g: 58, fat_g: 18, fiber_g: 8,
      ingredients: ['rolled oats', 'almond milk', 'hemp seeds', 'banana', 'almond butter', 'chia seeds'],
      prep_time_min: 5, tag: 'Meal Prep',
    },
    {
      name: 'Green Protein Smoothie',
      description: 'Spinach, frozen mango, pea protein, flaxseed and oat milk blended smooth',
      meal_type: 'breakfast',
      calories: 380, protein_g: 28, carbs_g: 42, fat_g: 8, fiber_g: 6,
      ingredients: ['spinach', 'frozen mango', 'pea protein powder', 'flaxseed', 'oat milk'],
      prep_time_min: 5, tag: 'Quick',
    },
    // Lunch
    {
      name: 'Lentil & Sweet Potato Bowl',
      description: 'Red lentils, roasted sweet potato, kale, tahini dressing and pumpkin seeds',
      meal_type: 'lunch',
      calories: 520, protein_g: 22, carbs_g: 68, fat_g: 14, fiber_g: 16,
      ingredients: ['red lentils', 'sweet potato', 'kale', 'tahini', 'pumpkin seeds', 'lemon'],
      prep_time_min: 25, tag: 'High Fiber',
    },
    {
      name: 'Chickpea Buddha Bowl',
      description: 'Roasted chickpeas over quinoa with cucumber, tomato, avocado and lemon tahini',
      meal_type: 'lunch',
      calories: 560, protein_g: 24, carbs_g: 64, fat_g: 20, fiber_g: 14,
      ingredients: ['chickpeas', 'quinoa', 'cucumber', 'cherry tomatoes', 'avocado', 'tahini'],
      prep_time_min: 20, tag: 'Complete Protein',
    },
    {
      name: 'Tempeh Veggie Wrap',
      description: 'Marinated tempeh strips, shredded cabbage, carrots, sriracha mayo in a whole wheat wrap',
      meal_type: 'lunch',
      calories: 490, protein_g: 28, carbs_g: 48, fat_g: 16, fiber_g: 9,
      ingredients: ['tempeh', 'whole wheat wrap', 'cabbage', 'carrots', 'avocado', 'sriracha'],
      prep_time_min: 15, tag: 'High Protein',
    },
    // Dinner
    {
      name: 'Black Bean Tacos',
      description: 'Spiced black beans with mango salsa, shredded lettuce and cashew crema',
      meal_type: 'dinner',
      calories: 540, protein_g: 20, carbs_g: 72, fat_g: 16, fiber_g: 16,
      ingredients: ['black beans', 'corn tortillas', 'mango', 'red onion', 'cashews', 'lime'],
      prep_time_min: 20, tag: 'High Fiber',
    },
    {
      name: 'Tofu & Broccoli Stir-Fry',
      description: 'Crispy baked tofu with broccoli, snap peas, ginger-sesame sauce over brown rice',
      meal_type: 'dinner',
      calories: 510, protein_g: 26, carbs_g: 58, fat_g: 14, fiber_g: 8,
      ingredients: ['extra-firm tofu', 'broccoli', 'snap peas', 'brown rice', 'ginger', 'soy sauce', 'sesame oil'],
      prep_time_min: 30, tag: 'High Protein',
    },
    {
      name: 'Quinoa Stuffed Bell Peppers',
      description: 'Bell peppers filled with quinoa, black beans, corn, tomatoes and spices',
      meal_type: 'dinner',
      calories: 420, protein_g: 18, carbs_g: 62, fat_g: 8, fiber_g: 12,
      ingredients: ['bell peppers', 'quinoa', 'black beans', 'corn', 'diced tomatoes', 'cumin'],
      prep_time_min: 35, tag: 'Complete Protein',
    },
    // Snacks
    {
      name: 'Edamame with Sea Salt',
      description: 'Steamed edamame pods lightly salted — a perfect high-protein snack',
      meal_type: 'snack',
      calories: 180, protein_g: 16, carbs_g: 14, fat_g: 6, fiber_g: 8,
      ingredients: ['edamame'],
      prep_time_min: 5, tag: 'High Protein',
    },
    {
      name: 'Hummus & Veggie Plate',
      description: 'Homemade or store-bought hummus with cucumber, carrots and bell pepper strips',
      meal_type: 'snack',
      calories: 220, protein_g: 8, carbs_g: 26, fat_g: 10, fiber_g: 7,
      ingredients: ['hummus', 'cucumber', 'carrots', 'bell pepper'],
      prep_time_min: 5, tag: 'Quick',
    },
    {
      name: 'Trail Mix with Dark Chocolate',
      description: 'Almonds, walnuts, pumpkin seeds, dried cranberries and dark chocolate chips',
      meal_type: 'snack',
      calories: 280, protein_g: 8, carbs_g: 24, fat_g: 18, fiber_g: 4,
      ingredients: ['almonds', 'walnuts', 'pumpkin seeds', 'dried cranberries', 'dark chocolate chips'],
      prep_time_min: 2, tag: 'Energy Boost',
    },
  ],

  pescatarian: [
    // Breakfast
    {
      name: 'Smoked Salmon Avocado Toast',
      description: 'Whole grain toast with mashed avocado, smoked salmon, capers and everything bagel seasoning',
      meal_type: 'breakfast',
      calories: 420, protein_g: 28, carbs_g: 32, fat_g: 20, fiber_g: 7,
      ingredients: ['whole grain bread', 'avocado', 'smoked salmon', 'capers', 'everything bagel seasoning', 'lemon'],
      prep_time_min: 8, tag: 'Omega-3 Rich',
    },
    {
      name: 'Greek Yogurt Parfait',
      description: 'Full-fat Greek yogurt layered with granola, mixed berries, chia seeds and honey',
      meal_type: 'breakfast',
      calories: 380, protein_g: 24, carbs_g: 48, fat_g: 8, fiber_g: 5,
      ingredients: ['Greek yogurt', 'granola', 'mixed berries', 'chia seeds', 'honey'],
      prep_time_min: 5, tag: 'High Protein',
    },
    {
      name: 'Egg & Veggie Frittata',
      description: 'Baked eggs with spinach, mushrooms, cherry tomatoes and feta cheese',
      meal_type: 'breakfast',
      calories: 340, protein_g: 26, carbs_g: 8, fat_g: 22, fiber_g: 2,
      ingredients: ['eggs', 'spinach', 'mushrooms', 'cherry tomatoes', 'feta cheese', 'olive oil'],
      prep_time_min: 20, tag: 'Meal Prep',
    },
    // Lunch
    {
      name: 'Seared Tuna Salad',
      description: 'Seared ahi tuna over mixed greens, edamame, cucumber, avocado with ginger dressing',
      meal_type: 'lunch',
      calories: 480, protein_g: 42, carbs_g: 18, fat_g: 22, fiber_g: 6,
      ingredients: ['ahi tuna', 'mixed greens', 'edamame', 'cucumber', 'avocado', 'ginger', 'soy sauce'],
      prep_time_min: 15, tag: 'High Protein',
    },
    {
      name: 'Shrimp & Quinoa Bowl',
      description: 'Garlic shrimp over quinoa with roasted asparagus, cherry tomatoes and lemon butter',
      meal_type: 'lunch',
      calories: 520, protein_g: 38, carbs_g: 52, fat_g: 14, fiber_g: 6,
      ingredients: ['shrimp', 'quinoa', 'asparagus', 'cherry tomatoes', 'garlic', 'lemon', 'butter'],
      prep_time_min: 20, tag: 'Complete Protein',
    },
    {
      name: 'Sardine & White Bean Bowl',
      description: 'Canned sardines with white beans, roasted peppers, arugula and olive oil — insanely nutritious',
      meal_type: 'lunch',
      calories: 440, protein_g: 34, carbs_g: 36, fat_g: 16, fiber_g: 10,
      ingredients: ['canned sardines', 'white beans', 'roasted red peppers', 'arugula', 'olive oil', 'lemon'],
      prep_time_min: 5, tag: 'Omega-3 Rich',
    },
    // Dinner
    {
      name: 'Baked Salmon with Roasted Veggies',
      description: 'Wild-caught salmon fillet with lemon-herb crust, roasted broccoli and sweet potato',
      meal_type: 'dinner',
      calories: 560, protein_g: 44, carbs_g: 38, fat_g: 22, fiber_g: 8,
      ingredients: ['wild salmon', 'broccoli', 'sweet potato', 'lemon', 'garlic', 'olive oil', 'dill'],
      prep_time_min: 30, tag: 'Omega-3 Rich',
    },
    {
      name: 'Shrimp Tacos with Mango Slaw',
      description: 'Grilled shrimp tacos with mango-cabbage slaw, avocado and chipotle sauce',
      meal_type: 'dinner',
      calories: 490, protein_g: 32, carbs_g: 52, fat_g: 14, fiber_g: 6,
      ingredients: ['shrimp', 'corn tortillas', 'mango', 'cabbage', 'avocado', 'chipotle', 'lime'],
      prep_time_min: 20, tag: 'Quick',
    },
    {
      name: 'Miso Glazed Cod',
      description: 'White miso and mirin glazed cod with steamed bok choy and brown rice',
      meal_type: 'dinner',
      calories: 480, protein_g: 38, carbs_g: 52, fat_g: 10, fiber_g: 4,
      ingredients: ['cod fillet', 'white miso', 'mirin', 'bok choy', 'brown rice', 'sesame seeds'],
      prep_time_min: 25, tag: 'Low Fat',
    },
    // Snacks
    {
      name: 'Hard Boiled Eggs with Everything Seasoning',
      description: 'Simple, portable high-protein snack with everything bagel seasoning',
      meal_type: 'snack',
      calories: 160, protein_g: 12, carbs_g: 2, fat_g: 10, fiber_g: 0,
      ingredients: ['eggs', 'everything bagel seasoning'],
      prep_time_min: 10, tag: 'High Protein',
    },
    {
      name: 'Greek Yogurt with Walnuts',
      description: 'Plain Greek yogurt with walnuts, a drizzle of honey and cinnamon',
      meal_type: 'snack',
      calories: 240, protein_g: 16, carbs_g: 18, fat_g: 12, fiber_g: 1,
      ingredients: ['Greek yogurt', 'walnuts', 'honey', 'cinnamon'],
      prep_time_min: 2, tag: 'Quick',
    },
    {
      name: 'Tuna on Rice Cakes',
      description: 'Canned tuna mixed with avocado, lemon and pepper on brown rice cakes',
      meal_type: 'snack',
      calories: 200, protein_g: 20, carbs_g: 18, fat_g: 6, fiber_g: 2,
      ingredients: ['canned tuna', 'avocado', 'brown rice cakes', 'lemon', 'black pepper'],
      prep_time_min: 5, tag: 'High Protein',
    },
  ],

  vegetarian: [
    // Breakfast
    {
      name: 'Cottage Cheese Pancakes',
      description: 'High-protein pancakes made with cottage cheese, oats and eggs topped with fresh berries',
      meal_type: 'breakfast',
      calories: 420, protein_g: 28, carbs_g: 44, fat_g: 12, fiber_g: 4,
      ingredients: ['cottage cheese', 'rolled oats', 'eggs', 'mixed berries', 'maple syrup'],
      prep_time_min: 15, tag: 'High Protein',
    },
    {
      name: 'Egg White Veggie Omelette',
      description: 'Fluffy egg white omelette with spinach, mushrooms, bell peppers and goat cheese',
      meal_type: 'breakfast',
      calories: 280, protein_g: 28, carbs_g: 8, fat_g: 14, fiber_g: 2,
      ingredients: ['egg whites', 'spinach', 'mushrooms', 'bell pepper', 'goat cheese'],
      prep_time_min: 10, tag: 'Low Carb',
    },
    {
      name: 'Açaí Bowl',
      description: 'Blended açaí with banana, topped with granola, sliced fruit and nut butter',
      meal_type: 'breakfast',
      calories: 460, protein_g: 10, carbs_g: 72, fat_g: 14, fiber_g: 8,
      ingredients: ['açaí packets', 'banana', 'granola', 'strawberries', 'almond butter', 'honey'],
      prep_time_min: 8, tag: 'Antioxidant Rich',
    },
    // Lunch
    {
      name: 'Caprese Grain Bowl',
      description: 'Farro with fresh mozzarella, heirloom tomatoes, basil, balsamic glaze and pine nuts',
      meal_type: 'lunch',
      calories: 520, protein_g: 22, carbs_g: 54, fat_g: 22, fiber_g: 6,
      ingredients: ['farro', 'fresh mozzarella', 'heirloom tomatoes', 'basil', 'balsamic glaze', 'pine nuts'],
      prep_time_min: 20, tag: 'Mediterranean',
    },
    {
      name: 'Paneer Tikka Wrap',
      description: 'Spiced grilled paneer with mint chutney, sliced onions and peppers in a whole wheat wrap',
      meal_type: 'lunch',
      calories: 490, protein_g: 26, carbs_g: 48, fat_g: 18, fiber_g: 5,
      ingredients: ['paneer', 'whole wheat wrap', 'yogurt', 'garam masala', 'red onion', 'mint chutney'],
      prep_time_min: 20, tag: 'High Protein',
    },
    {
      name: 'Lentil Soup with Crusty Bread',
      description: 'Hearty red lentil soup with cumin, lemon and fresh herbs served with sourdough',
      meal_type: 'lunch',
      calories: 440, protein_g: 20, carbs_g: 66, fat_g: 8, fiber_g: 14,
      ingredients: ['red lentils', 'vegetable broth', 'cumin', 'lemon', 'garlic', 'sourdough bread'],
      prep_time_min: 25, tag: 'High Fiber',
    },
    // Dinner
    {
      name: 'Vegetable Frittata',
      description: 'Baked egg frittata with zucchini, sun-dried tomatoes, olives and parmesan',
      meal_type: 'dinner',
      calories: 380, protein_g: 28, carbs_g: 10, fat_g: 26, fiber_g: 2,
      ingredients: ['eggs', 'zucchini', 'sun-dried tomatoes', 'olives', 'parmesan', 'olive oil'],
      prep_time_min: 30, tag: 'High Protein',
    },
    {
      name: 'Pasta e Fagioli',
      description: 'Classic Italian pasta and bean soup with rosemary, garlic and parmesan rind',
      meal_type: 'dinner',
      calories: 520, protein_g: 24, carbs_g: 74, fat_g: 10, fiber_g: 12,
      ingredients: ['cannellini beans', 'pasta', 'vegetable broth', 'rosemary', 'garlic', 'parmesan'],
      prep_time_min: 30, tag: 'Comfort Food',
    },
    {
      name: 'Cheese & Black Bean Quesadillas',
      description: 'Whole wheat quesadillas stuffed with black beans, corn, pepper jack and served with salsa',
      meal_type: 'dinner',
      calories: 540, protein_g: 26, carbs_g: 58, fat_g: 20, fiber_g: 10,
      ingredients: ['whole wheat tortillas', 'black beans', 'corn', 'pepper jack cheese', 'salsa', 'Greek yogurt'],
      prep_time_min: 15, tag: 'Quick',
    },
    // Snacks
    {
      name: 'Cheese & Apple Slices',
      description: 'Sharp cheddar or brie with crisp apple slices and a handful of walnuts',
      meal_type: 'snack',
      calories: 240, protein_g: 10, carbs_g: 22, fat_g: 14, fiber_g: 3,
      ingredients: ['cheddar cheese', 'apple', 'walnuts'],
      prep_time_min: 2, tag: 'Quick',
    },
    {
      name: 'Cottage Cheese with Pineapple',
      description: 'Full-fat cottage cheese with fresh pineapple chunks and a sprinkle of cinnamon',
      meal_type: 'snack',
      calories: 200, protein_g: 18, carbs_g: 22, fat_g: 4, fiber_g: 1,
      ingredients: ['cottage cheese', 'pineapple', 'cinnamon'],
      prep_time_min: 2, tag: 'High Protein',
    },
    {
      name: 'Boiled Eggs & Hummus',
      description: 'Two hard boiled eggs with a side of hummus and carrot sticks',
      meal_type: 'snack',
      calories: 220, protein_g: 14, carbs_g: 14, fat_g: 12, fiber_g: 3,
      ingredients: ['eggs', 'hummus', 'carrots'],
      prep_time_min: 10, tag: 'High Protein',
    },
  ],

  omnivore: [
    // Breakfast
    {
      name: 'Chicken & Egg Breakfast Burrito',
      description: 'Scrambled eggs with grilled chicken, black beans, salsa and avocado in a whole wheat wrap',
      meal_type: 'breakfast',
      calories: 520, protein_g: 38, carbs_g: 44, fat_g: 18, fiber_g: 8,
      ingredients: ['chicken breast', 'eggs', 'whole wheat wrap', 'black beans', 'salsa', 'avocado'],
      prep_time_min: 15, tag: 'High Protein',
    },
    {
      name: 'Greek Yogurt & Egg Bowl',
      description: 'Greek yogurt with berries alongside two poached eggs on whole grain toast',
      meal_type: 'breakfast',
      calories: 440, protein_g: 32, carbs_g: 40, fat_g: 14, fiber_g: 4,
      ingredients: ['Greek yogurt', 'mixed berries', 'eggs', 'whole grain bread'],
      prep_time_min: 10, tag: 'High Protein',
    },
    {
      name: 'Overnight Protein Oats',
      description: 'Oats with whey protein, milk, banana and peanut butter prepped the night before',
      meal_type: 'breakfast',
      calories: 500, protein_g: 34, carbs_g: 62, fat_g: 12, fiber_g: 6,
      ingredients: ['rolled oats', 'whey protein', 'milk', 'banana', 'peanut butter'],
      prep_time_min: 5, tag: 'Meal Prep',
    },
    // Lunch
    {
      name: 'Grilled Chicken Power Bowl',
      description: 'Grilled chicken breast over brown rice with roasted broccoli, avocado and tahini',
      meal_type: 'lunch',
      calories: 580, protein_g: 46, carbs_g: 52, fat_g: 18, fiber_g: 8,
      ingredients: ['chicken breast', 'brown rice', 'broccoli', 'avocado', 'tahini', 'lemon'],
      prep_time_min: 25, tag: 'High Protein',
    },
    {
      name: 'Turkey & Avocado Sandwich',
      description: 'Lean turkey breast with avocado, spinach, tomato and Dijon on whole grain bread',
      meal_type: 'lunch',
      calories: 480, protein_g: 36, carbs_g: 38, fat_g: 18, fiber_g: 6,
      ingredients: ['turkey breast', 'avocado', 'spinach', 'tomato', 'Dijon mustard', 'whole grain bread'],
      prep_time_min: 5, tag: 'Quick',
    },
    {
      name: 'Ground Turkey Taco Bowl',
      description: 'Seasoned ground turkey over cauliflower rice with black beans, salsa and Greek yogurt',
      meal_type: 'lunch',
      calories: 510, protein_g: 42, carbs_g: 36, fat_g: 16, fiber_g: 10,
      ingredients: ['ground turkey', 'cauliflower rice', 'black beans', 'salsa', 'Greek yogurt', 'taco seasoning'],
      prep_time_min: 20, tag: 'Low Carb',
    },
    // Dinner
    {
      name: 'Sheet Pan Chicken & Veggies',
      description: 'Herb-roasted chicken thighs with sweet potato, Brussels sprouts and red onion',
      meal_type: 'dinner',
      calories: 560, protein_g: 42, carbs_g: 40, fat_g: 22, fiber_g: 8,
      ingredients: ['chicken thighs', 'sweet potato', 'Brussels sprouts', 'red onion', 'olive oil', 'rosemary'],
      prep_time_min: 40, tag: 'Meal Prep',
    },
    {
      name: 'Lean Beef Stir-Fry',
      description: 'Lean sirloin strips with broccoli, snap peas and bell peppers in ginger-soy sauce over rice',
      meal_type: 'dinner',
      calories: 540, protein_g: 44, carbs_g: 46, fat_g: 16, fiber_g: 6,
      ingredients: ['sirloin steak', 'broccoli', 'snap peas', 'bell pepper', 'ginger', 'soy sauce', 'brown rice'],
      prep_time_min: 25, tag: 'High Protein',
    },
    {
      name: 'Salmon & Quinoa Dinner',
      description: 'Pan-seared salmon with lemon-dill sauce, quinoa and steamed asparagus',
      meal_type: 'dinner',
      calories: 560, protein_g: 46, carbs_g: 40, fat_g: 20, fiber_g: 6,
      ingredients: ['salmon fillet', 'quinoa', 'asparagus', 'lemon', 'dill', 'garlic', 'olive oil'],
      prep_time_min: 25, tag: 'Omega-3 Rich',
    },
    // Snacks
    {
      name: 'Beef Jerky & Mixed Nuts',
      description: 'High-protein beef jerky with a small handful of mixed nuts',
      meal_type: 'snack',
      calories: 240, protein_g: 18, carbs_g: 10, fat_g: 14, fiber_g: 1,
      ingredients: ['beef jerky', 'mixed nuts'],
      prep_time_min: 0, tag: 'High Protein',
    },
    {
      name: 'Chicken & Rice Cakes',
      description: 'Sliced grilled chicken breast over brown rice cakes with a touch of hot sauce',
      meal_type: 'snack',
      calories: 200, protein_g: 22, carbs_g: 18, fat_g: 4, fiber_g: 1,
      ingredients: ['chicken breast', 'brown rice cakes', 'hot sauce'],
      prep_time_min: 2, tag: 'High Protein',
    },
    {
      name: 'Greek Yogurt with Protein Powder',
      description: 'Greek yogurt mixed with a scoop of vanilla protein powder and topped with berries',
      meal_type: 'snack',
      calories: 260, protein_g: 30, carbs_g: 22, fat_g: 4, fiber_g: 2,
      ingredients: ['Greek yogurt', 'vanilla protein powder', 'mixed berries'],
      prep_time_min: 2, tag: 'High Protein',
    },
  ],
}

export function getRecommendations(
  diet: DietaryPreference,
  mealType?: MealType,
  limit = 3
): MealRecommendation[] {
  const all = RECOMMENDATIONS[diet] || RECOMMENDATIONS.omnivore
  const filtered = mealType ? all.filter(m => m.meal_type === mealType) : all
  return filtered.slice(0, limit)
}

export function getDailyRecommendations(diet: DietaryPreference): Record<MealType, MealRecommendation[]> {
  const all = RECOMMENDATIONS[diet] || RECOMMENDATIONS.omnivore
  return {
    breakfast: all.filter(m => m.meal_type === 'breakfast').slice(0, 2),
    lunch: all.filter(m => m.meal_type === 'lunch').slice(0, 2),
    dinner: all.filter(m => m.meal_type === 'dinner').slice(0, 2),
    snack: all.filter(m => m.meal_type === 'snack').slice(0, 2),
  }
}

export const DIET_LABELS: Record<DietaryPreference, string> = {
  plant_based: '🌱 Plant-Based',
  pescatarian: '🐟 Pescatarian',
  vegetarian: '🥦 Vegetarian',
  omnivore: '🍽️ Omnivore',
}

export const PROTEIN_TIPS: Record<DietaryPreference, string[]> = {
  plant_based: [
    'Combine legumes + grains (e.g. lentils + rice) for complete amino acids',
    'Tofu, tempeh and edamame are complete plant proteins',
    'Hemp seeds have 10g protein per 3 tbsp — add to anything',
    'Nutritional yeast adds protein and a cheesy flavor to sauces',
    'Pea protein powder blends well and is easily absorbed',
  ],
  pescatarian: [
    'Fatty fish (salmon, sardines, mackerel) provide omega-3s AND protein',
    'Shrimp is one of the leanest high-protein foods at ~20g per 3oz',
    'Canned sardines are a budget-friendly protein powerhouse',
    'Greek yogurt and eggs round out plant proteins with complete amino acids',
    'Aim for 2-3 servings of fatty fish per week for optimal omega-3s',
  ],
  vegetarian: [
    'Eggs are a complete protein — one of the best bioavailable sources',
    'Cottage cheese and Greek yogurt are high-protein dairy staples',
    'Paneer and halloumi are great high-protein meat alternatives for cooking',
    'Combining legumes with dairy boosts total protein quality',
    'Whey protein powder is the most bioavailable protein supplement',
  ],
  omnivore: [
    'Chicken breast gives ~31g protein per 100g — a staple for a reason',
    'Vary your protein sources for a full micronutrient profile',
    'Include fatty fish 2-3x per week for omega-3s alongside other proteins',
    'Lean beef provides creatine and B12 in addition to protein',
    'Ground turkey is a leaner swap for ground beef in most recipes',
  ],
}
