import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { tests } from '../data/tests';
import { questions } from '../data/questions';
import { getAdminQuestions, getAdminTests } from '../utils/storage';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eraser,
  Flag,
  Grid3X3,
  ListFilter,
  Send,
} from 'lucide-react';

const getStatus = (questionId, answers, markedForReview, visitedQuestions) => {
  const isAnswered = Object.prototype.hasOwnProperty.call(answers, questionId);
  const isMarked = Boolean(markedForReview[questionId]);
  const isVisited = Boolean(visitedQuestions[questionId]);

  if (isAnswered && isMarked) return 'answeredReview';
  if (isMarked) return 'review';
  if (isAnswered) return 'answered';
  if (isVisited) return 'skipped';
  return 'notVisited';
};

const statusConfig = {
  answered: {
    label: 'Answered',
    palette: 'bg-emerald-500 text-white hover:bg-emerald-600',
    active: 'ring-2 ring-emerald-300 border-emerald-700',
    swatch: 'bg-emerald-500',
  },
  skipped: {
    label: 'Skipped',
    palette: 'bg-rose-500 text-white hover:bg-rose-600',
    active: 'ring-2 ring-rose-300 border-rose-700',
    swatch: 'bg-rose-500',
  },
  review: {
    label: 'Review',
    palette: 'bg-violet-500 text-white hover:bg-violet-600',
    active: 'ring-2 ring-violet-300 border-violet-700',
    swatch: 'bg-violet-500',
  },
  answeredReview: {
    label: 'Answered + Review',
    palette: 'bg-violet-600 text-white hover:bg-violet-700',
    active: 'ring-2 ring-violet-300 border-violet-900',
    swatch: 'bg-violet-600',
  },
  notVisited: {
    label: 'Not Visited',
    palette: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    active: 'ring-2 ring-blue-300 border-blue-600',
    swatch: 'bg-slate-100 dark:bg-gray-700 border border-slate-300 dark:border-gray-600',
  },
};

