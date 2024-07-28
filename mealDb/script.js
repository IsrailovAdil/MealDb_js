const mealsUrl = "https://www.themealdb.com/api/json/v2/1/randomselection.php";
const openFilterButton = document.getElementById('openFilterButton');
let allMeal = [];
let allIngredients={};

openFilterButton.addEventListener('click', () => {
    filterBlock.style.display = filterBlock.style.display === 'none' ? 'block' : 'none';
});

fetch(mealsUrl)
    .then(res => res.json())
    .then(data => {
        allMeal = data.meals;
        displayMeals(allMeal);
        fetchIngredients(allMeal)
    });



const displayMeals = (meals) => {
    const row = document.querySelector('#meal-row');
    row.innerHTML = meals.map(meal => {
        return `
                    <div class="col-3 card-container">
                        <div class="card" data-id="${meal.idMeal}" data-meal="${meal.strMeal}" data-image="${meal.strMealThumb}">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h3 class="card-title">${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('');

cardClicked()
}

const cardClicked=()=>document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        const mealId = e.currentTarget.dataset.id;
        console.log(mealId)
        showModal(mealId);
    });
})


const searchField = document.querySelector('#searchField');
const submit = document.querySelector('#submit');

submit.addEventListener('click', () => {
        const searchValue = searchField.value.toLowerCase();
        let arr = [];
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
            .then(res => res.json())
            .then(data => {
                arr = data.meals;
                displayMeals(arr);
            });

    })

const showModal = (mealId) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            console.log(meal)
            document.querySelector('#modalTitle').innerText = meal.strMeal;
            document.querySelector('#modalImage').src = meal.strMealThumb;
            document.querySelector('#instruction-meal').innerHTML=meal.strInstructions;
            document.querySelector('#youTube').innerHTML=meal.strYoutube;

            const ingredientsList = document.getElementById('modalIngredients');
            ingredientsList.innerHTML = '';

            for (let i = 1; i <= 15; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (ingredient) {
                    const ingredientItem = document.createElement('div');
                    ingredientItem.className = 'ingredient-item';
                    const imgSrc = `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;
                    ingredientItem.innerHTML = `<img src="${imgSrc}" alt="${ingredient}"> ${measure ? measure : ''} ${ingredient}`;
                    ingredientsList.appendChild(ingredientItem);
                }
            }

            document.querySelector('#mealModal').classList.add('show');
        });
}

const closeModal = () => {
    document.querySelector('#mealModal').classList.remove('show');
}


const fetchIngredients = (meals) => {
    meals.forEach(meal => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(res => res.json())
            .then(data => {
                const fMeal = data.meals[0];
                for (let i = 1; i <= 15; i++) {
                    const ingredient = fMeal[`strIngredient${i}`];
                    if (ingredient) {
                        allIngredients[ingredient] = (allIngredients[ingredient] || 0) + 1;
                    }
                }
                displayIngredients();
            });
    });
}


const displayIngredients = () => {
    const sortedIngredients = Object.entries(allIngredients).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const row = document.getElementById('ingredient-row');
    row.innerHTML = sortedIngredients.map(([ingredient, count]) => {
        const imgSrc = `https://www.themealdb.com/images/ingredients/${ingredient}.png`;
        return `
                    <div class="col-3 card-container">
                        <div class="card">
                            <img src="${imgSrc}" class="card-img-top p-3" alt="${ingredient}">
                            <div class="card-body">
                                <h3 class="card-title">${ingredient}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('');
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const letterButtons = document.getElementById('letter-buttons');

alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter.toUpperCase();

    button.addEventListener('click', () => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(res => res.json())
            .then(data => {
                allMeal = data.meals ? data.meals : [];
                displayMealLetter(allMeal);

            });
    });
    letterButtons.appendChild(button);
});

const displayMealLetter = (meals) => {
    const row = document.querySelector('#meal-sort-row');
    row.innerHTML = meals.map(meal => {
        return `
                    <div class="col-3 card-container">
                        <div class="card" data-id="${meal.idMeal}" data-drink="${meal.strMeal}" data-image="${meal.strMealThumb}">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h3 class="card-title">${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('')
cardClicked()
};



const categorySelect=document.querySelector('#category');
const ingredientSelect=document.querySelector('#ingredient');
const areaSelect=document.querySelector('#area');
const filterButton=document.querySelector('#filterButton');

const addEmptyOption = (selectElement) => {
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '';
    selectElement.appendChild(emptyOption);
};

const fetchOptions=()=>{
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(res=>res.json())
        .then(data=>{
            addEmptyOption(categorySelect);
            addEmptyOption(ingredientSelect);
            addEmptyOption(areaSelect);
            data.meals.forEach(meal=>{
                const option=document.createElement('option');
                option.value=meal.strCategory;
                option.textContent=meal.strCategory;
                categorySelect.appendChild(option);
            })
        })


    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(res=>res.json())
        .then(data=>{
            data.meals.forEach(meal=>{
                const option=document.createElement('option');
                option.value=meal.strIngredient;
                option.textContent=meal.strIngredient;
                ingredientSelect.appendChild(option);
            })
        })

    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(res=>res.json())
        .then(data=>{
            data.meals.forEach(meal=>{
                const option=document.createElement('option');
                option.value=meal.strArea;
                option.textContent=meal.strArea;
                areaSelect.appendChild(option);
            })
        })
};

const displayResults=(meals)=>{
        const row = document.querySelector('#meal-row');
        row.innerHTML = meals.map(meal => {
            return `
                    <div class="col-3 card-container">
                        <div class="card" data-id="${meal.idMeal}" data-meal="${meal.strMeal}" data-image="${meal.strMealThumb}">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h3 class="card-title">${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
        }).join('');

        cardClicked()
};

const filteredMeals=()=>{
    const category = categorySelect.value;
    const ingredient = ingredientSelect.value;
    const area = areaSelect.value;

    let url = 'https://www.themealdb.com/api/json/v1/1/filter.php?';
    if (category) url += `c=${category}&`;
    if (ingredient) url += `i=${ingredient}&`;
    if (area) url += `a=${area}&`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayResults(data.meals);
            } else {
                resultsSelect.innerHTML = 'Ничего не найдено';
            }
        });

}

filterButton.addEventListener('click', filteredMeals);

fetchOptions();