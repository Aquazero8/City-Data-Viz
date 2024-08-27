#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd


# In[ ]:


p = pd.read_csv("participants.csv")
p


# In[ ]:


conn = pd.read_csv("individual_connection_count.csv")
conn


# In[ ]:


conn = conn.set_index('participantId')
conn


# In[ ]:


import numpy as np
merged = p.merge(conn['N_UNIQUE'], how='left', left_on='participantId', right_index=True)
merged=merged.fillna(value={'N_UNIQUE':np.nan})
merged


# In[ ]:


merged['N_UNIQUE'] = merged['N_UNIQUE'].fillna(0)
merged


# In[ ]:


merged = merged.drop_duplicates()
merged


# In[ ]:


merged['N_UNIQUE']=merged['N_UNIQUE'].astype(int)
merged


# In[ ]:


merged.to_csv("participants.csv")

