#!/usr/bin/env python
# Name: Ruchella Kock
# Student number: 12460796
# note move to the data folder before use!!
"""
This script transforms a csv file to a JSON file
"""
import pandas as pd


def main():
    # read csv into datframe
    df = pd.read_csv("csv/who_suicide_statistics.csv")

    # remove rows with empty cells
    df = df.dropna(axis=0)

    # get the sum of the groups:
    # grouped_df = df.groupby(by=["country", "year"], as_index=False).sum()

    # make sure all groups (a group is filtered by country and year e.g.
    # all values with albania and 1995) have a sum that is bigger than 0
    grouped_df = df.groupby(by=["country", "year"], as_index=False).filter(
                            lambda x: x["suicides_no"].sum() > 0)
    print(grouped_df)

    # transform df to json
    grouped_df.to_json(path_or_buf="json/suicide.json", orient="records")


if __name__ == '__main__':
    main()
