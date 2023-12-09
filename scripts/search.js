
// Методы, которые могут пригодиться:
// starWars.searchCharacters(query), 
// starWars.searchPlanets(query), 
// starWars.searchSpecies(query).
// starWars.getCharactersById(id), 
// starWars.getPlanetsById(id), 
// starWars.getSpeciesById(id)

// Тут ваш код.
// Пример использования методов для поиска персонажей, планет и видов
document.addEventListener('DOMContentLoaded', () => {
  //By query
  const searchInput = document.querySelector('.input');
  const searchButton = document.querySelector('#byQueryBtn');
  const select = document.querySelector('#resourceSelect');

  //By Id
  const idInput = document.querySelector('.inputId');
  const selectId = document.querySelector('#resourceSelectById');
  const idButton = document.querySelector('#byIdBtn');

  const resultContainer = document.querySelector('#result-container');
  const messageBody = document.querySelector('.message-body')
  const heading = document.querySelector('.primary');
  

  const deleteButton = document.querySelector('.delete');

  searchButton.addEventListener('click', querySearch)
  idButton.addEventListener('click', idSearch)
  async function querySearch(){
    const query = searchInput.value.trim();
    const selectedResource = select.value;
    heading.innerHTML = '';
    messageBody.innerHTML = '';
    if(query){    
      try{
        showSpinner();

        const searchMethod = getSearchMethod(selectedResource);
        const searchData = await searchMethod(query);

        displayCharacterInfo(searchData)
        resultContainer.style.visibility = 'visible';
      }catch(err){
        console.log(err);
      }finally{
        hideSpinner();
      }

    }   
  }

  //ПОИСК ПО ID
  async function idSearch(){
    const id = idInput.value.trim();
    const selectedResource = selectId.value;
    heading.innerHTML = '';
    messageBody.innerHTML = '';
    if(id){
      try{
        showSpinner();

        const searchMethod = getSearchMethod(selectedResource);
        const searchData = await searchMethod(id);

        displayCharacterInfo(searchData);
        resultContainer.style.visibility = 'visible';
      }catch(err){
        console.log(err)
      }finally{
        hideSpinner();
      }
    }
  }

  //Удаляем инфу
  deleteButton.addEventListener('click', () => {
    resultContainer.style.visibility = 'hidden';
    messageBody.innerHTML = '';
    heading.innerHTML = '';
  })

  function extractIdFromUrl(url){
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
  }
  function showSpinner(){
    document.querySelector('.spinner').style.visibility = "visible";
  }
  function hideSpinner(){
    document.querySelector('.spinner').style.visibility = "hidden";
  }
  async function displayCharacterInfo(data){
    const result = data.results[0];
    heading.innerHTML = result.name;
    console.log(result)
    for(let key in result){
      const keyValuePara = document.createElement('p');
      if(key === 'homeworld'){
        const planet = await starWars.getPlanetsById(extractIdFromUrl(result[key]));
        console.log(planet);
        keyValuePara.textContent = `homeworld ${planet.name}`;
      }else{
        keyValuePara.textContent = `${key}: ${result[key]}`;
      }
      
      messageBody.appendChild(keyValuePara);
    }
  }

  function getSearchMethod(selectedResource) {
    switch (selectedResource) {
      case 'people':
        return starWars.searchCharacters;
      case 'planets':
        return starWars.searchPlanets;
      case 'species':
        return starWars.searchSpecies;
      default:
        throw new Error('Invalid resource selection');
    }
  }
})