const Quiz = () => {
  const {
    activeTest,
    answers,
    markedForReview,
    visitedQuestions,
    currentQuestionIndex,
    answerQuestion,
    clearAnswer,
    toggleReview,
    visitQuestion,
    setCurrentQuestionIndex,
    submitQuiz,
  } = useContext(QuizContext);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState('all');

  useEffect(() => {
    if (!activeTest && !isSubmitting) {
      navigate('/');
    }
  }, [activeTest, isSubmitting, navigate]);

  const allTests = useMemo(() => [...getAdminTests(), ...tests], []);
  const allQuestions = useMemo(() => [...getAdminQuestions(), ...questions], []);
  const test = useMemo(() => allTests.find((item) => String(item.id) === String(activeTest)), [activeTest, allTests]);
  const testQuestions = useMemo(() => {
    if (!test) return [];
    return test.questionIds.map((id) => allQuestions.find((question) => String(question.id) === String(id))).filter(Boolean);
  }, [test, allQuestions]);

  const currentIndex = Math.min(currentQuestionIndex, Math.max(testQuestions.length - 1, 0));
  const currentQuestion = testQuestions[currentIndex];
  const currentQuestionId = currentQuestion?.id;

  useEffect(() => {
    if (currentQuestionId !== undefined) {
      visitQuestion(String(currentQuestionId));
    }
  }, [currentQuestionId, visitQuestion]);

  if (!test || testQuestions.length === 0) return null;

  const stats = testQuestions.reduce(
    (acc, question) => {
      const status = getStatus(String(question.id), answers, markedForReview, visitedQuestions);
      acc[status] += 1;
      return acc;
    },
    { answered: 0, skipped: 0, review: 0, answeredReview: 0, notVisited: 0 }
  );

  const attemptedCount = stats.answered + stats.answeredReview;
  const reviewCount = stats.review + stats.answeredReview;
  const completionPercent = Math.round((attemptedCount / testQuestions.length) * 100);
  const subjectList = [...new Set(testQuestions.map((question) => question.subject))];

  const visibleQuestions = testQuestions
    .map((question, index) => ({ question, index, status: getStatus(String(question.id), answers, markedForReview, visitedQuestions) }))
    .filter(({ status }) => paletteFilter === 'all' || status === paletteFilter || (paletteFilter === 'review' && status === 'answeredReview'));

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentQuestionIndex(currentIndex - 1);
    }
  };

  const markReviewAndNext = () => {
    toggleReview(String(currentQuestionId));
    goNext();
  };

  const clearCurrentAnswer = () => {
    clearAnswer(String(currentQuestionId));
  };

  const finishSubmission = () => {
    const result = submitQuiz();
    if (result) {
      navigate('/result', { state: { result }, replace: true });
      return;
    }
    navigate('/', { replace: true });
  };

  const handleConfirmSubmit = () => {
    setModalType(null);
    setIsSubmitting(true);
    setTimeout(() => {
      finishSubmission();
    }, 800);
  };

  const handleTimeEnd = () => {
    setModalType('timeup');
  };

  const handleTimeUpAcknowledge = () => {
    setModalType(null);
    setIsSubmitting(true);
    setTimeout(() => {
      finishSubmission();
    }, 800);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-gray-900 transition-colors flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4 top-0 sticky z-10 w-full transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">NIMCET Mock Test</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{test.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Attempted</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">{attemptedCount}/{testQuestions.length}</p>
            </div>
            <Timer onTimeEnd={handleTimeEnd} />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                  <span>Question {currentIndex + 1} of {testQuestions.length}</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    {currentQuestion.subject}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-700 dark:bg-gray-700 dark:text-gray-200">
                    {statusConfig[getStatus(String(currentQuestion.id), answers, markedForReview, visitedQuestions)].label}
                  </span>
                </div>
                <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-gray-700">
                  <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <SummaryPill label="Answered" value={attemptedCount} color="text-emerald-600 dark:text-emerald-300" />
                <SummaryPill label="Skipped" value={stats.skipped} color="text-rose-600 dark:text-rose-300" />
                <SummaryPill label="Review" value={reviewCount} color="text-violet-600 dark:text-violet-300" />
                <SummaryPill label="Unseen" value={stats.notVisited} color="text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onSelectOption={(optIndex) => answerQuestion(String(currentQuestion.id), optIndex)}
            isMarkedForReview={Boolean(markedForReview[currentQuestion.id])}
          />

          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={clearCurrentAnswer}
                disabled={answers[currentQuestion.id] === undefined}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear Answer
              </button>
              <button
                type="button"
                onClick={() => toggleReview(String(currentQuestion.id))}
                className="inline-flex items-center justify-center rounded-md border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-200"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {markedForReview[currentQuestion.id] ? 'Remove Review' : 'Mark Review'}
              </button>
              <button
                type="button"
                onClick={markReviewAndNext}
                className="inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              >
                <Flag className="mr-2 h-4 w-4" />
                Mark and Next
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex === testQuestions.length - 1}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                Save and Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setModalType('confirm')}
                className="inline-flex items-center rounded-md bg-emerald-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
              >
                Submit Test
                <Send className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Question Palette</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Jump, filter, and review before submit.</p>
              </div>
              <Grid3X3 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-md border border-gray-200 bg-slate-50 p-2 dark:border-gray-700 dark:bg-gray-900">
              <ListFilter className="h-4 w-4 text-gray-500" />
              <select
                value={paletteFilter}
                onChange={(event) => setPaletteFilter(event.target.value)}
                className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none dark:text-gray-200"
              >
                <option value="all">All questions</option>
                <option value="answered">Answered only</option>
                <option value="skipped">Skipped only</option>
                <option value="review">Review marked</option>
                <option value="notVisited">Not visited</option>
              </select>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {subjectList.map((subject) => (
                <span key={subject} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-gray-700 dark:text-gray-200">
                  {subject}
                </span>
              ))}
            </div>

            <div className="grid max-h-[420px] grid-cols-5 gap-2 overflow-y-auto pr-1">
              {visibleQuestions.map(({ question, index, status }) => {
                const isCurrent = currentIndex === index;
                const hasReviewDot = status === 'review' || status === 'answeredReview';

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => jumpToQuestion(index)}
                    title={`Question ${index + 1}: ${statusConfig[status].label}`}
                    className={`relative h-10 rounded-md border-2 text-sm font-black transition-all ${statusConfig[status].palette} ${
                      isCurrent ? statusConfig[status].active : 'border-transparent'
                    }`}
                  >
                    {index + 1}
                    {hasReviewDot && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-amber-400 dark:border-gray-800" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center justify-between gap-3">
                  <span className="flex items-center">
                    <span className={`mr-2 h-4 w-4 shrink-0 rounded-sm ${config.swatch}`} />
                    {config.label}
                  </span>
                  <span className="font-black text-gray-900 dark:text-white">
                    {status === 'answeredReview' ? stats.answeredReview : stats[status]}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalType('confirm')}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Final Submit
            </button>
          </div>
        </aside>
      </main>

      {modalType === 'confirm' && (
        <SubmitModal
          stats={stats}
          total={testQuestions.length}
          attemptedCount={attemptedCount}
          reviewCount={reviewCount}
          onCancel={() => setModalType(null)}
          onConfirm={handleConfirmSubmit}
        />
      )}

      {modalType === 'timeup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-2xl font-black text-red-600 dark:text-red-400">
              <AlertTriangle className="mr-3 h-7 w-7" />
              Time is up
            </h3>
            <p className="mb-8 text-gray-600 dark:text-gray-300">Your allocated time has expired. The test will be submitted with your saved answers.</p>
            <button onClick={handleTimeUpAcknowledge} className="w-full rounded-lg bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700">
              View Results
            </button>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 px-4 backdrop-blur-sm dark:bg-gray-900/95">
          <div className="relative mb-8">
            <div className="h-20 w-20 animate-spin rounded-full border-b-4 border-t-4 border-blue-600 opacity-75" />
            <div className="absolute left-0 top-0 h-20 w-20 animate-spin rounded-full border-l-4 border-r-4 border-emerald-500 opacity-75 [animation-direction:reverse] [animation-duration:1.5s]" />
          </div>
          <h2 className="mb-3 text-center text-3xl font-black text-gray-900 dark:text-white">Calculating your score</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">Preparing your answer key, status summary, and performance report.</p>
        </div>
      )}
    </div>
  );
};

