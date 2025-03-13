/// API ENDPOINT
const API_URL = `https://pokeapi.co/api/v2/pokemon?limit=3&offset=0`;

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

const container = document.getElementById("container");
let allPokemonData = []; // Menyimpan semua data Pokemon

async function getData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();

    // Fetch detail untuk semua Pokemon
    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      })
    );

    allPokemonData = detailedPokemon;

    // Isi dropdown types
    populateTypeFilter(detailedPokemon);

    // Render awal
    renderCards(detailedPokemon);
  } catch (error) {
    console.error(error.message);
  }
}

function populateTypeFilter(pokemonList) {
  const typeSelect = document.getElementById("types");
  const types = new Set();

  pokemonList.forEach((pokemon) => {
    pokemon.types.forEach((type) => types.add(type.type.name));
  });

  // Kosongkan options kecuali default
  while (typeSelect.options.length > 1) {
    typeSelect.remove(1);
  }

  // Tambahkan opsi baru
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

function renderCards(pokemonList) {
  const existingWrapper = document.querySelector(".wrapper");
  const wrapper = existingWrapper || document.createElement("section");

  if (!existingWrapper) {
    wrapper.className = "wrapper grid";
    container.appendChild(wrapper);
  }

  // Clear existing content
  wrapper.innerHTML = "";

  pokemonList.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "card";

    // Title
    const title = document.createElement("h4");
    title.textContent = pokemon.name;

    // Image
    const image = document.createElement("img");
    image.src = pokemon.sprites.other.dream_world.front_default || "";
    image.alt = pokemon.name;

    // Types
    const typesWrapper = document.createElement("div");
    typesWrapper.className = "flex";

    pokemon.types.forEach((type) => {
      const typeElement = document.createElement("div");
      typeElement.textContent = type.type.name;
      typeElement.className = "types";
      typeElement.style.backgroundColor = typeColors[type.type.name] || typeColors.unknown;
      typesWrapper.appendChild(typeElement);
    });

    // Assemble card
    card.append(title, image, typesWrapper);
    wrapper.appendChild(card);
  });
}

function filterItem() {
  const searchTerm = document.getElementById("myInput").value.toLowerCase();
  const selectedType = document.getElementById("types").value;

  const filtered = allPokemonData.filter((pokemon) => {
    // Filter nama
    const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);

    // Filter type
    const typeMatch = selectedType === "default" || pokemon.types.some((t) => t.type.name === selectedType);

    return nameMatch && typeMatch;
  });

  renderCards(filtered);
}

function reset() {
  document.getElementById("myInput").value = "";
  document.getElementById("types").value = "default";
  renderCards(allPokemonData);
}

// Initialize
getData();
