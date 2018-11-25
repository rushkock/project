# Mental disorders in united state for ages 18 and up
Ruchella Kock
12460796
This website will make a heat map, bar chart and zoomable sunburst diagram in order to help visualize the prevalence of mental disorders for non-academics(as well as academics).

## Problem statement
There is a lot of data and information about different mental health diseases. There are many papers describing prevalence rates of mental disorders (e.g. Anderson, Freedland, Clouse, & Lustman, 2001; Nock, et al., 2008). However, based on my experience these papers use tables instead of visualizations to show the data. Moreover, if visualizations are used it is complicated and academic as in the case with the paper by Nock and colleagues (2008). This website aims to provide clear visualizations for academics and non-academics alike who are interested in prevalence rates of mental disorders in the united states.

## Solution
I will show the prevalence in the united states of mental disorders, serious mental disorders, depression and suicidal thoughts in 4 different graphs in order to relay information in different, clear and fast ways to the audience.

## Main features

<img align="left" src="doc/visualisation.png">

![Visualisation](doc/visualisation.png)

- Heat map with tooltip and when hovering information in separate box

![Heatmap](doc/heat map.png)

![Heatmap US](doc/heatmap US.png)

- Bar chart with enlargement effect
- Zoomable sunburst diagram with enlargement effect
- ----
- Dropdown sort by state
In this dropdown all the states will be available. Once a state is chosen these are highlighted perhaps with both the use of colour and or enlargements. The data for the other states will be in the background.
- Dropdown sort by type of disorder
This will provide the possibility to change between the datasets. Essentially providing the same visualizations but for a whole other dataset.
- Tooltip with extra information
- Enlargement while hovering

## The minimum viable product (MVP)
-	Heat map with tooltip and when hovering information in separate box (See heatmap)
-	Bar chart with enlargement effect
-	Zoomable sunburst diagram with enlargement effect
-	Dropdown sort by type of disorder
-	Tooltip with extra information

## Optional to implement.
- ----
- Perhaps working with all 4 datasets may be optional I may just choose 2 to start
- Enlargement while hovering
- Dropdown sort by state

## Prerequisites
### Data sources
[Thoughts of suicide](https://data.world/samhsa/serious-thoughts-of-suicide)

[Major depressive episode](https://data.world/samhsa/major-depressive-episode)

[Serious mental illness](https://data.world/samhsa/serious-mental-illness)

[Any mental illness](https://data.world/samhsa/any-mental-illness)

Note: no transformations necessary

### External components
List the external components (libraries like d3-tip or SQLite) that you need to implement certain features. Include the names, and if the component is not standard, include a link to its website.

### Previous implementation
My website I find to be most similar to this website [CSRIB](https://dboekhout.github.io/CSRIB/).
The use of 4 visualizations. Including a heat map and bar charts. This website also allows the possibility to sort by country (which would be sort by state in my case). It also offers interactive elements such as the tooltip and enlargements.

[This](http://www.humanosphere.org/global-health/2013/06/visualize-mental-illness/) webpage offers some visualizations of mental health.
It is similar in terms of it also visualizes mental health. However, it is not interactive. Similar to my proposal there is a heat map.

[This](https://ourworldindata.org/mental-health) website also offers visualizations of mental health. The format is more of a paper with static visualizations to view the data. It also uses heat maps and bar charts.

### Challenges
Using data from 4 different datasets could be challenging. In technical terms I believe the zoomable sunburst diagram will be the hardest to implement. It is something I have not done before. It may also be hard to make it a clear and functional visualization. Rather, instead of making the data clearer for everyone if not implemented properly it may make it more confusing.
