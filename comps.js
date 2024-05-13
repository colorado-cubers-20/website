class Comp {
    constructor(comp_name, date, end_date, id, city, events){
        this.comp_name = comp_name;
        this.date = date;
        this.end_date = end_date;
        this.id = id;
        this.city = city;
        this.events = events;
    }
    get comp_name(){
        return this._comp_name;
    }
    get date(){
        return this._date;
    }
    get end_date(){
        return this._end_date;
    }
    get id(){
        return this._id;
    }
    get city(){
        return this._city;
    }
    get events(){
        return this._events;
    }
    set comp_name(x){
        this._comp_name = x;
    }
    set date(x){
        this._date = x;
    }
    set end_date(x){
        this._end_date = x;
    }
    set id(x){
        this._id = x;
    }
    set city(x){
        this._city = x;
    }
    set events(x){
        this._events = x;
    }
}
var currentDate = new Date().toJSON().slice(0, 10);
var co_comps = []

function get_event_list(events){
    // make the main div to add all images to
    var img_container = document.createElement("div");
    img_container.setAttribute("id", "event-list");
    events.forEach(e =>{
        let img = document.createElement("img");
        let src_url =  e + ".svg";
        img.setAttribute("src", src_url);
        img.setAttribute("class", "conditional-image");
        img_container.appendChild(img);
    });
    return img_container;
}


function get_comps(){
// get the table
var table = document.getElementById("comp_table");

// api call
  fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/US.json")
.then(response => {
  if (!response.ok) {
    throw new Error('Network response error');
  }
  return response.json();
})
.then(data => {
  data.items.forEach(comp1 => {
    if(comp1.date.from > currentDate){
        if(comp1.city.slice(-8) == 'Colorado' || comp1.city.slice(-7) == 'Wyoming' || comp1.city.slice(-10) == 'New Mexico'){
            let year = comp1.date.from.slice(0,4);
            let d = comp1.date.from.slice(5) + "-" + year;
            year = comp1.date.till.slice(0,4);
            let ed = comp1.date.till.slice(5) + "-" + year;
            var c = new Comp(comp1.name, d, ed, comp1.id, comp1.city, comp1.events) 
            co_comps.push(c)       
        }
    }
  });
  co_comps.sort((a, b) => (a.date > b.date) ? 1 : -1)
    //fill in table
    co_comps.forEach(x =>{
        let row = document.createElement("tr");
        row.setAttribute("scope", "row");
        let cell1 = document.createElement("td"); 
        cell1.textContent = x.comp_name;
        row.appendChild(cell1);
        let cell2 = document.createElement("td"); 
        cell2.textContent = x.city;
        row.appendChild(cell2);
        if(x.date == x.end_date){
            let cell3 = document.createElement("td"); 
            cell3.textContent = x.date;
            row.appendChild(cell3);
        }
        else{
            let d = x.date + " to " + x.end_date;
            let cell4 = document.createElement("td"); 
            cell4.textContent = d;
            row.appendChild(cell4);
        }
        let cell5 = document.createElement("td"); 
        cell5.appendChild(get_event_list(x.events));
        row.appendChild(cell5);

        var link = document.createElement("a");
        link.setAttribute("class", "btn");
        link.setAttribute("href", "https://www.worldcubeassociation.org/competitions/" + x.id);
        link.textContent = "Visit";
        let cell6 = document.createElement("td");
        cell6.appendChild(link);
        row.appendChild(cell6);

        table.appendChild(row);
    })
  

})
.catch(error => {
  console.error('Error:', error);
});
}

get_comps();
