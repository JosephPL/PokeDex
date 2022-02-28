'use strict';

const inputSearch = document.querySelector('#txtPokemon');
const divSelect = document.querySelector('.ctn-select');
const boton = document.querySelector('#btnObtener');
const dex = document.querySelector('#dex');
const sectionEvoluciones = document.querySelector('#evoluciones');

const urlData = 'https://pokeapi.co/api/v2/';
const urlID = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898'
const urlImg = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/';

document.addEventListener('click', (e)=>{
    if(e.target.tagName === 'LI'){
        inputSearch.value = e.target.textContent;
    }
    if(e.target.tagName === 'A'){
        inputSearch.value = e.target.textContent;
        info();
    }
});

const info = async () => {
    try{
        await fetch(`${urlData}pokemon/${inputSearch.value.toLowerCase()}`)
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
            cadenaEvolucion(pokemon);
        })
    } catch(err){
        console.log(err);
    }

};

boton.addEventListener('click', info);




inputSearch.addEventListener("keyup", async function (e) {
    try{
        await fetch(urlID)
        .then(res => res.json())
        .then(data => {
            const frag = document.createDocumentFragment();
            let texto = inputSearch.value.toLowerCase();
            divSelect.innerHTML = '';
            dex.innerHTML = '';
            
            if(inputSearch.value !== ''){
                for(let i = 0; i < data.results.length; i++){
                    const li = document.createElement('LI');
                    let nombre = data.results[i].name;
        
                    if(nombre.includes(texto)){
                        li.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
                        frag.appendChild(li);0
                    }
                };
            }
            
            divSelect.appendChild(frag);
        })
    } catch(err){
        console.log(err);
    }
});
    
const descripcion = async(pokemon) =>{
    try{
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`)
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
    } catch (err) {
        console.log(err);
    }
};

const imprimirDex = (pokemon) =>{
    let deviceWidth = window.innerWidth; 

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
            
            <img src="${urlImg}${idPkm}.png" class="img-fluid" id="imgPkm">

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

    const imgPkm = document.querySelector('#imgPkm');
    if(deviceWidth >= 530){
        imgPkm.classList.add('bigPicture');
    }
};

const cadenaEvolucion = async(pokemon) =>{
    try{
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`)
        .then(res => res.json())
        .then(data =>{
            const evolt_chain = data.evolution_chain;
            evoluciones(evolt_chain.url);
        })
        } catch (err) {
            console.log(err);
        }
};

const evoluciones = async (cadena) => {
    let pkmEtapas = [];
    let pkmId = [];

    try {
        await fetch(cadena)
        .then(res => res.json())
        .then(data => {

            pkmEtapas.push(data.chain.species.name);
            pkmId.push(data.chain.species.url.slice(42).replace('/',""));
            if(data.chain.evolves_to.length > 1){
                for(let i = 0; i < data.chain.evolves_to.length; i++){
                    pkmEtapas.push(data.chain.evolves_to[i].species.name);
                    pkmId.push(data.chain.evolves_to[i].species.url.slice(42).replace('/',""));
                }
            }else if(data.chain.evolves_to.length > 0){
                pkmEtapas.push(data.chain.evolves_to[0].species.name);
                pkmId.push(data.chain.evolves_to[0].species.url.slice(42).replace('/',""));
                if(data.chain.evolves_to[0].evolves_to.length > 0){
                    pkmEtapas.push(data.chain.evolves_to[0].evolves_to[0].species.name);
                    pkmId.push(data.chain.evolves_to[0].evolves_to[0].species.url.slice(42).replace('/',""));
                }
            }
            
            imprimirEvoluciones(pkmEtapas , pkmId);
            
        })
    } catch (err) {
        console.log(err);
    }
};

const imprimirEvoluciones = (pkmEtapas , pkmId) =>{
    sectionEvoluciones.innerHTML = '';

    for(let i = 0; i < pkmId.length; i++){
        const divCenter = document.createElement('DIV');
        const div = document.createElement('DIV');
        const a = document.createElement('A');

        divCenter.classList.add('card', 'text-center', 'm-3');

        div.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmId[i]}.png"/>`

        a.href = '#';
        a.classList.add('card-text');
        a.textContent = `${pkmEtapas[i].charAt(0).toUpperCase() + pkmEtapas[i].slice(1)}`;

        divCenter.appendChild(div);
        divCenter.appendChild(a);
        sectionEvoluciones.appendChild(divCenter);
    };

};