const SummaryPill = ({ label, value, color }) => (
  <div className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-900">
    <p className="text-[10px] font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-lg font-black ${color}`}>{value}</p>
  </div>
);

const SubmitModal = ({ stats, total, attemptedCount, reviewCount, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl dark:bg-gray-800">
      <h3 className="mb-2 flex items-center text-2xl font-black text-gray-900 dark:text-white">
        <ClipboardCheck className="mr-3 h-7 w-7 text-emerald-600" />
        Confirm Submission
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Review your attempt status before final submission. You cannot change answers after this.</p>
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryPill label="Answered" value={attemptedCount} color="text-emerald-600 dark:text-emerald-300" />
        <SummaryPill label="Skipped" value={stats.skipped} color="text-rose-600 dark:text-rose-300" />
        <SummaryPill label="Review" value={reviewCount} color="text-violet-600 dark:text-violet-300" />
        <SummaryPill label="Unseen" value={stats.notVisited} color="text-slate-600 dark:text-slate-300" />
      </div>
      <div className="mb-7 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
        {stats.notVisited + stats.skipped > 0
          ? `${stats.notVisited + stats.skipped} of ${total} questions are unanswered. Submit only if you are done reviewing.`
          : 'All questions have been attempted. You can submit confidently.'}
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button onClick={onCancel} className="rounded-lg border border-gray-300 px-6 py-2.5 font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
          Continue Test
        </button>
        <button onClick={onConfirm} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 font-black text-white shadow-sm transition hover:bg-emerald-700">
          Yes, Submit
          <CheckCircle className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

export default Quiz;
