import React from 'react';
import { useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { getDetail } from '../../actions';
import SearchBar from '../SearchBar/SearchBar';


export default function GameDetail(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const mygame = useSelector((state) => state.gamedetail)
    
    useEffect(() => {
        dispatch(getDetail(id))   
    },[dispatch])


    return(
        <div>
            <SearchBar />
            {
                mygame.length>0? 
                <div><h1>HOLA</h1></div> : <h1> LOADING </h1>
            }
        </div>
    )
}