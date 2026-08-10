//declaring stuff
let score = 0;
let hearts = 5;
const type = document.getElementById("type");
const abilities = document.getElementById("ability");
const moves = document.getElementById("moves");
const img = document.getElementById("img");
const gameOverScreen = document.getElementById(`gameover`);
const tryagain = document.getElementById(`tryAgain`);
const scores = document.getElementById("score");
const lives = document.getElementById("lives");
const btns = document.querySelectorAll(`input[type="button"]`);
const finalScore = document.getElementById("finalscore");
const loading = document.getElementById(`loading`);

const answers = document.getElementById("answers");
lives.textContent = "❤️".repeat(hearts);

async function getPokeNameArray() {
  // fetching data from the api
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1351",
    ); // waiting for the server

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json(); // waiting for json parsing

    return data.results.map((pokemon) => pokemon.name);
  } catch (error) {
    console.error("API Fetch Failed", error);
    throw error;
  }
}

let pokemonNamesArray;
try {
    pokemonNamesArray = await getPokeNameArray();
    loading.style.display = "none";
} catch (error) {
    loading.textContent = "Failed to load Pokémon. Please refresh.";
    console.error("Failed to load Pokémon:", error);

    throw error;
}
loading.style.display ='none';

function arrayShuffle(array) {
  // Fisher–Yates Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));

    [array[i], array[randIndex]] = [array[randIndex], array[i]];
  }
  return array;
}

function pokemonOptions() {
  // generating 4 possible options to choose from

  const pokemonNamesArrayCopy = [...pokemonNamesArray];
  // making a copy to keep the original unchanged

  const options = arrayShuffle(pokemonNamesArrayCopy);

  return options.slice(0, 4);
}

function correctPokemon(array) {
  // generate random pokemon for the user to guess

  const randIndex = Math.floor(Math.random() * array.length);
  return array[randIndex];
}

let correctPoke;

async function startRound() {
  try {
    btns.forEach((btn) => (btn.disabled = true));

    const options = pokemonOptions();

    correctPoke = correctPokemon(options);

    const correctPokeInfo = await getCorrectPokeInfo(correctPoke);

    displayOptions(options);

    type.textContent = `Type: ${correctPokeInfo.types.join("")}`;

    abilities.textContent = `Abilities: ${correctPokeInfo.ability.join(", ")}`;

    moves.textContent = `Moves: ${randMoves(correctPokeInfo.moves).join(", ")}`;

    img.src = correctPokeInfo.img;
  } catch (error) {
    console.error("Can't start new round:", error);
  } finally {
    btns.forEach((btn) => (btn.disabled = false));
  }
}

function randMoves(movesList) {
  // generating 3 random moves to choose from
  const moves = arrayShuffle(movesList);
  return moves.slice(0, 3);
}

async function getCorrectPokeInfo(correctPoke) {
  // getting the type regarding the correct pokemon

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${correctPoke}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();

    const types = data.types.map((pokemon) => pokemon.type.name);

    const abilities = data.abilities.map((pokemon) => pokemon.ability.name);

    const moves = data.moves.map((pokemon) => pokemon.move.name);

    const imgsrc = data.sprites.front_default;

    return {
      types,
      ability: abilities.slice(0, 2),
      moves,
      img: imgsrc,
    };
  } catch (error) {
    console.error("Failed to fetch Pokémon data:", error);
    throw error;
  }
}

function displayOptions(array) {
  btns.forEach((btn, index) => {
    btn.value = array[index];
  });
}

function ansewrCheck() {
  answers.addEventListener("click", (event) => {
    // make the button container not clickable
    if (!event.target.classList.contains("opt")) {
      return;
    }
    if (event.target.value === correctPoke) {
      score += 100;
      scores.textContent = `${score}`;
      startRound();
    } else {
      loseHeart();
    }
  });
}

tryagain.onclick = () => {
  startGame();
  gameOverScreen.style.display = "none";
};

function startGame() {
  score = 0;
  hearts = 5;
  lives.textContent = "❤️".repeat(hearts);
  scores.textContent = score;
  startRound();
}

function loseHeart() {
  hearts--;
  lives.textContent = "❤️".repeat(hearts) + "🖤".repeat(5 - hearts);

  if (hearts > 0) {
    startRound();
  } else {
    gameOver();
  }
}

function gameOver() {
  finalScore.textContent = `Score : ${score}`;
  setTimeout(() => {
    gameOverScreen.style.display = "flex";
  }, 100);
}

startGame();
ansewrCheck();
