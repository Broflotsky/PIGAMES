import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { getuserName } from '../../actions';

import styles from './Landing.module.css'

export default function Landing(){

    const dispatch= useDispatch();
    const [userName, setuserName] = useState('');
    const navigate = useNavigate();

    function handleInputChange(e){
        e.preventDefault()
        setuserName(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        dispatch(getuserName(userName))
        // setuserName('')
        navigate('/home')
    }


    return(

        <div className={styles.background}>
            <input
                type='text'
                placeholder= 'Type your name/username'
                onChange={(e)=> handleInputChange(e)}
                
            />
            <button onClick={(e)=> handleSubmit(e)}>SAVE</button>
            <h1>Puto el que lo lea</h1>
            <Link to='/home'><button>INGRESAR</button>SKIP</Link>
        </div>
    )
}