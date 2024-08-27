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


# ONLY 7 days of MARCH 2022 for all participants

start_date = pd.to_datetime('2022-03-01')
end_date = pd.to_datetime('2022-03-07')

# filter the dataset to keep data for the set of dates
filtered_df1 = df.loc[(df['timestamp'] >= start_date) & (df['timestamp'] <= end_date)]

filtered_df1


# In[ ]:


filtered_df1.to_csv("allParticipantsCombined.csv")


# In[ ]:


filtered_df1 = pd.read_csv('allParticipantsCombined.csv')
filtered_df1.drop(filtered_df1.columns[0], axis=1, inplace=True)
filtered_df1
filtered_df1.to_csv("participantsCombined.csv")

