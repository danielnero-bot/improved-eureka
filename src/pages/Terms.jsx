import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/getStarted"
        className="fixed top-6 left-6 z-10 inline-flex items-center gap-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-text-light dark:text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-text-secondary-light dark:text-gray-400 text-lg">
            Last updated: December 8, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8 sm:p-12 shadow-lg transition-colors duration-300">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                Welcome to QuickPlate. By accessing or using our platform, you
                agree to be bound by these Terms and Conditions. If you do not
                agree with any part of these terms, please do not use our
                service.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                2. Definitions
              </h2>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2">
                <li>
                  <strong>"Platform"</strong> refers to the QuickPlate website
                  and services
                </li>
                <li>
                  <strong>"User"</strong> refers to customers using the platform
                  to order food
                </li>
                <li>
                  <strong>"Restaurant"</strong> refers to food establishments
                  using our platform
                </li>
                <li>
                  <strong>"Service"</strong> refers to all features and
                  functionality provided by QuickPlate
                </li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                3. User Accounts
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                To use certain features of QuickPlate, you must create an
                account. You agree to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            {/* For Customers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                4. For Customers
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                As a customer, you agree to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Provide accurate delivery information</li>
                <li>Pay for orders placed through the platform</li>
                <li>
                  Treat restaurant staff and delivery personnel with respect
                </li>
                <li>Not misuse the platform for fraudulent activities</li>
              </ul>
            </section>

            {/* For Restaurants */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                5. For Restaurants
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                As a restaurant owner, you agree to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Provide accurate menu information and pricing</li>
                <li>Fulfill orders in a timely manner</li>
                <li>Maintain food safety and quality standards</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Keep your restaurant information up to date</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                6. Prohibited Activities
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                You may not:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Use the platform for illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                QuickPlate is open-source software licensed under the MIT
                License. While the source code is freely available, the
                QuickPlate name, logo, and branding are protected. You may use
                the software according to the MIT License terms, but commercial
                use of our branding requires permission.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                8. Disclaimer of Warranties
              </h2>
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
                <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY
                  KIND. WE DO NOT GUARANTEE UNINTERRUPTED ACCESS, ACCURACY OF
                  INFORMATION, OR FITNESS FOR A PARTICULAR PURPOSE. USE AT YOUR
                  OWN RISK.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                QuickPlate shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of the
                platform. Our total liability shall not exceed the amount you
                paid to use the service in the past 12 months.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of significant changes via email or platform
                notification. Continued use of the platform after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                11. Contact Information
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                If you have questions about these Terms and Conditions, please
                contact us at{" "}
                <a
                  href="mailto:nero80311@gmail.com"
                  className="text-primary hover:underline"
                >
                  nero80311@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-text-secondary-light dark:text-gray-400">
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            {" • "}
            <Link to="/license" className="text-primary hover:underline">
              MIT License
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
