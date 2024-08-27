#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd


# df = pd.read_csv('CheckinJournal.csv')
# df

# In[ ]:


# Group the data by venueId and get the count of participants
result = df.groupby('venueId')['participantId'].size().reset_index(name='count')

# Print the result
print(result)


# In[ ]:


merged = pd.merge(df,result, on='venueId')
merged


# In[ ]:


grouped_df = merged.groupby('venueId').agg({'participantId': lambda x: list(x)})
grouped_df

# join with counts_df on venueId
result_df = pd.merge(grouped_df, result, on='venueId')
print(result_df)


# In[ ]:


final_merge = result_df.merge(df[['venueId','venueType']], on='venueId', how='left')
final_merge


# In[ ]:


finalDf = final_merge.drop_duplicates(subset=['venueId'])
finalDf = finalDf.reset_index()
finalDf


# In[ ]:


finalDf.to_csv('CheckinJournalCount_ClubbedParticipants.csv')


# In[ ]:


df = pd.read_csv('CheckinJournalCount_ClubbedParticipants.csv')
df


# In[ ]:


df1 = df[df['venueType'] != 'Apartment']
df1 = df1.reset_index()
print(df1)
df1.drop([df1.columns[0],df1.columns[1],df1.columns[2]], axis=1, inplace=True)
df1


# In[ ]:


grouped = df1.groupby('venueType')

result = {}
for key, group in grouped:
    result[key] = group.to_dict(orient='records')


# In[ ]:


result1 = result
result1


# In[ ]:


with open("view6.json", "w") as outfile:
    json.dump(result1, outfile)

