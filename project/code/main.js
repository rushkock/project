window.onload = function()
{
  var requests = [d3.json("../data/json/world_countries.json"),
                  d3.tsv("../data/world_population.tsv"),
                  d3.json("../data/json/suicide_pooled.json"),
                  d3.json("../data/json/suicide.json"),
                  d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json'),
                  d3.json("https://d3js.org/us-10m.v1.json"),
                  d3.json("disorders.json")];

  Promise.all(requests).then(function(response) {
     makeMap(response);
     allData = processDate(response[2], 2005);
     data = processDate(response[3], 2005);
     filterSunburst(allData, data, "10");
     makeBar(response);
     states = preprocessing(response);
     makeUSMap(response, states);
  }).catch(function(e){
      throw(e);
  });
};

// this function returns the data for the chosen year
function processDate(data, year){
  var date = [];
  var yearF = parseFloat(year);
  for (var i in data){
    if (data[i].year === yearF){
      date.push(data[i]);
    }
  }
  return date;
}

// // this functions gets the states that the mouse is hovering over
// function getSelectedStateF(d, pooledData, country, property){
//    var selectedState = "";
//    pooledData.forEach(function(e) {
//      // console.log(e[country])
//      // console.log(d[property])
//      if (e[country] == d[property]){ selectedState = e;}
//    });
//    return selectedState;
// }
