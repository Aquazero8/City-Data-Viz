# VAST 2022 MC-1

***

## Datasets

Please download the dataset from the following drive link [VAST 2022](https://drive.google.com/drive/folders/1VklB0rR1MvzlQMRV6UxBeFHy6rkBszSf?usp=share_link). 

There are 3 folders `Attributes`, `Journals` and `pmoveData` along with 2 csvs `movement.csv` and `movement2.csv`. The movement csvs are precomputed csvs made from pruning ParticipantStatusLogs, the size has been reduced from 17 Gbs to ~450 mbs each. 

The `Attributes` folder consists of CSVs which have data for different attributes like apartments, buildings etc. We have also processed few CSVs which contain derived data from the original datasets. 

`Journals` include the CSVs which have logged the participant's finances, social networks, travel history and checkin data logged over 14 months every 5 minutes.

`pmoveData` consists of a zipped file which has every participants movement data logged and pruned for reduce size.

We have also included all the scripts (written in python), which were used to create derived datasets or prune to reduce size in the `scripts` directory in the code repository itself (not on drive).

Please see `Running the code section` to see where to place the downloaded files.
***

## Contribution to the repo

To contribute to the project, please follow these steps:
- Clone it to your local machine `git clone git@github.com/Aquazero8/City-Data-Viz`
- Create a new branch with the feature+contributor name `git checkout -b <feature_contributor>`
- Push the changes to the branch.
- Create a PR from github.

***

## Running the code
The techstack currently being used is React with d3.

After downloading the dataset files, place them accordingly in the mentioned directories for proper functioning:
- Unzip `pmoveData` and place all the files in the path -> `React/src/constants/pmoveData`.
- Place the CSVs inside `Attributes` in the path -> `React/src/Datasets/Attributes`.
- Place the CSVs inside `Journals` in the path -> `React/src/Datasets/Journals`.
- Place `movement.csv` and `movement2.csv` in the path -> `React/src/Datasets`.

Your directories should look like this:
```
.
├── README.md
├── React
│   ├── README.md
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Datasets
│   │   │   ├── Attributes
│   │   │   ├── Journals
│   │   │   ├── movement.csv
│   │   │   └── movement2.csv
│   │   ├── Interactions.js
│   │   ├── assets
│   │   ├── constants
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── scripts
│   │   ├── setupTests.js
│   └── tailwind.config.js
└── precompute.sh

```
After creating your branch:
```
cd React
npm i
npm start
```

The local server should spool up and be available at `localhost:3000`

***
## .gitignore

Please maintain the following files and directories on .gitignore (at root) to avoid issues while pushing and merging of code

```
React/node_modules/
React/src/Datasets/
.DS_Store
./precompute.sh
React/package-lock.json
.gitignore
.vscode/settings.json
React/package-lock.json
React/src/constants/pmoveData/*
```
