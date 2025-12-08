import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGithub } from "react-icons/fa";

const License = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 inline-flex items-center gap-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-text-light dark:text-white mb-4">
            MIT License
          </h1>
          <p className="text-text-secondary-light dark:text-gray-400 text-lg">
            QuickPlate is free and open source software
          </p>
        </div>

        {/* License Content */}
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8 sm:p-12 shadow-lg transition-colors duration-300">
          {/* Copyright */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <p className="text-text-light dark:text-white font-semibold text-lg">
              Copyright © 2025 Daniel Oghenero
            </p>
            <p className="text-text-secondary-light dark:text-gray-400 mt-2">
              All rights reserved under the MIT License
            </p>
          </div>

          {/* License Text */}
          <div className="space-y-6 text-text-secondary-light dark:text-gray-300 leading-relaxed">
            <p>
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the "Software"), to deal in the Software without
              restriction, including without limitation the rights to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies
              of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p className="pl-4 border-l-4 border-primary/30 bg-primary/5 dark:bg-primary/10 py-3 rounded">
              The above copyright notice and this permission notice shall be
              included in all copies or substantial portions of the Software.
            </p>

            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 mt-6">
              <p className="font-mono text-sm leading-relaxed">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </div>
          </div>

          {/* What This Means */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-text-light dark:text-white mb-6">
              What This Means
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                  ✓ You Can
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Use commercially</li>
                  <li>• Modify the code</li>
                  <li>• Distribute copies</li>
                  <li>• Use privately</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  ⓘ You Must
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Include the license</li>
                  <li>• Include copyright notice</li>
                  <li>• State changes made</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GitHub Link */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-text-secondary-light dark:text-gray-400 mb-4">
              View the full source code and contribute on GitHub
            </p>
            <a
              href="https://github.com/danielnero-bot/improved-eureka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FaGithub className="text-xl" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary-light dark:text-gray-400">
            This license applies to QuickPlate and all its components.
            <br />
            For questions, contact{" "}
            <a
              href="mailto:nero80311@gmail.com"
              className="text-primary hover:underline"
            >
              nero80311@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default License;
