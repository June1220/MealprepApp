const form = document.getElementById('family-form');
const output = document.getElementById('output');
const summary = document.getElementById('summary');
const planGrid = document.getElementById('plan-grid');

const weeklyMenus = {
  balanced: [
    'Salmon rice bowls',
    'Chicken veggie wraps',
    'Lentil soup + toast',
    'Turkey meatballs + pasta',
    'Stir-fried tofu + broccoli',
    'Bean tacos + avocado',
    'Leftover remix bowls'
  ],
  'high-protein': [
    'Egg muffins + fruit',
    'Greek chicken salad jars',
    'Beef and bean chili',
    'Cottage pie with peas',
    'Tuna pasta bake',
    'Sheet pan chicken + quinoa',
    'Protein smoothie dinner'
  ],
  'toddler-friendly': [
    'Mini turkey patties + mashed sweet potato',
    'Cheesy veggie quesadillas',
    'Soft chicken noodle bowls',
    'Creamy lentil dahl + rice',
    'Baked fish fingers + peas',
    'Pasta stars + hidden veg sauce',
    'Yogurt parfait + fruit night'
  ],
  'heart-healthy': [
    'Oat-crusted baked chicken + greens',
    'Mediterranean chickpea bowls',
    'Tomato cod stew + beans',
    'Quinoa tabbouleh + turkey skewers',
    'Spinach mushroom frittata',
    'Whole wheat veggie pizza',
    'Minestrone + side salad'
  ]
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const familyName = document.getElementById('family-name').value.trim();
  const adults = Number(document.getElementById('adults').value);
  const children = Number(document.getElementById('children').value);
  const youngestAge = Number(document.getElementById('youngest-age').value);
  const focus = document.getElementById('focus').value;

  const menu = weeklyMenus[focus];
  const portions = adults + (children * (youngestAge <= 3 ? 0.5 : 0.75));

  summary.textContent = `${familyName}: prep for ${adults} adult(s) and ${children} child(ren). ` +
    `Recommended portions per meal: ${Math.ceil(portions)}. ` +
    `${youngestAge <= 3 ? 'Meals include toddler-safe soft textures.' : 'Meals include family-style textures.'}`;

  planGrid.innerHTML = '';
  days.forEach((day, index) => {
    const card = document.createElement('article');
    card.className = 'day';
    card.innerHTML = `
      <h3>${day}</h3>
      <ul>
        <li><strong>Dinner:</strong> ${menu[index]}</li>
        <li><strong>Prep tip:</strong> Batch chop veggies on Sunday.</li>
      </ul>
    `;
    planGrid.appendChild(card);
  });

  output.hidden = false;
});
