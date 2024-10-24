import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
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

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.token) {
        setUserToken(data.token);
        router.push("/");
      }
    },
  });

  const submit = (e) => {
    e.preventDefault();

    const user = {
      username: username.current.value,
      password: password.current.value,
      first_name: firstName.current.value,
      last_name: lastName.current.value,
      email: email.current.value,
      address: address.current.value,
      phone_number: phoneNumber.current.value,
    };

    registerMutation.mutate(user);
  };

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <form className="box" onSubmit={submit}>
          <h1 className="title">Welcome!</h1>
          <Input
            id="firstName"
            refEl={firstName}
            type="text"
            label="First Name"
          />
          <Input id="lastName" refEl={lastName} type="text" label="Last Name" />
          <Input id="username" refEl={username} type="text" label="Username" />
          <Input id="email" refEl={email} type="email" label="Email" />
          <Input id="address" refEl={address} type="text" label="Address" />
          <Input
            id="phone_number"
            refEl={phoneNumber}
            type="tel"
            label="Phone Number"
          />
          <Input
            id="password"
            refEl={password}
            type="password"
            label="Password"
          />

          {registerMutation.isError && (
            <p className="help is-danger">
              Registration failed. Please try again.
            </p>
          )}

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className={`button is-link ${
                  registerMutation.isPending ? "is-loading" : ""
                }`}
                disabled={registerMutation.isPending}
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