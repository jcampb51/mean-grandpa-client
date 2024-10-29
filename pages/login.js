import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Input } from "../components/form-elements";
import { login } from "../data/auth";
import { useUserQuery } from "../context/userQueries";

export default function Login() {
  const { setUserToken } = useUserQuery();
  const username = useRef("");
  const password = useRef("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const user = {
      username: username.current.value,
      password: password.current.value,
    };

    try {
      const data = await login(user);
      if (data.token) {
        // Store both token and is_staff status
        setUserToken(data.token, data.is_staff);
        router.push("/");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <form className="box" onSubmit={submit}>
          <h1 className="title">Welcome Back!</h1>
          <Input id="username" refEl={username} type="text" label="Username" />
          <Input id="password" refEl={password} type="password" label="Password" />
          {error && <p className="help is-danger">{error}</p>}
          <div className="field is-grouped">
            <div className="control">
              <button className={`button is-link ${isLoading ? "is-loading" : ""}`} type="submit" disabled={isLoading}>
                Login
              </button>
            </div>
            <div className="control">
              <Link href="/register">
                <button className="button is-link is-light" type="button">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
