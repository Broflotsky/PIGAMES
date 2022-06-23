import React from 'react';
import {useState , useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { ApiorDb, getGames, getGenreFilter, getGenres, getOrderScore, orderAlphabetic } from '../../actions';
import Card from '../Card/Card';
import Paginado from '../Paginado/Paginado';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Home.module.css'

export default function Home(){
    const dispatch = useDispatch();
    const allgames = useSelector((state) => state.games);
    const allgenres = useSelector((state) => state.genres);

    useEffect(()=> { 
        dispatch(getGames());
        dispatch(getGenres());
    },[dispatch])

    // FILTERS & SORTS
    const [, setOrden] = useState('')
    function handleScore(e){
        e.preventDefault();
        dispatch(getOrderScore(e.target.value))
        setCurrentPage(1);
        setOrden(`Ordered ${e.target.value}`)
    }

    function handleAlpha(e){
        e.preventDefault();
        dispatch(orderAlphabetic(e.target.value))
        setCurrentPage(1);
        setOrden(`Ordered ${e.target.value}`)
    }

    function handleGenre(e){
        e.preventDefault();
        dispatch(getGenreFilter(e.target.value))
        setCurrentPage(1);
        setOrden(`Ordered ${e.target.value}`)
    }

    function handleApiorDb(e){
        e.preventDefault();
        dispatch(ApiorDb(e.target.value))
        setCurrentPage(1);
        setOrden(`Ordered ${e.target.value}`)
    }

    // PAGINADO
    const[currentPage, setCurrentPage] = useState(1)
    const[gamesPerPage, ] = useState(15) 
    const lastGameIndex = currentPage * gamesPerPage
    const firstGamesIndex = lastGameIndex - gamesPerPage
    const currentGames = allgames.slice(firstGamesIndex, lastGameIndex)

    const paginado = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return(<div>
        
        {/* PAGINADO AND SEARCHBAR CONTAINER */}
        <div>
            <SearchBar />
            <Paginado 
                gamesPerPage = {gamesPerPage}
                allgames = {allgames.length}
                paginado = {paginado}
                />
        </div>

        {/* FILTERS AND SORT CONTAINER */}
        <div>
            {/* FILTERING FROM FRONT-END */}
        <select onChange={(e)=> handleScore(e)}> 
            <option value='highest rating'>Highest Rating ↓</option>
            <option value='lowest rating'>Lowest Rating ↑</option>
        </select>

        <select onChange={(e)=> handleAlpha(e)}>
            <option value='asc'>(A-Z)</option>
            <option value='dsc'>(Z-A)</option>
        </select>

        <select onChange={(e) => handleGenre(e)}>
            <option key='All' value='All'> All </option>
            {allgenres.map((c) =>{
                return (
                    <option key={c.id} value={c.name}> {c.name} </option>
                )
            })}
        </select>

        <select onChange={(e) => handleApiorDb(e)}>
            <option key='All' value='All'>All</option>
            <option key='Api' value='Api'>Api</option>
            <option key='Db' value='Db'>Db</option>
        </select>
        </div>
        
        {/* CARDS CONTAINER */}
        <div className={styles.container}>           
        {
            currentGames.map((c) => {
                return(
                    <Link to={'/detail/'+c.id} key={c.id}>
                            <Card name = {c.name} 
                            image ={c.image} 
                            genres={ c.genres.map((e) => e.name? e.name : e )}/>
                        </Link>
                    )
                })
            }
        </div>
    </div>)
}