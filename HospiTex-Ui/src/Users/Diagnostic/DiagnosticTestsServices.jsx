import React from "react";

const DiagnosticTestsServices = () => {
  const tests = [
    {
      title: "Schedule Tests",
      description: "Book lab or imaging tests for patients easily.",
      icon: "📅",
      link: "/diagnostic-dashboard/tests/schedule",
    },
    {
      title: "Manage Test Results",
      description: "Upload, update, and manage patient test results.",
      icon: "🧪",
      link: "/diagnostic-dashboard/tests/manage",
    },
    {
      title: "Pending Tests",
      description: "Track all tests that are awaiting results.",
      icon: "⏳",
      link: "/diagnostic-dashboard/tests/pending",
    },
    {
      title: "Test Analytics",
      description: "View statistics and analytics of performed tests.",
      icon: "📊",
      link: "/diagnostic-dashboard/tests/analytics",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6">
          Diagnostic Tests Services
        </h1>
        <p className="text-gray-700 mb-12">
          Our diagnostic services help you efficiently schedule, track, and analyze tests. Explore each service below to streamline your workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tests.map((test, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl border border-indigo-100 transition transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100"
            >
              <div className="text-5xl mb-4 animate-bounce">{test.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {test.title}
              </h3>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <a
                href={test.link}
                className="inline-block mt-2 text-sm text-indigo-600 font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Whether you are scheduling new tests or analyzing results, our platform provides all the tools needed for efficient diagnostic management.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticTestsServices;
