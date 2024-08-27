import { useState } from "react";

function InteractionsModal({ closeModal }) {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[500px] h-[350px]">
                <h2 className="text-lg font-bold mb-4">Interactions</h2>
                <ul className="list-disc ml-6 mb-6">
                    <li>Hover over the bar graphs for information at a glance.</li>
                    <li>Click a bar to filter data according to the selection.</li>
                    <li>Hover over the network graph to know about that particular person.</li>
                    <li>Click and scroll in/out to zoom in/out of the Maps.</li>
                    <li>Toggle between the Graph Views at the top.</li>
                </ul>
                <div className="flex justify-center">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-full w-50 mt-4 hover:bg-blue-600" onClick={closeModal}>
                        Got It!
                    </button>
                </div>
            </div>
        </div>
    );
}


export default InteractionsModal;
