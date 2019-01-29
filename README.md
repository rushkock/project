# Suicide rate per country
## Author
Ruchella Kock (rushkock on github) :octocat:

## Github Pages
[Link to Github Pages](https://rushkock.github.io/project/project/code/home.html)

## Summary
This website contains 5 visualizations (3 maps, a bar chart and a zoomable sunburst diagram). Its purpose is to visualize the prevalence of suicide over the world for non-academics.

## Home page
When the website is loaded a few images are shown with quotes to give hope against suicide.
![Home page](doc/homePage.jpg)
### Story
The story contains information about the problem and solution. Essentially it contains information about why the website was made and what it contains.
It is part of the home page. Can also be accessed by clicking on story in the navbar
![Story](doc/story.jpg)

## Visualization page
The visualization page contains 3 linked views.

### World map
![map](doc/map.jpg)
The worldmap contains:
- A slider to change the year
- It can be filtered by age group (Button top right on screen)
- It can be filtered by gender (Top right of screen)
- It has a tooltip
- It also contains a box with additional information when hovering over a country
![On hover](doc/onHover.jpg)

### Bar chart
![Bar chart](doc/barChartFinished.jpg)

The bar chart:
- Can be changed with the slider it is updated depending on the chosen year
- Has a tooltip

### Zoomable sunburst
![sunburst](doc/sunburst10.jpg)
The sunburst:
- Is updated with slider
- Can be filtered with the filter sunburst button (top right). When the page is loaded it shows the top 10 countries with suicides. However, it can show the top 25, top 50 or all the countries.
- Has a tooltip

As it is zoomable the user can click on any part of it and it will zoom in on that area
![example zoom](doc/exampleZoom.jpg)

## US mental health
The US mental health page contains 2 maps of the United States
The first map visualizes suicidal thoughts in each state. On hover the percentage and confidence intervals are shown in the box next to the map.
![Us map](doc/usmap1.jpg)
The second map shows major depressive disorder which is a disorder that may lead to suicide. On hover it shows the percentage in the box
![Us map](doc/usmap2.jpg)

## Data Information
The information tab contains information about the data sets used.
![info page](doc/info.jpg)

It also contains additional contact information in the footer.
![Footer](doc/footer.jpg)

### Link to data sets
- [WHO suicide statistics](https://www.kaggle.com/szamil/who-suicide-statistics)
Transformations: remove outliers and remove countries with no data
- [US suicidal thoughts](https://data.world/samhsa/serious-thoughts-of-suicide)
- [US depression statistics](https://data.world/samhsa/major-depressive-episode)


### External components used
- d3 version (5.7.0)
- d3 tooltip
- bootstrap

### Similar links

[This](http://www.humanosphere.org/global-health/2013/06/visualize-mental-illness/) webpage offers some visualizations of mental health.
It is similar in terms of it also visualizes mental health. However, it is not interactive. Similar to my proposal there is a heat map.

[This](https://ourworldindata.org/mental-health) website also offers visualizations of mental health. The format is more of a paper with static visualizations to view the data. It also uses heat maps and bar charts.

### Challenges
Biggest challenge while making this assignment turned out to be linking the visualizations and filtering them. It took me a whole week to filter it. While fixing one problem 2 more seemed to pop out. Moreover, writing efficient code was also a struggle.
Furthermore, the design decisions I had to make were harder than I thought. View process book for more information.

### Copyrights
