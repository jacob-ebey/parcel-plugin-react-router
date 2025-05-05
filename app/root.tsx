import { Link, Outlet } from "react-router";
import "./root.css";

export function Layout({ children }: { children: React.ReactNode }) {
  console.log("Layout");
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React Router Parcel</title>
      </head>
      <body>
        <header>
          <h1 className="root__header">React Router Parcel</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

export function ServerComponent() {
  console.log("Root");
  return (
    <>
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  return <h1>Oooops</h1>;
}
