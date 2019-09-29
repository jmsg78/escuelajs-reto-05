const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const getData = api => {
  fetch(api)
    .then(response => response.json()) 
    .then(response => {
      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      
      if (parseInt(localStorage.getItem('page_number')) === parseInt(response.info.pages)) {
        
        let newItemP = document.createElement('p');
        newItemP.innerHTML = `
        <div class="message"> 
         <div class="start"><a href="./">Start</a></div> 
         <div class="text">Ya no hay personajes.</div>
        </div>`;
        $app.appendChild(newItemP);
        intersectionObserver.disconnect()
      }
      else
      {
        let path_info=response.info.next;
        let page = path_info.split('=')
        localStorage.setItem("next_fetch",path_info);
        localStorage.setItem("page_number",page[1]);
        let newItem = document.createElement('section');
        newItem.classList.add('Items');
        newItem.innerHTML = output;
        $app.appendChild(newItem);
      }
      
     
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  let next_characters = localStorage.getItem('next_fetch') || API 
  await getData(next_characters);
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState != 'visible') {
     localStorage.clear()
  }
  else
  {
    $app.innerHTML='';
    loadData();
  }
});