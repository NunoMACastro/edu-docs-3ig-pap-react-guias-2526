import { useCallback, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import SearchBar from "@/components/SearchBar.jsx";
import TypeFilter from "@/components/TypeFilter.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;

/**
 * App — componente principal da Pokédex Explorer.
 *
 * @returns {JSX.Element}
 */
function App() {
    // ========================================
    // ESTADO (Ficheiro 4: Estado e eventos)
    // ========================================
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // São estes dois estados que temos que limpar... e meter como o que está por defeito.
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [currentPage, setCurrentPage] = useState("list");
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [favorites, setFavorites] = useState([]); // Aqui!!!
    // Então... Vamos começar por criar um estado onde vamos guardar o estado do toggle.. 
    // Aliás, antes disso vamos ver umas cenas..
    // Nós já temos uma lista de favoritos... Ou seja, quando o user clica no <3 o id do pokemon é adicionado a uma lista..
    // O estado dessa adição está mesmo aqui por cima...
    // Então vamos adicionar um estado para o toogle...
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    // Sim, em inglês, deal with it...
    // agora que já temos o estado, vamos adicionar o toggle... Vamos por antes do searchbar...
    // Novamente a mesma coisa... Novo estado para controlar o... estado da coisa... :D Ascendente ou decrescente, por nome... Whatever...
    const [sortBy, setSortBy] = useState("id-asc"); // Filtrar por defeito pelo id ascendente.

    // Agora vamos acrescentar as opções à UI...

    const loadPokemonList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(detailedPokemon);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [fetchPokemonList]);

    // ========================================
    // EFEITOS (Ficheiro 8: useEffect e dados externos)
    // ========================================

    // Carrega dados quando o componente é montado.
    useEffect(() => {
        loadPokemonList();
    }, [loadPokemonList]);

    // Carrega favoritos guardados.
    useEffect(() => {
        const storedFavorites = localStorage.getItem("pokemonFavorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Persiste favoritos sempre que mudam.
    useEffect(() => {
        localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
    }, [favorites]);

    /**
     * Alterna um Pokémon nos favoritos usando o valor mais recente.
     *
     * @param {number} id - ID do Pokémon.
     */
    function toggleFavorite(id) {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            }
            return [...prev, id];
        });
    }
    // Aqui está... Sempre que um <3 é carregado, esta funcao é ativada... Chamamos o estado e devolvemos a lista com os antigos + o novo...

    /**
     * Handler quando um card é clicado. Passa para a página de detalhes.
     *
     * @param {object} pokemonItem - Pokémon selecionado.
     */
    function handlePokemonClick(pokemonItem) {
        setSelectedPokemon(pokemonItem);
        setCurrentPage("details");
    }

    /**
     * Volta para a lista e limpa o Pokémon selecionado.
     */
    function handleBackToList() {
        setCurrentPage("list");
        setSelectedPokemon(null);
    }

    /**
     * Atualiza o termo de pesquisa (input controlado).
     *
     * @param {string} value - Novo valor.
     */
    function handleSearchChange(value) {
        setSearchTerm(value);
    }

    /**
     * Altera o filtro de tipo.
     *
     * @param {string} type - Tipo escolhido.
     */
    function handleTypeChange(type) {
        setSelectedType(type);
    }

    // Vamos criar um handle para lidar com o evento de limpar filtros... 
    // de forma muito resumida, um handler é uma função que trata de um evento. 
    // Ou seja, é uma função que é usada para responder a ações do cliente.
    // Neste caso a ação é limpar os filtros...
    // deixem-me ver os estados que temos...
    function handleClearFilter() {
        setSearchTerm("");
        setSelectedType("all");
    }
    // Agora vamos adicionar um botão para limpar os filtros...
    // ========================================
    // FILTRAGEM (Ficheiro 5: Listas e condicionais)
    // ========================================

    // Agora vamos usar o filtro que já existe para a pesquisa e tipo... E vamos adicionar os favoritos.

    const filteredPokemon = pokemon.filter((poke) => {
        const matchesSearch = poke.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesType =
            selectedType === "all" ||
            poke.types.some((typeInfo) => typeInfo.type.name === selectedType);
        // Vamos acrescentar mais um teste.. Se o pokemon está nos favoritos ou não... 
        const matchesFavorites = !showOnlyFavorites || favorites.includes(poke.id);
        // Basicamente estamos a colocar o contrário do que está nos favoritos (se estiver a true, metemos false e vice versa) OU
        // Os id's dos pokemons que estão na lista.
        // Ou seja, se a primeira estiver a true, significa que quero mostrar os pokemons, logo devolvemos false para ele passar para a parte do ou.
        // Se estiver a false, funciona da mesma forma. Mudamos para true e passamos para o ou.
        // Lembro que num Ou para toda a expressão ser true, uma delas tem que ser true (sorry... Mas estou com um boooocado de sono :D)
        return matchesSearch && matchesType && matchesFavorites; // Esta função devolve true ou false se estas condições forem verdadeiras ou falsas.
    });

    const favoritesCount = favorites.length;
    const resultsCount = filteredPokemon.length;
    const heroTotal = pokemon.length || POKEMON_LIMIT;

    const showList = currentPage === "list";
    const showDetails = currentPage === "details" && selectedPokemon;

    // Não temos.. Criamos uma... :)
    // Back... Como é óbvio é tanga... Não fumo... Fui buscar chocolate.. :D 
    // Então...

    // Nós começamos por ir buscar fetchPokemonList à API, certo?

    // Isto dá-nos a nossa lista dos 151 pokemons...
    // Depois nós filtramos essa lista usando o filtro aqui em cima...
    // filteredPokemon é a lista de pokemons filtrada (se houver algum filtro, senão é a lista completa...)
    // Agora vamos pegar nessa lista e aplicar um sort.. 
    // Já explico o sort quando chegar lá... 
    // Para já basta que compreendam que temos a lista total dos pokemons, depois filtramos essa lista se existir algum filtro. 
    // Se não existir nenhum filtro, a função em cima, devolve false e nada é filtrado e a lista continua com os 151 pokemons.
    // Tem lógica?
    // Ainda se lembram do spread?

    // Se eu tiver x = [1, 2, 3, 4]
    // y = 10
    // z = [...x, y] -> [1, 2, 3, 4, 10]
    // Se tiver w = [...x] tenho uma cópia de x em w... Mas é uma cópia mesmo, são dois arrays diferentes mas com os mesmos valores.
    // Ora, nós não vamos ordenar o array original. Esse não muda... Vamos criar uma cópia desse array e ordenar esse array, certo?
    // Agora vou escrever uma gatafunhada mas no final explico...
    const sortedPokemon = [...filteredPokemon].sort((a, b) => {
        switch (sortBy) {
            case "id-desc":
                return b.id - a.id;
            case "name-asc":
                return a.name.localCompare(b.name);
            case "name-desc":
                return b.name.localCompare(a.name);
            case "id-asc":
            default:
                return a.id - b.id; // erro estupido que se faz às tantas.........
        }
    });

    // Estão a nadar não estão? :D 

    // Então... Em javascript o sort compara dois valores, a e b.
    // Imaginem que temos 5 pokemons. o pokemon pikachu é o pokemon 1. O pokemon Matheus é o 2, o Gui é o 3 e por aí fora...
    // O que o sort faz é comparar pares de elementos de um array. Neste caso pares de pokemons. 
    // Iria comparar o Pikachu (a) com o Matheus (b) depois o Matheus(a) com o Gui(b) e por aí fora.
    // Neste caso, se eu quero comparar pelo id decrescente, então vamos verificar qual é maior. 
    // Sorry, carreguei sem querer para parar o video... 

    // Imaginem este cenário... 
    // a.id = 5
    // b.id = 2
    // a.id - b.id = 3...
    // Este número é positivo... Logo o a tem que vir depois do b para ser crescente..
    // Imaginem agora 
    // b.id - a.id = -3
    // Este número é negativo logo, não mexemos e fica a ordem que está. 
    // Basicamente o sort compara dois valores e consoante é negativo ou positivo, ou troca ou não troca. 

    // O localCompare é um função que compara strings e novamente dá positivo ou negativo. O processo depois é o mesmo. Positivo troca, negativo fica como está.
    // ufff... Já me esqueci onde íamos... :D ahahah

    // deixa ver... Ah falta mostrar...
    // Então agora vamos ver onde mostramos a lista original... E aí trocamos pela lista ordenada. 


    /**
     * Tenta recarregar os dados da API e regressa à lista.
     */
    function handleRetry() {
        setCurrentPage("list");
        setSelectedPokemon(null);
        loadPokemonList();
    }
    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Descobre e explora os 151 Pokémon originais
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total de Pokémon
                            <strong>{heroTotal}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>{favoritesCount}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Resultados filtrados
                            <strong>{resultsCount}</strong>
                        </div>
                    </div>
                </div>
                <div className="pokedex__hero-pokeball" aria-hidden="true" />
            </header>
            {showList && (
                <>
                    <section className="pokedex__controls">
                        <button type="button" onClick={handleClearFilter}>
                            Limpa tudo!
                        </button>

                        <label className="sort-select">
                            Ordenar por:
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="id-asc">ID (ascendente)</option>
                                <option value="id-desc">ID (descendente)</option>
                                <option value="nome-asc">Nome (ascendente)</option>
                                <option value="nome-desc">Nome(descendente)</option>
                            </select>
                        </label>
                        <label className="favorites-toggle">
                            <input
                                type="checkbox"
                                checked={showOnlyFavorites}
                                onChange={() => setShowOnlyFavorites((prev) => !prev)}
                            />
                            Favs!
                        </label>
                        <SearchBar
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <TypeFilter
                            selectedType={selectedType}
                            onTypeChange={handleTypeChange}
                        />
                    </section>

                    <section className="pokedex__results">
                        {loading && <LoadingSpinner />}
                        {error && (
                            <ErrorMessage
                                message={error}
                                onRetry={handleRetry}
                            />
                        )}
                        {!loading && !error && resultsCount === 0 && (
                            <p className="pokedex__empty">
                                Nenhum Pokémon encontrado. Ajusta a pesquisa ou
                                o filtro de tipo.
                            </p>
                        )}
                        {!loading && !error && resultsCount > 0 && (
                            <div className="pokedex__grid">
                                {sortedPokemon.map((poke) => (
                                    <PokemonCard
                                        key={poke.id}
                                        pokemon={poke}
                                        isFavorite={favorites.includes(poke.id)}
                                        onToggleFavorite={toggleFavorite}
                                        onClick={handlePokemonClick}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
            {showDetails && selectedPokemon && (
                <PokemonDetailsPage
                    pokemon={selectedPokemon}
                    isFavorite={favorites.includes(selectedPokemon.id)}
                    onToggleFavorite={toggleFavorite}
                    onBack={handleBackToList}
                />
            )}
        </div>
    );
}
// Tcharam!!! :D 
export default App;
