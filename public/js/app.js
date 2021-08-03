'use strict';

const inputSearch = document.querySelector('#txtPokemon');
const divSelect = document.querySelector('.ctn-select');
const boton = document.querySelector('#btnObtener');
const dex = document.querySelector('#dex');

const urlData = 'https://pokeapi.co/api/v2/';
const urlID = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898'
const urlImg = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/';

document.addEventListener('click', (e)=>{
    if(e.target.tagName === 'LI'){
        inputSearch.value = e.target.textContent;
    }
})

const info = (e) => {
    e.preventDefault();

    fetch(`${urlData}pokemon/${inputSearch.value}`)
    .then(res => res.json())
    .then(data => {
        divSelect.innerHTML = '';
        const pokemon = {
            nombre : data.name.charAt(0).toUpperCase() + data.name.slice(1),
            id : data.id,
            peso : (data.weight / 10).toFixed(1) + ' Kg',
            altura : (data.height / 10).toFixed(1) + ' m',
            spriteFront : data.sprites.front_default,
            spriteBack : data.sprites.back_default,
            hp : data.stats[0].base_stat,
            ataque : data.stats[1].base_stat,
            defensa : data.stats[2].base_stat,
            spAtaque : data.stats[3].base_stat,
            spDefensa : data.stats[4].base_stat,
            velocidad : data.stats[5].base_stat
        };
        descripcion(pokemon);
    })
    .catch(err => console.log(err));
};

boton.addEventListener('click', info);

inputSearch.addEventListener("keyup", function (e) {
    fetch(urlID)
    .then(res => res.json())
    .then(data => {
        
        const frag = document.createDocumentFragment();
        let texto = inputSearch.value;
        divSelect.innerHTML = '';
        dex.innerHTML = '';
        
        if(inputSearch.value !== ''){
            for(let i = 0; i < data.results.length; i++){
                const li = document.createElement('LI');
                let nombre = data.results[i].name;
    
                if(nombre.includes(texto)){
                    li.textContent = nombre;
                    frag.appendChild(li);
                }
            };
        }
        
        divSelect.appendChild(frag);
    })
    .catch(err => console.log(err));
});
    
const descripcion = (pokemon) =>{
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`)
    .then(res => res.json())
    .then(data => {

        for(let i = 0; i < 100; i++){
            if(data.flavor_text_entries[i].language.name == 'es'){
                pokemon.descripcion = data.flavor_text_entries[i].flavor_text;
                break;
            }
        }
        imprimirDex(pokemon);
    })
    .catch(err => console.log(err));
};

const imprimirDex = (pokemon) =>{
    let idPkm = 0; 
    if(pokemon.id <= 9){
        idPkm = `00${pokemon.id}`;
    }else if(pokemon.id <= 99){
        idPkm = `0${pokemon.id}`;
    }else {
        idPkm = `${pokemon.id}`;
    }

    const html = `
            <div class="card text-center d-flex justify-content-center">
                <h4 class="card-title">Pokedex Nacional</h4>
                <p class="card-text">Pokemon: #${pokemon.id}</p>
                <h5 class="card-title">${pokemon.nombre}</h5>
                <div>
                    <img src="${pokemon.spriteFront}" class="rounded float-start imgSpt col-md-1">
                    <img src="${pokemon.spriteBack}" class="rounded float-end imgSpt col-1">
                </div>
                <div class="card-body">
                    <p class="card-text">Altura: ${pokemon.altura}</p>
                    <p class="card-text">Peso: ${pokemon.peso}</p>
                    <p class="card-text"><span>Descripción:</span> ${pokemon.descripcion}</p>
                </div>
            </div>
            
            <img src="${urlImg}${idPkm}.png" class="img-fluid bigPicture">

            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Stats</h5>
                    
                        <p>HP: <span>${pokemon.hp}</span></p>
                        <p>ATAQUE: <span>${pokemon.ataque}</span></p>
                        <p>DEFENSA: <span>${pokemon.defensa}</span></p>
                        <p>ESP.ATAQUE: <span>${pokemon.spAtaque}</span></p>
                        <p>ESP.DEFENSA: <span>${pokemon.spDefensa}</span></p>
                        <p>VELOCIDAD: <span>${pokemon.velocidad}</span></p>
                    
                </div>
            </div>
    `;
    
    dex.innerHTML = html;
};







