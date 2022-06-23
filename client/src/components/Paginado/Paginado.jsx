import React from "react";

export default function Paginado ({gamesPerPage, allgames, paginado}){
    const pageNumbers = []

    for(let i=1; i <= Math.ceil(allgames/gamesPerPage); i++){
        pageNumbers.push(i)
    }

    return(
        <nav>
            <ul>
                {pageNumbers && pageNumbers.map(number =>(
                    <div key={number}>
                    <li key={number} >
                    <p onClick={() => paginado(number)}> {number} </p>
                    </li>
                    </div>
                ))}
            </ul>
        </nav>
    )
}