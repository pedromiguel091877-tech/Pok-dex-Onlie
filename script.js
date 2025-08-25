// Seleção dos elementos HTML
const form = document.getElementById("search-form");
const input = document.getElementById("pokemon-input");
const card = document.getElementById("pokemon-card");
const img = document.getElementById("pokemon-img");
const name = document.getElementById("pokemon-name");
const type = document.getElementById("pokemon-type");
const description = document.getElementById("pokemon-description");
const error = document.getElementById("error-message");

// Tradução dos tipos de Pokémon
const typeTranslations = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  grass: "Planta",
  electric: "Elétrico",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Venenoso",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Metálico",
  fairy: "Fada"
};

// Função chamada ao enviar o formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  const pokemonName = input.value.trim().toLowerCase(); // Nome do Pokémon em minúsculas

  if (!pokemonName) return;

  try {
    // Esconde mensagens anteriores
    error.classList.add("hidden");
    card.classList.add("hidden");

    // Busca os dados principais do Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) throw new Error("Pokémon não encontrado.");
    const data = await response.json();

    // Busca a espécie para pegar a descrição
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    // Tenta pegar a descrição em português
    let flavorEntry = speciesData.flavor_text_entries.find(
      entry => entry.language.name === "pt"
    );

    // Se não tiver em português, pega em inglês
    if (!flavorEntry) {
      flavorEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === "en"
      );
    }

    // Se achou alguma descrição, limpa e exibe
    const flavorText = flavorEntry
      ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ')
      : "Descrição não disponível.";

    // Traduz os tipos
    const translatedTypes = data.types.map(t => {
      const typeName = t.type.name;
      return typeTranslations[typeName] || typeName;
    }).join(", ");

    // Nome com a primeira letra maiúscula
    const formattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    // Preenche os dados no card
    img.src = data.sprites.front_default;
    img.alt = `Imagem de ${formattedName}`;
    name.textContent = formattedName;
    type.textContent = `Tipo: ${translatedTypes}`;
    description.textContent = flavorText;

    // Exibe o card
    card.classList.remove("hidden");

  } catch (err) {
    // Mostra mensagem de erro
    card.classList.add("hidden");
    error.classList.remove("hidden");
  }
});
