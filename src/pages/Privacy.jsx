import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Privacy = () => {
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
            Privacy Policy
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
                At QuickPlate, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform. Please read this
                policy carefully.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-text-light dark:text-white mb-3 mt-6">
                2.1 Personal Information
              </h3>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Name and contact information (email, phone number)</li>
                <li>Delivery addresses</li>
                <li>
                  Payment information (processed securely through third-party
                  providers)
                </li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-light dark:text-white mb-3 mt-6">
                2.2 Automatically Collected Information
              </h3>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Location data (with your permission)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-light dark:text-white mb-3 mt-6">
                2.3 Restaurant Information
              </h3>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                For restaurant owners, we collect business information including
                restaurant name, menu details, pricing, photos, and business
                contact information.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Improve and personalize your experience</li>
                <li>Provide customer support</li>
                <li>
                  Send you updates, promotions, and marketing materials (with
                  your consent)
                </li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and improve our services</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>
                  <strong>Restaurants:</strong> To fulfill your orders
                </li>
                <li>
                  <strong>Service Providers:</strong> Third parties who help us
                  operate our platform (payment processors, hosting providers,
                  analytics services)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Note:</strong> We never sell your personal information
                  to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                5. Data Security
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information. However, no method of
                transmission over the internet or electronic storage is 100%
                secure. While we strive to protect your data, we cannot
                guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>
                  <strong>Access:</strong> Request a copy of your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a
                  portable format
                </li>
                <li>
                  <strong>Object:</strong> Object to certain processing of your
                  data
                </li>
              </ul>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mt-4">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:nero80311@gmail.com"
                  className="text-primary hover:underline"
                >
                  nero80311@gmail.com
                </a>
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mb-3">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-text-secondary-light dark:text-gray-300 leading-relaxed space-y-2 list-disc pl-6">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed mt-4">
                You can control cookies through your browser settings. Note that
                disabling cookies may affect platform functionality.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                Our platform uses third-party services including Supabase for
                authentication and database services, and Google for OAuth
                authentication. These services have their own privacy policies,
                and we encourage you to review them.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                QuickPlate is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children.
                If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                10. Data Retention
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and enforce our agreements. When you delete your
                account, we will delete or anonymize your personal information
                within a reasonable timeframe.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes by email or through a notice
                on our platform. Your continued use of QuickPlate after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
                12. Contact Us
              </h2>
              <p className="text-text-secondary-light dark:text-gray-300 leading-relaxed">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us at:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 mt-4">
                <p className="text-text-light dark:text-white font-semibold mb-2">
                  QuickPlate
                </p>
                <p className="text-text-secondary-light dark:text-gray-300">
                  Email:{" "}
                  <a
                    href="mailto:nero80311@gmail.com"
                    className="text-primary hover:underline"
                  >
                    nero80311@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-text-secondary-light dark:text-gray-400">
            <Link to="/terms" className="text-primary hover:underline">
              Terms and Conditions
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

export default Privacy;
