import React from "react";
import { FileText, FlaskRound, Phone } from "lucide-react";

function DiagnosticHome({ scrollToSection }) {
  const services = [
    {
      title: "Reports",
      path: "/diagnostic-dashboard/reports",
      icon: <FileText className="w-8 h-8 text-indigo-700" />,
      description: "View, upload, and manage patient reports quickly."
    },
    {
      title: "Tests",
      path: "/diagnostic-dashboard/tests",
      icon: <FlaskRound className="w-8 h-8 text-indigo-700" />,
      description: "Check pending tests and schedule new ones efficiently."
    },
    {
      title: "Contacts",
      path: "/diagnostic-dashboard/contacts",
      icon: <Phone className="w-8 h-8 text-indigo-700" />,
      description: "Access patient or doctor contacts immediately."
    },
  ];

  return (
    <section className="min-h-screen w-full bg-gradient-to-tr from-indigo-100 via-indigo-50 to-indigo-200 px-6 py-16 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-indigo-900 leading-tight">
            Welcome Back, Diagnostic Team!
          </h1>
          <p className="text-lg text-gray-700">
            Stay on top of your daily reports, pending tests, and support requests.
          </p>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/Pictures/diagnostic-dashboard.png"
            alt="Diagnostic Dashboard"
            className="w-full max-w-lg rounded-xl shadow-xl border border-indigo-200"
          />
        </div>

      </div>

      <div className="mt-16 w-full text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-8">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <button
              key={service.title}
              onClick={() => scrollToSection(service.path)}
              className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition border hover:scale-105 flex flex-col items-center hover:bg-indigo-100"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700">{service.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
              <span className="mt-3 text-xs text-indigo-500 font-medium">Go & Manage</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiagnosticHome;
