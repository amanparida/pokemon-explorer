import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await res.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
        setPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon.');
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    const filtered = pokemons.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter
        ? pokemon.types.some((t) => t.type.name === typeFilter)
        : true;
      return matchesSearch && matchesType;
    });

    setFilteredPokemons(filtered);
  }, [search, typeFilter, pokemons]);

  const allTypes = Array.from(
    new Set(pokemons.flatMap((p) => p.types.map((t) => t.type.name)))
  );

  return (
    <div className="app">
      <h1>Pokémon Explorer</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {allTypes.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <p>{error}</p>
      ) : filteredPokemons.length === 0 ? (
        <p className="no-pokemon-message">No Pokémon found.</p>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemons.map((poke, index) => (
            <div
              key={poke.id}
              className="pokemon-card"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <h3 className="capitalize">{poke.name}</h3>
              <img
                src={poke.sprites.front_default || '/fallback.png'}
                alt={`${poke.name} sprite`}
                className="fade-in"
              />
              <p>Type:{" "}
                <span className="capitalize">
                  {poke.types.map((t) => t.type.name).join(', ')}
                </span>
              </p>
              <p>ID: {poke.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
