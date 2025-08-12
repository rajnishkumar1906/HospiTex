import React from 'react';

const Contacts = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-800 text-center mb-12">
          Get in Touch with Us
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-700">Contact Information</h3>
            <p className="text-gray-700">
              We're here to help you 24/7. Reach out to us via the form or the details below.
            </p>
            <ul className="text-gray-800 space-y-3">
              <li>
                <strong>Phone:</strong> <a href="tel:+18001234567" className="text-blue-600 hover:underline">+1 800 123 4567</a>
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:support@hospitex.com" className="text-blue-600 hover:underline">support@hospitex.com</a>
              </li>
              <li>
                <strong>Address:</strong> 123 HealthCare Street, MediCity, Country
              </li>
              <li>
                <strong>Support Hours:</strong> 24/7 Emergency Support
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows="4"
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
