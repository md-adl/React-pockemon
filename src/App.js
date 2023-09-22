import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export function App() {
  const [pokemonlist, setpokemonlist] = useState([]);
  const [isloding, setloding] = useState(true);
  const [pokemonExtradata, setpokemonExtra] = useState(null);
  const [showmodal, setshowmodal] = useState(false);
  const [selectedmodal, setselectedmodal] = useState(null);
  async function getpokemonlist(url = 'https://content.newtonschool.co/v1/pr/64ccef982071a9ad01d36ff6/pokemonspages1', override = false) {
    const list = await axios.get(url);
    const pokemondata = list.data[0].results;

    setpokemonExtra(list.data[0].next);
    let pokemonListfromApi = [];
    for (let pokemon of pokemondata) {
      const res = await axios.get(pokemon.url);
      const innerdata = res.data[0];
      pokemonListfromApi.push(innerdata);
    }
    if (!override) {
      setpokemonlist(pokemonListfromApi);
    } else {
      setpokemonlist((prev) => prev.concat(pokemonListfromApi));
    }
    setloding(false);
  }
  function handleExtradata() {
    getpokemonlist(pokemonExtradata, true);
  }
  useEffect(() => {
    getpokemonlist();
  }, []);
  //console.log(pokemonlist[0].stats[1].stat);

  return (
    isloding ? <div id="loading">Loading...</div> : <div id="parent">
      <div className="section"> 
      <h2>Pokemon KingDom</h2>
      <h2>Pokemon KingDom</h2>
      </div>
      <div className="modal" id={!showmodal && "inactive"}>
        <div className="modal-content" >
          {pokemonlist[selectedmodal] &&
            <div className={`details ${pokemonlist[selectedmodal].type}`}>

              <div className="pokemon-preview">
                <div className="image-name">
                  <img src={pokemonlist[selectedmodal].image} alt="selected" />
                  <div className="modalname">{pokemonlist[selectedmodal].name}</div>
                </div>
                <div className={`totaldata ${pokemonlist[selectedmodal].type}`}>
                  <div className="weight">
                    <p><strong>weight:</strong> {pokemonlist[selectedmodal].weight}</p>
                    <p><strong>height:</strong> {pokemonlist[selectedmodal].height}</p>
                  </div>
                  <div className="stats-data">
                    {pokemonlist[selectedmodal].stats.map((item, index) => (
                      <div className="stats"><strong>Stat{index + 1}:    </strong><span>{item.stat.name}</span></div>
                    ))}
                  </div>
                  <div className>
                   {pokemonlist[selectedmodal].stats.map((item,index)=>(
                       <div className="base-stats"><strong>Bs{index+1}:    </strong>{item.base_stat}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`close ${pokemonlist[selectedmodal].type}btn`} onClick={() => {
                setshowmodal(false);
                setselectedmodal(null);
              }}>✕</div>
            </div>
          }
        </div>
      </div>
      <div className="app-container">
        <div className="pokemon-container">
          {pokemonlist.map((pokemon, index) => (
            <div className={`card ${pokemon.type}`}>
              <div className="number">{`#${pokemon.id}`}</div>
              <img src={pokemon.image} alt={pokemon.name} />
              <div className="details">
                <h3 >{pokemon.name}</h3>
                <small>Type: {pokemon.type}</small>
              </div>
              <div>
                <button className={`btn ${pokemon.type}btn`} onClick={() => {
                  setshowmodal(true);
                  setselectedmodal(index);

                }}>Show More</button>
              </div>
            </div>
          ))}
        </div>

        <div className="center">
          <button className="btn showmore2" onClick={handleExtradata}>Show More</button>
        </div>
      </div>
    </div>


  )

}
