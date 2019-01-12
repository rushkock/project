window.onload = function()
{
  var requests = [d3.json("../data/json/world_countries.json"),
                  d3.tsv("../data/world_population.tsv"),
                  d3.json("../data/json/suicide_pooled.json")];

  Promise.all(requests).then(function(response) {
     makeMap(response)
     makeBar(response)
  }).catch(function(e){
      throw(e);
  });
}
