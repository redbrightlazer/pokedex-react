import React, { useState, useEffect, useContext } from "react";
import "./pokedex.css";
function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [isdesc, setIsDesc] = useState(false);
  useEffect(() => {
    async function getPokemons() {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`
      );
      const data = await res.json();

      const newPoke = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokeInfoRes = await fetch(pokemon.url);
          const pokeInfo = await pokeInfoRes.json();

          const evoRes = await fetch(pokeInfo.species.url);
          const evoData = await evoRes.json();
          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          return {
            id: pokeInfo.id,
            img: pokeInfo.sprites.front_default,
            name: capitalizeFirstLetter(pokeInfo.name),
            types: pokeInfo.types,
            evo: evoData.evolves_from_species?.name || null,
            weight: pokeInfo.weight,
            height: pokeInfo.height,
            imgBack: pokeInfo.sprites.back_default,
            baseHP:
              pokeInfo.stats.find((stat) => stat.stat.name === "hp")
                ?.base_stat || 0,
            baseAttack:
              pokeInfo.stats.find((stat) => stat.stat.name === "attack")
                ?.base_stat || 0,
            baseDefense:
              pokeInfo.stats.find((stat) => stat.stat.name === "defense")
                ?.base_stat || 0,
            baseEXP: pokeInfo.base_experience,
          };
        })
      );
      setPokemons(newPoke);
      console.log(getPokemons);
      setIsLoading(false);
    }
    getPokemons();
  }, [offset]);

  const filteredPokemon = pokemons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          alt="Завантаження..."
          style={{ width: "80px", margin: "20px auto", display: "block" }}
        />
      ) : (
        <>
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search"
          />
          <CardList
            pokemons={filteredPokemon}
            setIsDesc={setIsDesc}
            isdesc={isdesc}
          />
          <NavButtons
            offset={offset}
            setOffset={setOffset}
            setIsDesc={setIsDesc}
            isdesc={isdesc}
          />
        </>
      )}
    </>
  );
}
function Card({
  name,
  id,
  img,
  evo,
  types,
  weight,
  height,
  baseHP,
  baseAttack,
  baseDefense,
  baseEXP,
  imgBack,
  isdesc,
  setIsDesc,
}) {
  function seeMore(id, setIsDesc) {
    document.getElementById(`desc${id}`).classList.remove("none");
    setIsDesc(true);
  }
  function seeLess(id, setIsDesc) {
    document.getElementById(`desc${id}`).classList.add("none");
    setIsDesc(false);
  }
  return (
    <>
      <div className="card">
        <div className="top">
          <img src={img} alt="pokePic" />

          <p>ID / {id}</p>
        </div>
        <div className="bottom">
          <h1 className="name">{name}</h1>
          <ul>
            {types.map((i, key) => (
              <li key={key}>{i.type.name}</li>
            ))}
          </ul>

          {evo && (
            <div className="evo">
              <p className="evo-from">Evolved From: </p>
              <p className="evo-name">{evo}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => seeMore(id, setIsDesc)}
          disabled={isdesc}
          className="seeMore"
        >
          See More!
        </button>
      </div>
      <div id={`desc${id}`} className="none">
        <div className="desc">
          <h1>Name: {name}</h1>
          <img src={imgBack} alt="pokePic" className="imgback" />
          <h1>weight: {weight}kg</h1>
          <h1>height: {height}cm</h1>
          <h1>Base Defense: {baseHP}</h1>
          <h1>Base Attack: {baseAttack}</h1>
          <h1>Base Defense: {baseDefense}</h1>
          <h1>Base Experience: {baseEXP}</h1>
          <h1 className="x" onClick={() => seeLess(id, setIsDesc)}>
            X
          </h1>
        </div>
      </div>
    </>
  );
}

function CardList({ pokemons, setIsDesc, isdesc }) {
  return (
    <div className="grid">
      {pokemons.map((i, key) => (
        <Card
          key={key}
          name={i.name}
          id={i.id}
          img={i.img}
          types={i.types}
          evo={i.evo}
          weight={i.weight}
          height={i.height}
          baseHP={i.baseHP}
          baseAttack={i.baseAttack}
          baseDefense={i.baseDefense}
          baseEXP={i.baseEXP}
          imgBack={i.imgBack}
          setIsDesc={setIsDesc}
          isdesc={isdesc}
        />
      ))}
    </div>
  );
}
function NavButtons({ offset, setOffset, setIsDesc, isdesc }) {
  function Next() {
    setOffset(offset + 20);
  }
  function Prev() {
    setOffset(offset - 20);
  }
  return (
    <>
      <button
        className="button"
        id="b1"
        onClick={Prev}
        disabled={offset === 0 || isdesc === true}
      >
        Previous
      </button>
      <button className="buttontwo" onClick={Next} disabled={isdesc === true}>
        Next
      </button>
    </>
  );
}
export default Pokedex;
