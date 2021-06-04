window.onload = () => {
  init();
}

const init = () => {
  doApi()
}

const doApi = async() => {
  let url = "http://localhost:3000/appartments/api"
  try{
  let resp = await fetch(url);
  let data = await resp.json();
  console.log(data);
  createItem(data);
  }
  catch(err){
    console.log(err);
  }
}

const createItem = (_ar) => {
  _ar.map(item => {
    let appartment = new Appartment("#row",item);
    appartment.render();
  })
}