const { Router } = require('express');
require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const {Videogame, Genres} = require('../db');
const e = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// GET API INFO
const getApiInfo = async () => {    
    const apiUrl = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=2`)
    const apiInfo = apiUrl.data.results.map((e) => {
        return ({
            id: e.id,
            name: e.name,
            image: e.background_image,
            rating: e.rating,
            platforms: e.platforms.map(c => c.platform.name),
            released: e.released
        })
    })
    return apiInfo;
} 
 // GET DB INFO
const getDbInfo = async () => {
    const infoDb = Videogame.findAll({
        include: {
            model: Genres,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    })
}

//GET ALL INFO
const allInfo = async () => {
    const infoApi = await getApiInfo();
    const infoDb = await getDbInfo();
    const infoComplete = infoApi.concat(infoDb);
    return infoComplete;
}

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


//GET /VIDEOGAMES y /VIDEOGAMES?NAME
router.get('/videogames', async(req, res) => {
    const getInfo = await allInfo();
    const name = req.query.name
    if (name) {
        const filName = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}&page_size=15`)
        const fildos = filName.data.results.map((e) => {
            return ({
                id: e.id,
                name: e.name,
                image: e.background_image,
                rating: e.rating,
                platforms: e.platforms.map(c => c.platform.name),
                released: e.released
            })
        })
        fildos.length > 0 ? res.status(200).send(fildos) :  res.status(400).send('We cant find a result with these parameters')
    } else {  res.status(200).send(getInfo) }  

})

//GET VIDEOGAMES/ID
router.get('/videogames/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params
    const idInfoDb = await getDbInfo();
    try {
        if(idInfoDb !== undefined){
        const infoApifil = idInfoDb.filter((e) => e.id == idVideogame)
        if (infoApifil.length>0) { res.status(200).send(infoApifil) }
    } else {
        const idInfoApi = await axios.get(`https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`)
        const idApi = idInfoApi.data
                const idComplete = {
                    id: idApi.id,
                    name: idApi.name,
                    image: idApi.background_image,
                    rating: idApi.rating,
                    platforms: idApi.platforms.map(c => c.platform.name),
                    released: idApi.released           
                }
        res.status(200).send(idComplete)
    }} catch {
        res.status(400).send('We cant find a videogame, sorry.')
    }
})

//GET /GENRES
router.get('/genres', async (req,res) => {
    const genresUrl = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
    const genresInfo = genresUrl.data.results.map((e) => e.name)

    genresInfo.forEach((e) => {
        Genres.findOrCreate({
            where: {name: e}
        })
    })
    const allGenres = await Genres.findAll();
    res.status(200).send(allGenres)

})

//POST /VIDEOGAME
router.post('/videogame', async (req,res) => {
    const {name, image, rating, platforms, released, genres, description} = req.body

    if(!name || !description || !platforms) { res.status(400).send('Fields (*) are required') }
        let gameCreate = await Videogame.create(
            {name, 
            image, 
            rating, 
            released,
            platforms, 
            description})

        let genreCreate = await Genres.findAll({
            where: {name: genres}
        })

        gameCreate.addGenres(genreCreate);
        res.status(200).send('Videogame created succesfully')
    
})

module.exports = router;
