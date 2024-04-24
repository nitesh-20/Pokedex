import { useEffect } from "react"
import axios from 'axios';
import "./PokemonList.css"
const PokemonList = () => {

    async function downloadPokemons() {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        console.log(response.data);
    }

    useEffect(() => {
        downloadPokemons();
    }, [])

  return (
    <div className="pokemon-list-wrapper">
        Pokemon List
    </div>
  )
}

export default PokemonList;