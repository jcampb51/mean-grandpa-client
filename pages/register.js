import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Input } from "../components/form-elements";
import { register } from "../data/auth";
import { useUserQuery } from "../context/userQueries";

export default function Register() {
  const { setUserToken } = useUserQuery();
  const router = useRouter();
  const firstName = useRef("");
  const lastName = useRef("");
  const username = useRef("");
  const email = useRef("");
  const address = useRef("");
  const phoneNumber = useRef("");
  const password = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const user = {
      username: username.current.value,
      password: password.current.value,
      first_name: firstName.current.value,
      last_name: lastName.current.value,
      email: email.current.value,
      address: address.current.value,
      phone_number: phoneNumber.current.value,
    };

    try {
      const data = await register(user);
      if (data.token) {
        setUserToken(data.token);
        router.push("/");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <form className="box" onSubmit={submit}>
          <h1 className="title">Welcome!</h1>
          <Input id="firstName" refEl={firstName} type="text" label="First Name" />
          <Input id="lastName" refEl={lastName} type="text" label="Last Name" />
          <Input id="username" refEl={username} type="text" label="Username" />
          <Input id="email" refEl={email} type="email" label="Email" />
          <Input id="address" refEl={address} type="text" label="Address" />
          <Input id="phone_number" refEl={phoneNumber} type="tel" label="Phone Number" />
          <Input id="password" refEl={password} type="password" label="Password" />
          {error && <p className="help is-danger">{error}</p>}
          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className={`button is-link ${isLoading ? "is-loading" : ""}`}
                disabled={isLoading}
              >
                Submit
              </button>
            </div>
            <div className="control">
              <Link href="/login">
                <button type="button" className="button is-link is-light">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
