const initialState= {
    games: [],
    allgames: [],
    genres: [],
    username: 'User',
    gamedetail: [],
}

function rootReducer(state=initialState, action){
    switch(action.type){

        //ALL INFO API ARRIVE HERE
        case 'GET_GAMES':
            return {
                ...state,
                games: action.payload,
                allgames: action.payload,   
            }
        // GET VIDEOGAME NAME SEARCH
        case 'GET_GAME_NAME':
            return{
                ...state,
                games: action.payload
            }
        // GET ALL GENRES    
        case 'GET_GENRES':
            return{
                ...state,
                genres: action.payload,
            }
        // ASSIGNMENT A USERNAME TO BETTER EXPERIENCE
        case 'GET_USERNAME':  
            return{
                ...state,
                username: action.payload
            }
        // ORDER RATING GAMES
        case 'ORDER_RATING':
            let gamesrating = action.payload === 'highest rating' ?
            state.games.sort(function (a, b) {
                if (a.rating < b.rating) {
                    return 1;
                }
                if (b.rating < a.rating) {
                    return -1;
                }
                return 0;
            }) :
            state.games.sort(function (a, b) {
                if (a.rating < b.rating) {
                    return -1;
                }
                if (b.rating < a.rating) {
                    return 1;
                }
                return 0
            })
            return{
                ...state,
                games: gamesrating
            }
        // ORDER ALPHABETIC 
        case 'ORDER_ALPHABETIC':
            return{
                ...state,
                games: action.payload
            }
        // FILTER BY GENRE
        case 'FILTER_GENRE':
            const statetofil = state.allgames
            const filtered = action.payload === 'All'? statetofil : statetofil.filter((e) => e.genres.includes(action.payload))
            return{
                ...state,
                games: filtered
            }
        //GET GAMES FROM API, DB OR ALL
        case 'API_OR_DB':
            const tofilter = state.allgames
            let infofiltered = []; 
            
            if(action.payload === 'All'){
                infofiltered = tofilter;
            }
            if(action.payload === 'Db'){
                infofiltered = tofilter.filter(e => e.createdInDb === true)
                if(infofiltered.length === 0){
                    infofiltered = tofilter;
                }
            }
            if(action.payload === 'Api'){
                infofiltered = tofilter.filter(e => e.createdInDb === undefined)
            }

            return{
                ...state,
                games: infofiltered
            }
        //GET GAME DETAIL 
        case 'GET_DETAIL':
            return{
                ...state, 
                gamedetail: action.payload
            }
        
        default: return state;
    }

}

export default rootReducer;