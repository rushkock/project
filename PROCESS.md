# day 2 (8 - 01 - 2018)
I made the design of the Home and Sources page.
At first I was using colored divs to seperate my text.
![First website design with div example](first_website_design.jpg)
However, I discovered bootstrap cards. Which I used in my design in place of divs.
Ultimately I feel cards are handier to use and easier to contain. They also make the code a bit more readable.
![Website with cards](bootstrap_cards.jpg)

# day 3 (9 - 01 - 2018)
I started the day preprocessing my data. I feel I have discovered an important part of pandas.
I used GroupBy to group my data based on country and year. Many transformations can be performed on these groups.
Illustrated in the [GroupBy article](http://pandas.pydata.org/pandas-docs/stable/groupby.html).
Of the most notable ones, you can sum your groups, calculate mean, std and many more statistics.
You can also transform your data such as calculate the Z score and transform the values to Zvalues.
For the preprocessing, I removed years where all the number of suicides were 0. I also removed empty cells.
This file is in [suicide.json](project/data/suicide.json).
I summed all the values for each group (so each country and each year has 1 value for the number of suicides).
This can be found in [suicide_pooled.json](project/data/suicide_pooled.json).

I also started the visualization of the heatmap.
Here is a picture of what it looked like at the end of the day.
My data was not loaded in yet, and none of the links for filtering work.
![First map design](map_progress.jpg)

# day 4 (10 - 01 - 2018)
I started the day
