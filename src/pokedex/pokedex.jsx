import React, { useState, useEffect } from "react";

function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPokemons() {
      const url = "https://pokeapi.co/api/v2/pokemon";
      const name = await fetch(url.name);
      const FullData = await fetch(url.url);
      const pokeInfo = await FullData.json();
      const img = await fetch(pokeInfo.sprites.front_default);
      console.log("url: ", url, "name: ", name, "img: ", img);
    }
    getPokemons();
    setIsLoading(false);
  }, []);

  console.log(images);
  return (
    <>
      {pokemons.map((pokemon, key) => (
        <div key={key}>
          <p>{pokemon.name}</p>
        </div>
      ))}
    </>
  );
}
export default Pokedex;
