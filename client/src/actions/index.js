import axios from 'axios';

export function getGames(){
    return async function(dispatch){
        var json = await axios.get('http://localhost:3001/videogames');
        return dispatch({
            type: 'GET_GAMES',
            payload: json.data
        })
    }
}

export function getgameName(payload){
    return async function(dispatch){
        try{
            var json = await axios.get('http://localhost:3001/videogames?name='+ payload)
            return dispatch({
                type:'GET_GAME_NAME',
                payload: json.data
            })
        } catch(error) {
            console.log(error)
        }

    }
}

export function getGenres(){
    return async function(dispatch){
        var json = await axios.get('http://localhost:3001/genres')
        return dispatch({
            type:'GET_GENRES',
            payload: json.data,
        })
    }
}

export function orderAlphabetic(payload){
    return async function(dispatch){
        var json = await axios.get('http://localhost:3001/ordername?value='+ payload)
        return dispatch({
            type: 'ORDER_ALPHABETIC',
            payload: json.data
        })
    }
}
export function getuserName(payload){
    return{
        type: 'GET_USERNAME',
        payload
    }
}

export function getOrderScore(payload){ 
    return{
        type: 'ORDER_RATING',
        payload
    }
}

export function getGenreFilter(payload){
    return{
        type: 'FILTER_GENRE',
        payload
    }
}

export function ApiorDb(payload){
    return{
        type: 'API_OR_DB',
        payload
    }
}

export function getDetail(id){
    return async function(dispatch){
        try{
            var json = await axios.get('http://localhost:3001/videogames/'+ id)
            return dispatch({
                type: 'GET_DETAIL',
                payload: json.data
        })
        } catch(error) { 
        console.log(error) 
        }
    }
}
