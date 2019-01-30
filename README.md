# Suicide rate per country
## Author
Ruchella Kock (rushkock on github) :octocat:

## Github Pages
[Link to Github Pages](https://rushkock.github.io/project/project/code/home.html)

## Product video
[Product video](https://www.youtube.com/watch?v=PUVdg6iTivY&feature=youtu.be)

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
The worldmap contains:
- A slider to change the year
- It can be filtered by age group (Button top right on screen)
- It can be filtered by gender (Top right of screen)
- It has a tooltip
- It also contains a box with additional information when hovering over a country
![On hover](doc/onHover.jpg)

### Bar chart
The bar chart:
- Can be changed with the slider it is updated depending on the chosen year
- Has a tooltip
![Bar chart](doc/barChartFinished.jpg)


### Zoomable sunburst
The sunburst:
- Is updated with slider
- Can be filtered with the filter sunburst button (top right). When the page is loaded it shows the top 10 countries with suicides. However, it can show the top 25, top 50 or all the countries.
- Has a tooltip
As it is zoomable the user can click on any part of it and it will zoom in on that area
![sunburst](doc/sunburst10.jpg)

## US mental health
The US mental health page contains 2 maps of the United States
The first map visualizes suicidal thoughts in each state. On hover the percentage and confidence intervals are shown in the box next to the map.
![Us map](doc/usmap1.jpg)
The second map shows major depressive disorder which is a disorder that may lead to suicide. On hover it shows the percentage in the box.

## Data Information
The information tab contains information about the data sets used.
![info page](doc/info.jpg)

It also contains additional contact information in the footer.
![Footer](doc/footer.jpg)

### Link to data sets
- [WHO suicide statistics](https://www.kaggle.com/szamil/who-suicide-statistics)

Transformations: removed outliers and removed countries with no data
- [US suicidal thoughts](https://data.world/samhsa/serious-thoughts-of-suicide)
- [US depression statistics](https://data.world/samhsa/major-depressive-episode)

### External components used
- d3 version (5.7.0)
- d3 tooltip
- bootstrap

### Copyrights
Copyright (c) 2019 Ruchella Kock
