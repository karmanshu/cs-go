import React, { useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { tests } from '../data/tests';
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft, Trophy, Zap, Clock, Target } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const { score, answers, testTitle, testId } = result;
  
  const attempted = score.attempted ?? score.correct + score.wrong;
  const accuracy = attempted > 0 ? ((score.correct / attempted) * 100).toFixed(1) : 0;
  const totalScore = score.totalScore ?? score.correct * 4 - score.wrong;
  const answerKey = useMemo(() => {
    const test = tests.find((item) => item.id === testId);
    const testQuestionIds = test?.questionIds ?? [];

    return testQuestionIds
      .map((id) => questions.find((question) => question.id === id))
      .filter(Boolean)
      .map((question, index) => {
        const hasAnswer = Object.prototype.hasOwnProperty.call(answers, question.id);
        const selectedAnswer = hasAnswer ? Number(answers[question.id]) : null;
        const correctAnswer = Number(question.correctAnswer);

        return {
          ...question,
          number: index + 1,
          selectedAnswer,
          correctAnswer,
          isAnswered: selectedAnswer !== null && Number.isInteger(selectedAnswer),
          isCorrect: selectedAnswer === correctAnswer
        };
      });
  }, [answers, testId]);

  return (
    <div className="flex-1 w-full bg-[#f8fafc] dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center text-sm font-semibold text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 mr-2 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back to Dashboard
          </button>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">Attempt Date</p>
            <p className="text-sm font-bold text-slate-700 dark:text-gray-300">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl shadow-blue-100 dark:shadow-none rounded-[2.5rem] overflow-hidden mb-10 border border-white dark:border-gray-700 relative transition-colors">
          <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 px-6 py-16 text-center text-white relative">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            </div>
            
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" />
            <h1 className="text-5xl font-black mb-3 tracking-tight">Quiz Results</h1>
            <div className="inline-block px-6 py-2 bg-white/15 backdrop-blur-xl rounded-full text-blue-50 text-sm font-bold mb-10 border border-white/20">
              {testTitle}
            </div>
            
            <div className="flex flex-col items-center">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={552.9}
                      strokeDashoffset={552.9 - (552.9 * parseFloat(accuracy)) / 100}
                      strokeLinecap="round"
                      className="text-white transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black leading-none">{accuracy}%</span>
                    <span className="text-xs uppercase font-black tracking-widest mt-1 opacity-70">Accuracy</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="p-8 sm:p-12 bg-white dark:bg-gray-800 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 border-b border-slate-50 dark:border-gray-700 pb-8 gap-4">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Performance Summary</h2>
                  <p className="text-slate-400 dark:text-gray-400 font-bold text-sm">Based on the latest NIMCET marking scheme</p>
               </div>
               <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-5 py-3 rounded-2xl border border-yellow-100 dark:border-yellow-900/50">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2 fill-yellow-500" />
                  <span className="text-sm font-black text-yellow-800 dark:text-yellow-500 uppercase tracking-tight">Rank Potential: Top 5%</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="group bg-blue-50/40 dark:bg-blue-900/10 rounded-3xl p-6 text-center border border-blue-100 dark:border-blue-900/30 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200 dark:shadow-none">
                   <Trophy className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-[0.15em] mb-1">Total Score</p>
                <p className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalScore}</p>
                <p className="text-[9px] text-blue-400 dark:text-blue-500 mt-2 font-bold uppercase">Target: 480+</p>
              </div>
              
              <div className="group bg-emerald-50/40 dark:bg-emerald-900/10 rounded-3xl p-6 text-center border border-emerald-100 dark:border-emerald-900/30 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-black uppercase tracking-[0.15em] mb-1">Correct</p>
                <p className="text-4xl font-black text-emerald-800 dark:text-emerald-200">{score.correct}</p>
                <p className="text-[9px] text-emerald-400 dark:text-emerald-500 mt-2 font-bold uppercase">{attempted > 0 ? ((score.correct / attempted) * 100).toFixed(0) : 0}% Hit Rate</p>
              </div>

              <div className="group bg-rose-50/40 dark:bg-rose-900/10 rounded-3xl p-6 text-center border border-rose-100 dark:border-rose-900/30 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-rose-200 dark:shadow-none">
                   <XCircle className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-rose-500 dark:text-rose-400 font-black uppercase tracking-[0.15em] mb-1">Incorrect</p>
                <p className="text-4xl font-black text-rose-800 dark:text-rose-200">{score.wrong}</p>
                <p className="text-[9px] text-rose-400 dark:text-rose-500 mt-2 font-bold uppercase">{score.wrong > 0 ? (score.wrong * -1) : 0} Negative</p>
              </div>

              <div className="group bg-slate-50/60 dark:bg-gray-700/30 rounded-3xl p-6 text-center border border-slate-200 dark:border-gray-600 transition-all hover:bg-slate-100 dark:hover:bg-gray-700/50 hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 bg-slate-600 dark:bg-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-slate-200 dark:shadow-none">
                   <MinusCircle className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.15em] mb-1">Skipped</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{score.unattempted}</p>
                <p className="text-[9px] text-slate-400 dark:text-gray-500 mt-2 font-bold uppercase">Out of {score.total}</p>
              </div>
            </div>

            <div className="mb-12 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-[2rem] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-700">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Answer Key</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Correct answers for {testTitle}</p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-gray-700">
                {answerKey.map((question) => (
                  <div key={question.id} className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400 mb-2">
                          Question {question.number} · {question.subject}
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">{question.question}</p>
                        <div className="mt-4 grid gap-2">
                          {question.options.map((option, index) => {
                            const isCorrectOption = index === question.correctAnswer;
                            const isSelectedOption = question.isAnswered && index === question.selectedAnswer;

                            return (
                              <div
                                key={option}
                                className={`flex items-start rounded-lg border px-4 py-3 text-sm ${
                                  isCorrectOption
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100'
                                    : isSelectedOption
                                      ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-100'
                                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
                                }`}
                              >
                                <span className="mr-3 font-black">{String.fromCharCode(65 + index)}.</span>
                                <span className="flex-1">{option}</span>
                                {isCorrectOption && <span className="ml-3 font-black text-emerald-600 dark:text-emerald-300">Correct</span>}
                                {!isCorrectOption && isSelectedOption && <span className="ml-3 font-black text-rose-600 dark:text-rose-300">Your answer</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase ${
                        question.isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : question.isAnswered
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {question.isCorrect ? 'Correct' : question.isAnswered ? 'Incorrect' : 'Skipped'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
              <div className="flex-1 space-y-8 w-full">
                 <div>
                    <h3 className="text-white text-xl font-black mb-6 flex items-center">
                       <Target className="w-6 h-6 mr-2 text-blue-400" />
                       Performance Analysis
                    </h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                             <span>Concept Clarity</span>
                             <span className="text-blue-400">{accuracy}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                             <span>Speed Factor</span>
                             <span className="text-emerald-400">82%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="md:w-1/3 text-center md:text-left">
                <p className="text-slate-400 text-sm font-bold mb-8 leading-relaxed uppercase tracking-tight">
                  "Your logic is strong, but focus on reducing negative marks in Mathematics."
                </p>
                <button 
                  onClick={() => navigate('/history')}
                  className="group w-full inline-flex items-center justify-center px-8 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-white hover:text-slate-900 shadow-xl shadow-blue-900/20 transition-all duration-300"
                >
                  DETAILED SOLUTIONS
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
