import React from 'react';

export default function Card({name, image, genres}){

    return(
        <div>
            <h1>{name}</h1>
            <img src={image} alt="NOT AVALAIBLE" width='400px' height='250px'/>
            <p> { genres.join(' / ') } </p>
        </div>
    )
}