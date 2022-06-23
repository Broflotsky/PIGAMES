import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getgameName } from '../../actions';

export default function SearchBar(){
    const dispatch = useDispatch();
    const [name, setName] = useState('');

    function handleInputChange(e){
        e.preventDefault()
        setName(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        dispatch(getgameName(name))
        setName('')
    }
    

    return (
        <div>
            <ul>
                <Link to='/home'><li>HOME</li></Link>
                <Link to='/create'><li>CREATE GAME</li></Link>
            <input 
                placeholder='Search a videogame...'
                type='text'
                onChange={(e) => handleInputChange(e)}
            />

            <p type='submit' onClick={(e) => handleSubmit(e)}> SUBMIT </p>
            </ul>

        </div>
    )
}