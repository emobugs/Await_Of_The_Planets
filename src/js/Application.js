import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading = document.querySelector('.progress');

    this._load();

    
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }

  async _load(){
    const fetchData = await fetch('https://swapi.boom.dev/api/planets');
    let next = await fetchData.json();

    let counter = 1;
    this._startLoading();
    while(next !== null){
      const fetchPlanets = await fetch(`https://swapi.boom.dev/api/planets?page=${counter}`)
      const data = await fetchPlanets.json();
      const planets = data.results;

      next = data.next;

      planets.forEach(planet => {
        const box = document.createElement("div");
        box.classList.add("box");

        box.innerHTML = this._create(planet);

        document.querySelector(".main").appendChild(box);
      })

      counter++;


    }
    this._stopLoading();

  }

  _create({name, terrain, population}){
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  _startLoading(){
    this._loading.style.display = "block";
  };
  
  _stopLoading(){
    this._loading.style.display = "none";
  };

};
  
  
