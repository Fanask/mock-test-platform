'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(150 * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTest();
  }, [id]);

  useEffect(() => {
    if (loading || !test || submitting) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, test, submitting]);

  async function loadTest() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push('/login');
      return;
    }

    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single();

    if (testError || !testData) {
      alert('Test not found.');
      router.push('/dashboard');
      return;
    }

    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', id)
      .order('created_at', { ascending: true });

    if (questionError) {
      alert(questionError.message);
      router.push('/dashboard');
      return;
    }

    setTest(testData);
    setQuestions(questionData || []);
    setTimeLeft((testData.duration_minutes || 150) * 60);
    setLoading(false);
  }

  function chooseAnswer(value) {
    setAnswers((old) => ({
      ...old,
      [questions[current].id]: value,
    }));
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  }

  async function submitTest() {
    if (submitting) return;

    const confirmed = window.confirm(
      'Are you sure you want to submit this test?'
    );

    if (!confirmed && timeLeft > 0) return;

    setSubmitting(true);

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((question) => {
      const selected = answers[question.id];

      if (!selected) {
        unanswered++;
        return;
      }

      if (selected === question.correct_answer) {
        correct++;
        score += Number(question.marks || 1);
      } else {
        wrong++;
        score -= Number(question.negative_marks || 0);
      }
    });

    const { data: userData } = await supabase.auth.getUser();

    const { data: attempt, error } = await supabase
      .from('attempts')
      .insert({
        test_id: id,
        user_id: userData.user.id,
        score,
        correct_answers: correct,
        wrong_answers: wrong,
        unanswered,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    router.push(`/result/${attempt.id}`);
  }

  if (loading) {
    return <main className="container">Loading test...</main>;
  }

  if (!questions.length) {
    return (
      <main className="container">
        <div className="card">
          <h1>{test?.title}</h1>
          <p>No questions have been added to this test yet.</p>
          <button className="btn" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const question = questions[current];
  const selectedAnswer = answers[question.id];

  return (
    <main className="container">
      <div
        className="card"
        style={{
          position: 'sticky',
          top: 10,
          zIndex: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 15,
            alignItems: 'center',
          }}
        >
          <strong>{test.title}</strong>

          <strong style={{ fontSize: 20 }}>
            {formatTime(timeLeft)}
          </strong>
        </div>
      </div>

      <div className="card">
        <p>
          <strong>
            Question {current + 1} of {questions.length}
          </strong>
        </p>

        <h2>{question.question_text}</h2>

        <div style={{ display: 'grid', gap: 12 }}>
          {[
            ['A', question.option_a],
            ['B', question.option_b],
            ['C', question.option_c],
            ['D', question.option_d],
          ].map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseAnswer(key)}
              style={{
                textAlign: 'left',
                padding: 16,
                borderRadius: 10,
                border:
                  selectedAnswer === key
                    ? '3px solid #2563eb'
                    : '1px solid #d1d5db',
                background:
                  selectedAnswer === key ? '#eff6ff' : 'white',
                cursor: 'pointer',
              }}
            >
              <strong>{key}.</strong> {value}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
            gap: 10,
          }}
        >
          <button
            className="btn secondary"
            disabled={current === 0}
            onClick={() => setCurrent((n) => n - 1)}
          >
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              className="btn"
              onClick={() => setCurrent((n) => n + 1)}
            >
              Next
            </button>
          ) : (
            <button className="btn" onClick={submitTest}>
              Submit Test
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Question Navigation</h3>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrent(index)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: answers[q.id] ? '#dcfce7' : 'white',
                cursor: 'pointer',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
