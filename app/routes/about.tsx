import * as React from "react"

export default function About() {
  // verify this is client component
  const [count, setCount] = React.useState(0);

  return (
    <main>
      <h1>About</h1>
      <p>This is the about page.</p>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
    </main>
  );
}
