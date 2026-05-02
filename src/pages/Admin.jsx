import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { saveAdminQuiz } from '../utils/storage';
import { ArrowLeft, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react';

const createQuestion = () => ({
  subject: 'Maths',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
});

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mixed');
  const [duration, setDuration] = useState(10);
  const [questionCount, setQuestionCount] = useState(5);
  const [questionSets, setQuestionSets] = useState(Array.from({ length: 5 }, createQuestion));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const updateQuestionCount = (count) => {
    const safeCount = Math.min(10, Math.max(5, Number(count)));
    setQuestionCount(safeCount);
    setQuestionSets((prev) => {
      if (safeCount > prev.length) {
        return [...prev, ...Array.from({ length: safeCount - prev.length }, createQuestion)];
      }
      return prev.slice(0, safeCount);
    });
  };

  const updateQuestion = (index, field, value) => {
    setQuestionSets((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestionSets((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== questionIndex) return item;
        const options = [...item.options];
        options[optionIndex] = value;
        return { ...item, options };
      })
    );
  };

  const validateQuiz = () => {
    if (title.trim().length < 4) return 'Quiz title must be at least 4 characters.';
    if (!Number.isFinite(Number(duration)) || Number(duration) < 5 || Number(duration) > 180) {
      return 'Duration must be between 5 and 180 minutes.';
    }

    const invalidIndex = questionSets.findIndex((item) => {
      const hasQuestion = item.question.trim().length >= 8;
      const hasOptions = item.options.every((option) => option.trim().length > 0);
      return !hasQuestion || !hasOptions;
    });

    if (invalidIndex >= 0) {
      return `Complete question ${invalidIndex + 1} and all four options.`;
    }

    return '';
  };

  const handleSave = (event) => {
    event.preventDefault();
    setMessage('');

    const validationError = validateQuiz();
    if (validationError) {
      setError(validationError);
      return;
    }

    const createdAt = new Date().toISOString();
    const testId = `admin-test-${Date.now()}`;
    const adminQuestions = questionSets.map((item, index) => ({
      id: `${testId}-q-${index + 1}`,
      subject: item.subject,
      question: item.question.trim(),
      options: item.options.map((option) => option.trim()),
      correctAnswer: Number(item.correctAnswer),
    }));

    saveAdminQuiz({
      test: {
        id: testId,
        title: title.trim(),
        subject,
        duration: Number(duration),
        questionIds: adminQuestions.map((question) => question.id),
        createdByAdmin: true,
        createdAt,
      },
      questions: adminQuestions,
    });

    setError('');
    setMessage('Quiz created successfully. It is now available on the dashboard.');
    setTitle('');
    setSubject('Mixed');
    setDuration(10);
    updateQuestionCount(5);
    setQuestionSets(Array.from({ length: 5 }, createQuestion));
  };

  return (
    <div className="flex-1 bg-slate-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">Create Mock Quiz</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Create a quiz with 5 to 10 question sets. It appears instantly on the dashboard.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_180px]">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Quiz title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="NIMCET Custom Mock 1"
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Subject</label>
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option>Mixed</option>
                  <option>Maths</option>
                  <option>CS</option>
                  <option>LR</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Duration</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Question sets</label>
                <select
                  value={questionCount}
                  onChange={(event) => updateQuestionCount(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {[5, 6, 7, 8, 9, 10].map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-200">{error}</div>}
          {message && <div className="flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200"><CheckCircle2 className="mr-2 h-5 w-5" />{message}</div>}

          <section className="space-y-4">
            {questionSets.map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">Question Set {index + 1}</h2>
                  <select
                    value={item.subject}
                    onChange={(event) => updateQuestion(index, 'subject', event.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option>Maths</option>
                    <option>CS</option>
                    <option>LR</option>
                    <option>English</option>
                  </select>
                </div>
                <textarea
                  value={item.question}
                  onChange={(event) => updateQuestion(index, 'question', event.target.value)}
                  placeholder="Enter the question"
                  rows={3}
                  className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-3 rounded-md border border-gray-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={Number(item.correctAnswer) === optionIndex}
                        onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-black text-gray-600 dark:text-gray-300">{String.fromCharCode(65 + optionIndex)}</span>
                      <input
                        value={option}
                        onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                        className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400 dark:text-white"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-800/95 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {questionCount} question sets will be saved to the dashboard.
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateQuestionCount(Math.min(10, questionCount + 1))}
                disabled={questionCount >= 10}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Set
              </button>
              <button
                type="button"
                onClick={() => updateQuestionCount(Math.max(5, questionCount - 1))}
                disabled={questionCount <= 5}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Set
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Create Quiz
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Admin;
