require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(session({
    secret: 'projeto-pokedex-modulo2-proj2',
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(flash());

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

const pokedex = [
    {
      id: 1,
      nome: "Bulbasaur",
      descricao:
        "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
      tipo: "Grass",
      imagem: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
    },
    {
      id: 2,
      nome: "Charmander",
      descricao:
        "It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.",
      tipo: "Fire",
      imagem: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
    },
    {
      id: 3,
      nome: "Squirtle",
      descricao:
        "When it retracts its long neck into its shell, it squirts out water with vigorous force.",
      tipo: "Water",
      imagem: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
    },
    {
      id: 4,
      nome: "Pikachu",
      descricao:
        "Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.",
      tipo: "Eletric",
      imagem: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    },
  ];


app.get("/", (req, res) => {
    message = req.flash('message');
    if(!message.length) message = null;
    console.log(message);
    res.render("index", { pokedex, message});
});

app.get("/novo", (req, res) => {
    res.render("novo");
});

app.post("/create", (req, res) => {
    const pokemon = req.body;
    pokemon.id = pokedex.length + 1;
    pokedex.push(pokemon);
    req.flash('message', `pokémon "${pokemon.nome}" adicionado com sucesso!`);
    res.redirect("/");
});

app.get("/detalhes/:id", (req, res) => {
    const id = +req.params.id;
    message = req.flash('message');
    if(!message.length) message = null;
    console.log(message);
    
    const pokemon = pokedex.find((p) => p && p.id === id);
    res.render("detalhes", {pokemon, message});
});

app.get("/editar/:id", (req, res) => {
    const id = +req.params.id;

    const pokemon = pokedex.find((p) => p && p.id === id);
    res.render("editar", {pokemon});
});

app.post("/update/:id", (req, res) => {
    const id = +req.params.id - 1;
    const newPokemon = req.body;
    newPokemon.id = id + 1;
    pokedex[id] = newPokemon;
    req.flash('message', `pokémon "${newPokemon.nome}" atualizado com sucesso!`);
    res.redirect(`/detalhes/${newPokemon.id}`);
});

app.get("/delete/:id", (req, res) => {
    const id = +req.params.id - 1;
    const pokemonParaExcluir = pokedex[id];
    req.flash('message', `pokémon "${pokemonParaExcluir.nome}" excluído com sucesso!`); 
    delete pokedex[id];

    res.redirect("/");
});

app.listen(port, () => console.log(`servidor rodando em http://localhost:${port}`))