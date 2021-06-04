class Appartment {
  constructor(_parent, _item) {
    this.parent = _parent;
    this.hostName = _item.hostName;
    this.img = _item.img;
    this.location = _item.location;
    this.extras = _item.extras;
    this.pernight = _item.perNight;
    this.appartmentDesc = _item.appartmentDesc;
    this._id = _item._id;
  }

  render() {
    let newDiv = document.createElement("div");
    newDiv.className = "item";
    newDiv.style.display = "flex";
    newDiv.style.padding = "5px";
    document.querySelector(this.parent).append(newDiv);

    newDiv.innerHTML += `
     <img src="${this.img}" style="width:300px">
      <div class="info" style="padding:5px">
        <h3>${this.appartmentDesc}</h3>
        <small>${this.location}, by host: </small>
            <small><strong>${this.hostName}</strong></small>
            <ul style="list-style: none; display:inline">
            <li>${this.extras[0]}</li>
            <li>${this.extras[1]}</li>
            <li>${this.extras[2]}</li>
            <div><strong>Per Night: ${this.pernight}EUR0 </strong></div>
            <button>Book Now</button>
        </ul>

      </div>

    `
  }
}