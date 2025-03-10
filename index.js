// API ENDPOINT
const API_URL = `https://pokeapi.co/api/v2/pokemon?limit=30&offset=0`;

const typeColors = {
  normal: "#C4A484",
  fighting: "maroon",
  flying: "lightblue",
  poison: "purple",
  ground: "brown",
  rock: "#808080",
  bug: "#8A9A5B",
  ghost: "purple",
  steel: "silver",
  fire: "red",
  water: "blue",
  grass: "green",
  electric: "orange",
  psychic: "#FF00FF",
  ice: "lightblue",
  dragon: "darkblue",
  dark: "darkgray",
  fairy: "lightpink",
  stellar: "lightskyblue",
  unknown: "transparent",
};

// ***Suggest from AI
let pokemonDataList = [];
// select Element
const inputName = document.getElementById("myInput");
const container = document.getElementById("container");

async function getData() {
  try {
    // create new element for card-container
    const wrapperCard = document.createElement("section");
    wrapperCard.className = "wrapper grid";
    wrapperCard.innerHTML = "";

    // fetch data from API
    const response = await fetch(API_URL);

    // check response
    if (!response.ok) {
      throw new Error("Couldn't fetch data");
    }
    const data = await response.json();
    const { results } = data;

    // Mapping to access items from URL
    const pokemonPromise = results.map(async (item) => {
      const pokemonResponse = await fetch(item.url);
      const pokemonData = await pokemonResponse.json();
      // console.log(pokemonData);
      return pokemonData;
    });

    // *** New Suggest from AI
    pokemonDataList = await Promise.all(pokemonPromise);
    const typeSelect = document.getElementById("types");
    const allTypes = new Set();

    pokemonDataList.forEach((pokemon) => {
      pokemon.types.forEach((item) => {
        allTypes.add(item.type.name);
      });
    });
    Array.from(allTypes)
      .sort()
      .forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeSelect.appendChild(option);
      });

    renderPokemon(pokemonDataList, wrapperCard);

    container.append(wrapperCard);
  } catch (error) {
    console.error(error.message);
  }
}
// ***Suggest from AI
function renderPokemon(pokemonList, wrapperCard) {
  wrapperCard.innerHTML = "";
  pokemonList.forEach((pokemonData) => {
    // create new element for card
    const card = document.createElement("div");
    card.className = "card";

    // create heading
    const name = document.createElement("h3");
    name.textContent = `#${pokemonData.id} ${pokemonData.name}`;

    // create new element for imgCard
    const imagePokemon = document.createElement("img");
    imagePokemon.src = pokemonData.sprites.other["dream_world"].front_default;
    imagePokemon.alt = pokemonData.name;

    // get abilities from array
    const descAbility = document.createElement("p");
    pokemonData.abilities.forEach((item) => {
      descAbility.textContent = `Ability: ${item.ability.name}`;
    });

    // get types from array
    const typesPokemon = document.createElement("div");
    typesPokemon.className = "flex";
    pokemonData.types.forEach((item) => {
      const types = document.createElement("span");
      types.textContent = item.type.name;
      types.className = "types";
      types.style.backgroundColor = typeColors[types.textContent] || typeColors.unknown;

      return typesPokemon.appendChild(types);
    });

    // getBaseStats
    const statsPokemon = document.createElement("div");
    pokemonData.stats.forEach((item) => {
      const stats = document.createElement("p");
      stats.textContent = `${item.stat.name.toUpperCase()}: ${item.base_stat}`;

      return statsPokemon.appendChild(stats);
    });

    card.append(name, imagePokemon, descAbility, typesPokemon, statsPokemon);
    wrapperCard.appendChild(card);
  });
}

// ***Suggest from AI
function filterItem() {
  const filterName = inputName.value.toUpperCase();
  const selectedType = document.getElementById("types").value;
  const filterItems = pokemonDataList.filter((pokemon) => {
    const nameMatch = pokemon.name.toUpperCase().includes(filterName);
    const typeMatch = selectedType === "default" || pokemon.types.some((t) => t.type.name === selectedType);
    return nameMatch && typeMatch;
  });
  const wrapperCard = document.querySelector(".wrapper.grid");
  renderPokemon(filterItems, wrapperCard);
}

function reset() {
  const wrapperCard = document.querySelector(".wrapper.grid");
  renderPokemon(pokemonDataList, wrapperCard);
  inputName.value = ``;
  document.getElementById("types").value = "default";
}

getData();
