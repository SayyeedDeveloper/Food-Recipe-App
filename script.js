const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const mealList = document.getElementById("mealList");
const modalContainer = document.querySelector(".modal-container");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipeCloseBtn");

// Event listeners
searchButton.addEventListener("click", async () => {
  const ingredient = searchInput.value.trim();
  if (ingredient) {
    const meals = await searchMealsByIngredient(ingredient);
    displayMeals(meals);
  }
});

mealList.addEventListener("click", async (e) => {
  const card = e.target.closest(".meal-item");
  if (card) {
    const mealId = card.dataset.id;
    const meal = await getMealDetails(mealId);
    if (meal) {
      showMealDetailsPopup(meal);
    }
  }
});

// Remove the existing event listener for categorySelect

// Add a new event listener for the category buttons
document.querySelector(".filter").addEventListener("click", async (e) => {
    if (e.target.classList.contains("category-button")) {
      const selectedCategory = e.target.dataset.category;
      const meals = await searchMealsByCategory(selectedCategory);
      displayMeals(meals);
      searchInput.value = '';
    }
  });

async function searchMealsByIngredient(ingredient) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getMealDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

function displayMeals(meals, title) {
  mealList.innerHTML = "";
  if (meals) {
    meals.forEach((meal) => {
      const mealItem = document.createElement("div");
      mealItem.classList.add("meal-item");
      mealItem.dataset.id = meal.idMeal;
      mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
      mealList.appendChild(mealItem);
    });
  } else {
    mealList.innerHTML = `<p>No ${title} found. Try another category.</p>`;
  }
}

function showMealDetailsPopup(meal) {
  mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
        </div>
    `;
  modalContainer.style.display = "block";
}

recipeCloseBtn.addEventListener("click", closeRecipeModal);

function closeRecipeModal() {
  modalContainer.style.display = "none";
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

async function performSearch() {
  const ingredient = searchInput.value.trim();
  if (ingredient) {
    const meals = await searchMealsByIngredient(ingredient);
    displayMeals(meals, "Search Results");
  }
}

async function searchMealsByCategory(category) {
  try {
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php";
    if (category !== "All") {
      apiUrl += `?c=${category}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.addEventListener("load", async () => {
  const defaultMeals = await getDefaultMeals();
  displayMeals(defaultMeals, "Recomended");
});

async function getDefaultMeals() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching default meals:", error);
    return []; // Return an empty array in case of an error
  }
}
