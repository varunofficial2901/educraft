// lib/fetchQuizTest.ts — Backend se quiz test fetch karo

import { QuizTest, quizTests } from '@/app/quiz/data/mockTest';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Backend test ko QuizTest format mein convert karo
function convertBackendTest(backendTest: any): QuizTest {
  const testType = backendTest.type || "mcq";  // ← read type from backend, default mcq

  return {
    id: backendTest._id,
    title: backendTest.title,
    subtitle: `${backendTest.question_count || backendTest.questions?.length || 0} Questions | ${backendTest.duration} Minutes`,
    totalQuestions: backendTest.questions?.length || 0,
    totalMarks: backendTest.questions?.length || 0,
    durationMinutes: backendTest.duration || 40,
    bundle: backendTest.bundle_id || '',
    type: testType,  // ← pass type through to QuizTest
    questions: (backendTest.questions || []).map((q: any, idx: number) => ({
      id: idx + 1,
      text: q.text,
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'medium',
      options: Array.isArray(q.options)
        ? q.options.map((opt: string, i: number) => ({
            id: ['A', 'B', 'C', 'D'][i] || String(i),
            text: opt,
          }))
        : [],
      correctAnswer: ['A', 'B', 'C', 'D'][parseInt(q.correct)] || 'A',
    })),
  };
}

// Main fetch function — pehle mockTests check karo, phir backend
export async function fetchQuizTest(testId: string): Promise<QuizTest> {
  // Static mock tests (free assessments) — pehle check karo
  if (quizTests[testId]) {
    return quizTests[testId];
  }

  // Backend se fetch karo (paid bundle tests)
  try {
    const res = await fetch(`${API_URL}/api/public/tests/${testId}`);
    if (!res.ok) throw new Error('Test not found');
    const json = await res.json();
    return convertBackendTest(json.data);
  } catch (err) {
    console.error('Failed to fetch test:', err);
    // Fallback — empty test
    return {
      id: testId,
      title: 'Test',
      subtitle: '',
      totalQuestions: 0,
      totalMarks: 0,
      durationMinutes: 40,
      bundle: '',
      type: 'mcq',  // ← default to mcq on error
      questions: [],
    };
  }
}







// // lib/fetchQuizTest.ts — Backend se quiz test fetch karo
// // Yeh file frontend ke lib/ folder mein rakhni hai

// import { QuizTest, quizTests } from '@/app/quiz/data/mockTest';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// // Backend test ko QuizTest format mein convert karo
// function convertBackendTest(backendTest: any): QuizTest {
//   return {
//     id: backendTest._id,
//     title: backendTest.title,
//     subtitle: `${backendTest.question_count || backendTest.questions?.length || 0} Questions | ${backendTest.duration} Minutes`,
//     totalQuestions: backendTest.questions?.length || 0,
//     totalMarks: backendTest.questions?.length || 0,
//     durationMinutes: backendTest.duration || 40,
//     bundle: backendTest.bundle_id || '',
//     questions: (backendTest.questions || []).map((q: any, idx: number) => ({
//       id: idx + 1,
//       text: q.text,
//       topic: q.topic || 'General',
//       difficulty: q.difficulty || 'medium',
//       options: Array.isArray(q.options)
//         ? q.options.map((opt: string, i: number) => ({
//             id: ['A', 'B', 'C', 'D'][i] || String(i),
//             text: opt,
//           }))
//         : [],
//       correctAnswer: ['A', 'B', 'C', 'D'][parseInt(q.correct)] || 'A',
//     })),
//   };
// }

// // Main fetch function — pehle mockTests check karo, phir backend
// export async function fetchQuizTest(testId: string): Promise<QuizTest> {
//   // Static mock tests (free assessments) — pehle check karo
//   if (quizTests[testId]) {
//     return quizTests[testId];
//   }

//   // Backend se fetch karo (paid bundle tests)
//   try {
//     const res = await fetch(`${API_URL}/api/public/tests/${testId}`);
//     if (!res.ok) throw new Error('Test not found');
//     const json = await res.json();
//     return convertBackendTest(json.data);
//   } catch (err) {
//     console.error('Failed to fetch test:', err);
//     // Fallback — empty test
//     return {
//       id: testId,
//       title: 'Test',
//       subtitle: '',
//       totalQuestions: 0,
//       totalMarks: 0,
//       durationMinutes: 40,
//       bundle: '',
//       questions: [],
//     };
//   }
// }
