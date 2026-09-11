import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Online Mock Test Platform</h1>

        <p className="muted">
          WBP, Upper Primary, Police and other competitive examinations.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn" href="/login">
            Student Login
          </Link>

          <Link className="btn secondary" href="/register">
            Student Registration
          </Link>

          <Link className="btn secondary" href="/admin">
            Admin
          </Link>
        </div>
      </section>

      <h2>How it works</h2>

      <div className="grid">
        <div className="card">
          <h3>MCQ Tests</h3>
          <p>Timed multiple-choice examinations.</p>
        </div>

        <div className="card">
          <h3>150 Minute Exam</h3>
          <p>Default duration is 2 hours 30 minutes.</p>
        </div>

        <div className="card">
          <h3>Instant Result</h3>
          <p>Score, correct, wrong and unanswered answers.</p>
        </div>
      </div>
    </main>
  );
}
