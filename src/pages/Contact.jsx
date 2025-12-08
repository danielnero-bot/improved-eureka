import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdLocationOn, MdPhone } from "react-icons/md";

const Contact = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-white min-h-screen flex flex-col transition-colors duration-300">
      {/* Main */}
      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-light dark:text-white">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary-light dark:text-gray-400">
              Have a question, want to contribute to the project, or just
              looking to collaborate? We'd love to hear from you.
            </p>
          </header>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-8 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-text-light dark:text-white mb-6">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="full-name"
                        className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        id="full-name"
                        name="full-name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Question about features"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Your message here..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-base font-bold rounded-lg transition-all hover:bg-primary/90 hover:scale-105 shadow-md"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information - Takes 1 column on large screens */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm transition-colors duration-300">
                <h2 className="text-xl font-bold text-text-light dark:text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-white mb-1">
                        Email
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-gray-400 mb-1">
                        For general inquiries
                      </p>
                      <a
                        href="mailto:nero80311@gmail.com"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        nero80311@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FaGithub className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-white mb-1">
                        GitHub
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-gray-400 mb-1">
                        Contribute or report issues
                      </p>
                      <a
                        href="https://github.com/danielnero-bot/improved-eureka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Repository
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm transition-colors duration-300">
                <h2 className="text-xl font-bold text-text-light dark:text-white mb-6">
                  Connect With Us
                </h2>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/danielnero-bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                    title="GitHub"
                  >
                    <FaGithub className="text-primary text-xl" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/daniel-oghenero-b23937388?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="text-primary text-xl" />
                  </a>
                  <a
                    href="https://x.com/danielnero80311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                    title="Twitter"
                  >
                    <FaXTwitter className="text-primary text-xl" />
                  </a>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 transition-colors duration-300">
                <h3 className="font-bold text-text-light dark:text-white mb-2">
                  💡 Quick Tip
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-gray-400">
                  For urgent issues or bugs, please open an issue on our GitHub
                  repository for faster response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
