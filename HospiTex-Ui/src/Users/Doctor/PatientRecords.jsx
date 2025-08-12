import React from 'react';

function PatientRecords() {
  // Example data — you can replace with actual patient records
  const records = [
    { id: 1, name: 'John Doe', age: 34, condition: 'Hypertension', lastVisit: '2025-07-20' },
    { id: 2, name: 'Jane Smith', age: 28, condition: 'Diabetes', lastVisit: '2025-08-01' },
    { id: 3, name: 'Alex Johnson', age: 45, condition: 'Asthma', lastVisit: '2025-07-15' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-green-800 border-b pb-3">
        Patient Records
      </h1>

      {records.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No patient records available.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Condition</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {records.map(({ id, name, age, condition, lastVisit }) => (
              <tr
                key={id}
                className="even:bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
              >
                <td className="border border-gray-300 px-4 py-3">{name}</td>
                <td className="border border-gray-300 px-4 py-3">{age}</td>
                <td className="border border-gray-300 px-4 py-3">{condition}</td>
                <td className="border border-gray-300 px-4 py-3">{lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientRecords;
