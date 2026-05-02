import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle, ArrowRight, ShieldCheck, UserRound } from "lucide-react";

const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 ._-]{1,22}[a-zA-Z0-9]$/;

const normalizeUsername = (value) => value.trim().replace(/\s+/g, " ");

const validateUsername = (value) => {
  const normalized = normalizeUsername(value);

  if (normalized.length < 3) {
    return "Use at least 3 characters.";
  }

  if (normalized.length > 24) {
    return "Keep your name under 24 characters.";
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return "Use letters, numbers, spaces, dots, hyphens, or underscores.";
  }

  return "";
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedUsername = normalizeUsername(username);
    const validationError = validateUsername(normalizedUsername);

    if (validationError) {
      setError(validationError);
      return;
    }

    login(normalizedUsername, remember);
    navigate("/");
  };

  const validationMessage = username ? validateUsername(username) : "";
  const isSubmitDisabled = Boolean(validationMessage);

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:flex flex-col justify-between bg-gray-950 text-white px-12 py-10">
          <div className="flex items-center gap-3">
            <img src="/cs-go.png" alt="CS-GO" width="44" height="44" className="rounded-lg" />
            <span className="text-lg font-bold">CS-GO</span>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              NIMCET Mock Test
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight">
              Practice with a private session that expires automatically.
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-300">
              Your name is used only to personalize progress inside this browser. No passwords are stored in this frontend-only app.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="border border-white/10 bg-white/5 rounded-lg p-4">
              <p className="font-semibold text-white">Validated</p>
              <p className="mt-1">Clean display names only.</p>
            </div>
            <div className="border border-white/10 bg-white/5 rounded-lg p-4">
              <p className="font-semibold text-white">Session</p>
              <p className="mt-1">8-hour automatic expiry.</p>
            </div>
            <div className="border border-white/10 bg-white/5 rounded-lg p-4">
              <p className="font-semibold text-white">Local</p>
              <p className="mt-1">No hidden network calls.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <img src="/cs-go.png" alt="CS-GO" width="42" height="42" className="rounded-lg" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">CS-GO</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">NIMCET Mock Test</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
                Secure sign in
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Start a browser session for your test progress. Use a display name you recognize.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Display name
                  </label>
                  <div className="relative mt-2">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      minLength={3}
                      maxLength={24}
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your name"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "login-error" : "login-help"}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 pl-10 pr-3 text-gray-900 dark:text-white shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:text-sm transition-colors"
                    />
                  </div>
                  <p id="login-help" className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    3-24 characters. Letters, numbers, spaces, dots, hyphens, and underscores are allowed.
                  </p>
                  {error && (
                    <p id="login-error" className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-3 rounded-md border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Keep me signed in on this device
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Leave off on shared computers.
                    </span>
                  </span>
                </label>

              <button
                type="submit"
                  disabled={isSubmitDisabled}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              >
                Start Practicing
                  <ArrowRight className="h-4 w-4" />
              </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
