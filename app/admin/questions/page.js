'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function QuestionsPage() {
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [marks, setMarks] = useState('1');
  const [negativeMarks, setNegativeMarks] = useState('0');
  const [message, setMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const { data, error } = await supabase
      .from('tests')
      .select('id, title')
      .order('created_at', { ascending: false });

    if (!error) {
      setTests(data || []);
    }
  }

  async function addQuestion(e) {
    e.preventDefault();
    setMessage('');

    if (!testId) {
      setMessage('Please select a test.');
      return;
    }

    const { error } = await supabase.from('questions').insert({
      test_id: testId,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: correctAnswer,
      marks: Number(marks),
      negative_marks: Number(negativeMarks),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Question added successfully!');

    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setMarks('1');
    setNegativeMarks('0');
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Add MCQ Question</h1>

        <form onSubmit={addQuestion}>
          <label>Select Test</label>

          <select
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            required
          >
            <option value="">-- Select a test --</option>

            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>

          <label>Question</label>

          <textarea
            rows="5"
            placeholder="Enter question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />

          <label>Option A</label>
          <input
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />

          <label>Option B</label>
          <input
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />

          <label>Option C</label>
          <input
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />

          <label>Option D</label>
          <input
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />

          <label>Correct Answer</label>

          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>

          <label>Marks</label>

          <input
            type="number"
            step="0.25"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          <label>Negative Marks</label>

          <input
            type="number"
            step="0.25"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(e.target.value)}
          />

          <button className="btn" type="submit">
            Add Question
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20 }}>
            {message}
          </p>
        )}

        <button
          className="btn secondary"
          style={{ marginTop: 15 }}
          onClick={() => router.push('/admin')}
        >
          Back to Admin
        </button>
      </div>
    </main>
  );
}
