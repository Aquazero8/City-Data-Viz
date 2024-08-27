#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd


# In[ ]:


df = pd.read_csv('movement2_temp.csv')
df


# In[ ]:


# Changing the timestamp to required format
from datetime import datetime
df['timestamp']=pd.to_datetime(df['timestamp'])
df


# In[ ]:


# FILTER: First week of every month

filtered_df = pd.DataFrame()  # create an empty DataFrame to store the filtered data
for year_month in pd.date_range(start=df['timestamp'].min().strftime('%Y-%m-01'), end=df['timestamp'].max().strftime('%Y-%m-01'), freq='MS'):  # loop through each year-month combination starting from the first day of the earliest timestamp in the data and ending with the first day of the latest timestamp in the data
    first_week_start = year_month  # the first day of the first week in the month
    first_week_end = year_month + pd.Timedelta('7 days')  # the last day of the first week in the month
    mask = (df['timestamp'] >= first_week_start) & (df['timestamp'] <= first_week_end)  # create a boolean mask to filter the data for the first week of the current month
    filtered_df = pd.concat([filtered_df, df.loc[mask]])  # concatenate the filtered data to the DataFrame that stores all the filtered data so far
    
filtered_df
filtered_df.to_csv('filtered_df.csv')


# In[ ]:


filtered_df = pd.read_csv('filtered_df.csv')
filtered_df.drop(filtered_df.columns[0], axis=1, inplace=True)
filtered_df


# In[ ]:


# group the data by participant id
grouped = filtered_df.groupby('participantID')


# iterate over each group and write to a separate CSV file
for pid, group in grouped:
    filename = f'pmoveData/pm{pid}.csv'
    group.to_csv(filename, index=False)

