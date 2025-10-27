import React from "react";

const Landing = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">

          

          {/* ===== Main Content ===== */}
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#111714] dark:text-gray-100 tracking-tight">
                  How to Build Your Own Restaurant Website with QuickPlate
                </h1>
                <p className="mt-4 text-lg text-[#648772] dark:text-gray-400">
                  Follow these simple steps to get your restaurant website up
                  and running in minutes. It's free, open-source, and fully
                  customizable.
                </p>
              </header>

              {/* === Sections === */}
              <section className="space-y-12">
                {/* Step 1 */}
                <article>
                  <h2 className="text-3xl font-bold text-[#111714] dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                    <span className="text-primary mr-3">1.</span> Fork the
                    Repository
                  </h2>
                  <p className="mb-4 text-[#111714] dark:text-gray-300">
                    The first step is to create your own copy of the QuickPlate
                    repository on GitHub. This allows you to make your own
                    changes and deploy your site.
                  </p>
                  <button className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-[#111714] text-sm font-bold hover:scale-105 transition-transform gap-2">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.482
                        0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
                        1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
                        0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65
                        0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115
                        2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203
                        2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0
                        3.848-2.338 4.695-4.566 4.942.359.308.678.92.678
                        1.855 0 1.338-.012 2.419-.012 2.747 0
                        .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                    <span>Fork QuickPlate on GitHub</span>
                  </button>

                  <p className="mt-6 text-[#111714] dark:text-gray-300">
                    Once forked, clone the repository to your local machine to
                    start development:
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      git clone https://github.com/YOUR_USERNAME/quickplate.git
                      <br />
                      cd quickplate
                      <br />
                      npm install
                    </code>
                  </pre>
                </article>

                {/* Step 2 */}
                <article>
                  <h2 className="text-3xl font-bold text-[#111714] dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                    <span className="text-primary mr-3">2.</span> Connect
                    Firebase
                  </h2>
                  <p className="mb-4 text-[#111714] dark:text-gray-300">
                    QuickPlate uses Firebase for backend services like database
                    and authentication. Create a new Firebase project and get
                    your configuration keys.
                  </p>
                  <p className="mb-4 text-[#111714] dark:text-gray-300">
                    Create a{" "}
                    <code className="bg-primary/20 text-primary rounded px-1 py-0.5 text-sm">
                      .env.local
                    </code>{" "}
                    file in the root of your project and add your Firebase
                    configuration:
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      REACT_APP_FIREBASE_API_KEY="your-api-key"
                      <br />
                      REACT_APP_FIREBASE_AUTH_DOMAIN="your-auth-domain"
                      <br />
                      REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
                      <br />
                      REACT_APP_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
                      <br />
                      REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
                      <br />
                      REACT_APP_FIREBASE_APP_ID="your-app-id"
                    </code>
                  </pre>
                </article>

                {/* Step 3 */}
                <article>
                  <h2 className="text-3xl font-bold text-[#111714] dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                    <span className="text-primary mr-3">3.</span> Deploy on
                    Netlify
                  </h2>
                  <p className="mb-4 text-[#111714] dark:text-gray-300">
                    Deploying your site is simple with Netlify. Connect your
                    GitHub repository, configure your build settings, and go
                    live.
                  </p>
                  <p className="mb-4 text-[#111714] dark:text-gray-300">
                    Use the following build command and publish directory:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-[#111714] dark:text-gray-300">
                    <li>
                      <strong>Build command:</strong>{" "}
                      <code className="bg-primary/20 text-primary rounded px-1 py-0.5 text-sm">
                        npm run build
                      </code>
                    </li>
                    <li>
                      <strong>Publish directory:</strong>{" "}
                      <code className="bg-primary/20 text-primary rounded px-1 py-0.5 text-sm">
                        build
                      </code>
                    </li>
                  </ul>
                  
                </article>
              </section>

              {/* Contribute Section */}
              <section className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-12">
                <h2 className="text-3xl font-bold text-[#111714] dark:text-gray-100">
                  Have a suggestion or want to contribute?
                </h2>
                <p className="mt-4 text-lg text-[#648772] dark:text-gray-400 max-w-2xl mx-auto">
                  QuickPlate is an open-source project. We welcome contributions
                  of all kinds, from bug fixes to new features.
                </p>
                <div className="mt-6">
                  <button className="flex items-center justify-center mx-auto rounded-lg h-12 px-5 border border-[#111714] dark:border-gray-300 text-[#111714] dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all gap-2">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 
                        4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.482 
                        0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343
                        -.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
                        1.003.07 1.531 1.032 1.531 1.032.892 
                        1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338
                        -2.22-.253-4.555-1.113-4.555-4.951 
                        0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65
                        0 0 .84-.27 2.75 1.026A9.564 9.564 0 
                        0112 6.844c.85.004 1.705.115 2.504.337 
                        1.909-1.296 2.747-1.027 2.747-1.027.546 
                        1.379.203 2.398.1 2.651.64.7 1.03 
                        1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 
                        4.942.359.308.678.92.678 
                        1.855 0 1.338-.012 2.419-.012 2.747 
                        0 .268.18.58.688.482A10.001 
                        10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                    <span>Contribute on GitHub</span>
                  </button>
                </div>
              </section>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Landing;
