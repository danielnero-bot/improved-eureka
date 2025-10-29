import React from "react";
import { FaEnvelope, FaGithub } from "react-icons/fa6";
const Contact = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200 min-h-screen flex flex-col">
      {/* Main */}
      <main className="grow">
        <div className="py-16 sm:py-24 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111714] dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-[#648772] dark:text-gray-400">
            Have a question, want to contribute to the project, or just looking
            to collaborate? We'd love to hear from you.
          </p>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
            <div className="md:col-span-2">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-[#111714] dark:text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="John Doe"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#111714] dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[#111714] dark:text-gray-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Question about features"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#111714] dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Your message here..."
                    className="form-input resize-none"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full sm:w-auto min-w-[84px] items-center justify-center rounded-lg h-12 px-8 bg-primary text-[#111714] text-base font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105"
                  >
                    Submit Message
                  </button>
                </div>
              </form>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <span className=" text-primary text-3xl mt-1">
                  <FaEnvelope />
                </span>
                <div>
                  <h3 className="font-bold text-[#111714] dark:text-gray-100">
                    Email Us
                  </h3>
                  <p className="text-[#648772] dark:text-gray-400">
                    For general inquiries and support.
                  </p>
                  <a
                    href="mailto:nero80311@gmail.com"
                    className="text-primary hover:underline"
                  >
                    nero80311@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-primary">
                  <FaGithub className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111714] dark:text-gray-100">
                    GitHub
                  </h3>
                  <p className="text-[#648772] dark:text-gray-400">
                    Contribute, report issues, or fork the project.
                  </p>
                  <a
                    href="https://github.com/danielnero-bot/improved-eureka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/improved
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
