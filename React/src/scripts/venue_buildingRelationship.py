import csv
import json

csvpath1 ="../Datasets/Attributes/Pubs.csv"
csvpath2 ="../Datasets/Attributes/Restaurants.csv"
csvpath3 ="../Datasets/Attributes/Employers.csv"

# data = {}
# with open(csvpath1) as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         pub_id = int(row['pubId'])
#         building_id = int(row['buildingId'])
#         data[pub_id] = building_id    

# with open(csvpath2) as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         restaurantId = int(row['restaurantId'])
#         building_id = int(row['buildingId'])
#         data[restaurantId] = building_id    

# with open(csvpath3) as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         employerId = int(row['employerId'])
#         building_id = int(row['buildingId'])
#         data[employerId] = building_id    

# print(data)

# Load the JSON data into a dictionary
# jsonFilePath = "../constants/venuId_businessId_map.json"
# csvpath4 ="../Datasets/Journals/CheckinJournal.csv"

# with open(jsonFilePath) as jsonfile:
#     json_data = json.load(jsonfile)

# # Create an empty dictionary to store the data
# data = {}
# i=0
# # Open the csv file and read it line by line
# with open(csvpath4) as csvfile:
#     for line in csvfile:
#         # Split the line into its columns
#         if i==0:
#             i+=1
#             continue
#         columns = line.strip().split(',')
#         participant_id = columns[0]
#         venue_id = str(columns[2])
#         # print(participant_id)
#         # print(venue_id)
#         try:
#             building_id = json_data[venue_id]
#         except KeyError:
#             # If the ID doesn't exist, skip this line
#             continue
        
#         # Check if the venue ID already exists in the dictionary
#         if venue_id in data:
#             # If it does, add the participant ID to the set
#             if participant_id not in data[venue_id]['participantsVisited']:
#                 data[venue_id]['participantsVisited'].append(participant_id)
#         else:
#             # If it doesn't, create a new entry in the dictionary with an empty set
#             data[venue_id] = {'buildingID': building_id, 'participantsVisited': [participant_id]}

# print(data)

data = {}
csvpath5 ="../Datasets/Journals/CheckinJournal.csv"
with open(csvpath5) as csvfile:
    # Skip the header line
    next(csvfile)
    
    for line in csvfile:
        # Split the line into its columns
        columns = line.strip().split(',')
        participant_id = columns[0]
        timestamp = columns[1]
        venue_id = columns[2]
        venue_type = columns[3]
        
        # Check if the participant ID exists in the dictionary
        if participant_id in data:
            # If it does, check if the venue type is already in the list
            if venue_id not in data[participant_id]:
                # If it's not, add it to the list
                data[participant_id].append(venue_id)
        else:
            # If it doesn't, create a new entry in the dictionary with a new list
            data[participant_id] = [venue_id]

print(data)
