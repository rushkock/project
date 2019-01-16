window.onload = function()
{
  var requests = [d3.json("../data/json/world_countries.json"),
                  d3.tsv("../data/world_population.tsv"),
                  d3.json("../data/json/suicide_pooled.json"),
                  d3.json("../data/json/suicide.json"),
                  d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json')];

  Promise.all(requests).then(function(response) {
     makeMap(response)
     makeBar(response)
     makeSunburst(response)
  }).catch(function(e){
      throw(e);
  });
}
