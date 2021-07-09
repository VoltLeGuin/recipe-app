createAutoComplete({
  root: document.querySelector('.autocomplete'),
  renderOption(recipe) {
    return `
      <img src="https://spoonacular.com/recipeImages/${recipe.image}" />
      ${recipe.title}
    `
  },
  onOptionSelect(recipe) {
    onRecipeSelect(recipe);
  },
  inputValue(recipe) {
    return recipe.title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get(`https://api.spoonacular.com/recipes/search?query=${searchTerm}&apiKey=XXX`);

    if (response.data.Error) {
      return [];
    }

    return response.data.results;
  }
});

const onRecipeSelect = async (recipe) => {
  const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=XXX`);

  document.querySelector('#summary').innerHTML = recipeTemplate(response.data);
};

const recipeTemplate = (recipeDetail) => {
  return `
  <div class="recipe-info">
    <div class="tile is-ancestor"">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="image">
            <img src="${recipeDetail.image}" />
          </p>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box">
          <div class="media-content">
            <div class="content">
              <h1>${recipeDetail.title}</h1>
              <h4>${recipeDetail.dishTypes.map((type) => {
                return " " + type;
              })}</h4>
              <p>${recipeDetail.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <article class="notification is-warning is-light">
            <p class="title is-4">${recipeDetail.extendedIngredients.map((ingredient) => {
              return " " + ingredient.name;
            })}</p>
            <p class="subtitle">Ingredients</p>
          </article>
        </div>
      </div>
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <article class="notification is-warning is-light">
            <p class="title is-4">${recipeDetail.nutrition.nutrients[0].amount} ${recipeDetail.nutrition.nutrients[0].unit}</p>
            <p class="subtitle">Calories</p>
          </article>
        </div>
        <div class="tile is-child box">
          <article class="notification is-warning is-light">
            <p class="title is-4">${recipeDetail.nutrition.nutrients[3].amount} ${recipeDetail.nutrition.nutrients[3].unit}</p>
            <p class="subtitle">Carbohydrates</p>
          </article>
        </div>
      </div>
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <article class="notification is-warning is-light">
            <p class="title is-4">${recipeDetail.readyInMinutes} m</p>
            <p class="subtitle">Ready in Minutes</p>
          </article>
        </div>
        <div class="tile is-child box">
          <article class="notification is-warning is-light">
            <p class="title is-4">${recipeDetail.servings}</p>
            <p class="subtitle">Servings</p>
          </article>
        </div>
      </div>
    </div>
  </div>
  `;
};
