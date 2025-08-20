import React from "react";

const DiagnosticReportsServices = () => {
  const reports = [
    {
      title: "Upload Reports",
      description: "Add new diagnostic or lab reports for patients easily.",
      icon: "📤",
      link: "/diagnostic-dashboard/reports/upload",
    },
    {
      title: "Manage Reports",
      description: "Edit or update existing diagnostic reports efficiently.",
      icon: "📝",
      link: "/diagnostic-dashboard/reports/manage",
    },
    {
      title: "View Patient Reports",
      description: "Browse and search all patient reports quickly.",
      icon: "📑",
      link: "/diagnostic-dashboard/reports/view",
    },
    {
      title: "Download Reports",
      description: "Export reports as PDF for patient or doctor use.",
      icon: "⬇️",
      link: "/diagnostic-dashboard/reports/download",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6">
          Diagnostic Reports Services
        </h1>
        <p className="text-gray-700 mb-12">
          Manage all patient reports with ease. Upload, view, or download reports and keep your diagnostic workflow smooth and efficient.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl border border-indigo-100 transition transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100"
            >
              <div className="text-5xl mb-4 animate-bounce">{report.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {report.title}
              </h3>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <a
                href={report.link}
                className="inline-block mt-2 text-sm text-indigo-600 font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Ensure every patient has access to their diagnostic reports seamlessly. Monitor, update, and provide downloadable reports with confidence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticReportsServices;
