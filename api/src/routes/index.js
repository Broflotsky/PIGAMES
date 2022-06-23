const { Router } = require('express');
require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const {Videogame, Genres} = require('../db');
const e = require('express');
const { Op } = require('sequelize')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// GET API INFO
const getApiInfo = async () => {   
    const paginategames = []; 
    var apiUrl = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)
        while(paginategames.length<5){
        paginategames.push(apiUrl.data.results)
        apiUrl = await axios.get(apiUrl.data.next);
    }
    const apiInfo = paginategames.flat().map((e) => {
       return ({
            id: e.id,
            name: e.name,
            image: e.background_image,
            rating: e.rating,
            platforms: e.platforms.map(c => c.platform.name),
            released: e.released,
            genres: e.genres.map(c => c.name)
        })
    })
    return apiInfo;
} 
 // GET DB INFO
const getDbInfo = async () => {
    return Videogame.findAll({
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
router.get('/videogames/:id', async (req, res) => {
    const {id} = req.params
    try {
        const vgInDbId = await getDbInfo();
        let vgInfoInDb = await vgInDbId.filter(e => e.id == id)
        if (vgInfoInDb.length>0){
            res.status(200).send(vgInfoInDb);}
        else {
            const callApiId = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
            if (callApiId.data.detail === 'Not found.') {
                res.status(400).send("VideoGame with id: ${id} doesn't exists yet")
            } else {
                const dataCallApi = callApiId.data
                const infoId =
                {
                    id: dataCallApi.id,
                    name: dataCallApi.name,
                    image: dataCallApi.background_image,
                    description: dataCallApi.description,
                    rating: dataCallApi.rating,
                    platforms: dataCallApi.platforms.map(c => c.platform.name),
                    released: dataCallApi.released,
                    genres: dataCallApi.genres.map((e) => e.name)           
                }
                res.status(200).send(infoId);
            }
        }
    } catch (error) {
        res.status(400).send("VideoGame with id: ${id} doesn't exists yet")
        console.error(error)
    }
});

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

// FILTER ALPHABET 
router.get('/ordername', async (req,res)=>{
    let getInfo = await allInfo();
    const value = req.query.value

    const ordername = value === 'asc'?
    getInfo.sort(function(a,b) {
        if(a.name > b.name){
            return 1;
        } 
        if (b.name > a.name){
            return -1;
        }
        return 0;
    }) : getInfo.sort(function(a,b){
        if(a.name > b.name){
            return -1;
        } 
        if(b.name > a.name){
            return 1;
        }
        return 0;
    })

    res.status(200).send(ordername)
})

module.exports = router;
