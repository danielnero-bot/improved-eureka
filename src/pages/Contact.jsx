import React from "react";

const Contact = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200 min-h-screen flex flex-col">
    

      {/* Main */}
      <main className="flex-grow">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
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
                    className="form-input"
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
                    className="form-input"
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
                <span className="material-symbols-outlined text-primary text-3xl mt-1">
                  mail
                </span>
                <div>
                  <h3 className="font-bold text-[#111714] dark:text-gray-100">
                    Email Us
                  </h3>
                  <p className="text-[#648772] dark:text-gray-400">
                    For general inquiries and support.
                  </p>
                  <a
                    href="mailto:contact@quickplate.dev"
                    className="text-primary hover:underline"
                  >
                    contact@quickplate.dev
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 
                      2.865 8.165 6.839 9.489.5.092.682-.218.682-.482
                      0-.237-.009-.868-.014-1.703-2.782.605-3.369
                      -1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11
                      -1.466-.908-.62.069-.608.069-.608 1.003.07 
                      1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 
                      2.91.832.092-.647.35-1.088.636-1.338-2.22-.253
                      -4.555-1.113-4.555-4.951 0-1.093.39-1.988 
                      1.031-2.688-.103-.253-.446-1.272.098-2.65 
                      0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 
                      6.844c.85.004 1.705.115 2.504.337 1.909-1.296 
                      2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 
                      2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 
                      4.695-4.566 4.942.359.308.678.92.678 1.855 
                      0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482
                      A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#111714] dark:text-gray-100">
                    GitHub
                  </h3>
                  <p className="text-[#648772] dark:text-gray-400">
                    Contribute, report issues, or fork the project.
                  </p>
                  <a
                    href="https://github.com/quickplate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/quickplate
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
