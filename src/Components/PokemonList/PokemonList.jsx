
import { useEffect, useState } from "react"
import axios from 'axios';
import "./PokemonList.css"
import Pokemon from "../Pokemon/Pokemon";
const PokemonList = () => {

    // const [ pokemonList, setPokemonList ] = useState([]);
    // const [ isLoading, setIsLoading ] = useState(true);

    // const [ pokedexUrl, setPokedexUrl ] = useState("https://pokeapi.co/api/v2/pokemon/");

    // const [nextUrl, setNextUrl] = useState('');
    // const [prevUrl, setPrevUrl] = useState('');

    const [ pokemonListState, setPokemonListState ] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: "https://pokeapi.co/api/v2/pokemon/",
        nextUrl: "",
        prevUrl: ""
    })

    async function downloadPokemons() {
        // setIsLoading(true);
        setPokemonListState((state) => ({...state, isLoading: true}))
        const response = await axios.get(pokemonListState.pokedexUrl); // This downloads list of 20 pokemon. 
        // console.log(response)

        const pokemonResults = response.data.results; // we get the array of pokemons from result
        // console.log(response.data);
        // setNextUrl(response.data.next);
        setPokemonListState((state) => ({
            ...state, 
            nextUrl: response.data.next, 
            prevUrl: response.data.prev
        }))
        // setPrevUrl(response.data.previous);
        // console.log(pokemonResults);

        /*
            iterating over the array of pokemons, and using their url, to create an array of promises
            that will download those 20 pokemons.  
        */
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url))
        // console.log(pokemonResultPromise)

        // passing that promise arrayto axios.all
        const pokemonData = await axios.all(pokemonResultPromise) // array of 20 pokemon detailed data
        // console.log(pokemonData);

        // now iterate on the data of each pokemon, and extract id, name, image and types.
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            // console.log(pokemon);
            return {
                id: pokemon.id,
                name: pokemon.name, 
                image: pokemon.sprites.other.dream_world.front_default, 
                types: pokemon.types
            }
        });

        // console.log(pokeListResult);
        // setPokemonList(pokeListResult);
        setPokemonListState((state) => ({
            ...state, 
            pokemonList: pokeListResult, 
            isLoading: false
        }));
        // setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl])

  return (
    <div className="pokemon-list-wrapper">
        <div className="pokemon-wrapper">
            {(pokemonListState.isLoading) ? 'Loading...' : 
                pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} id={p.id} key={p.id} />
            )}
        </div>
        <div className="controls">
            {/* <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)} >Prev</button> */}
            <button disabled={pokemonListState.prevUrl == null} onClick={() => setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.prevUrl})} >Prev</button>
            {/* <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)} >Next</button> */}
            <button disabled={pokemonListState.nextUrl == null} onClick={() => setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.nextUrl})} >Next</button>
        </div>
    </div>
  )
}

export default PokemonList;
