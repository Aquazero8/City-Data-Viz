// Listen for messages from the main thread
import { csv } from 'd3'
import checkinJournalData from './Datasets/Journals/CheckinJournal.csv'
import financialJournalData from './Datasets/Journals/FinancialJournal.csv'
import socialNetworkData from './Datasets/Journals/SocialNetwork.csv'
import travelJournalData from './Datasets/Journals/TravelJournal.csv'
import movement2Data from './Datasets/movement2.csv'

self.onmessage = function (e) {
    // Get the data from the message
    const data = e.data;
    // console.log("got data")
    // Process the data
    const result = processData(data);

    // Send the result back to the main thread
    postMessage(result);
};
