import React, { useEffect, useState } from "react";
import { checkUsernameExists } from "../services/apiProfile";
import Spinner from "./Spinner";

export default function UserName({ setUsername }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState({ status: "initial", value: "" });
  const [isLoading, setIsLoading] = useState(false);
  async function handleCheck(e) {
    console.log(e);
    setIsLoading(true);
    e.preventDefault();
    const data = await checkUsernameExists({ input: value });
    if (data) {
      setUsername("");
      setResult({
        status: "error",
        value: "This username isn't available. Please try another.",
      });
    } else {
      setUsername(value);
      setResult({ status: "success", value: "Username available" });
    }
    console.log(data);
    setIsLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleCheck}>
        <div className="join m-3">
          <label className="input input-ghost join-item">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              disabled={isLoading}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.toLocaleLowerCase())}
              required
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn join-item w-[70px]"
          >
            {isLoading ? <Spinner /> : "Check"}
          </button>
        </div>
        <div
          className={`text-error p-2 ${result.status === "error" && !isLoading ? "" : "hidden"} flex items-center gap-1 text-center align-middle`}
        >
          <svg
            className="size-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="currentColor">
              <rect
                x="1.972"
                y="11"
                width="20.056"
                height="2"
                transform="translate(-4.971 12) rotate(-45)"
                fill="currentColor"
                strokeWidth={0}
              ></rect>
              <path
                d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z"
                strokeWidth={0}
                fill="currentColor"
              ></path>
            </g>
          </svg>
          <p>{result.value}</p>
        </div>
        <div
          className={`p-2 ${result.status === "success" && !isLoading ? "" : "hidden"} text-success flex items-center gap-1 text-center align-middle`}
        >
          <svg
            className="size-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeLinecap="square"
                strokeMiterlimit="10"
                strokeWidth="2"
              ></circle>
              <polyline
                points="7 13 10 16 17 8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="square"
                strokeMiterlimit="10"
                strokeWidth="2"
              ></polyline>
            </g>
          </svg>
          <p>{result.value}</p>
        </div>
      </form>
    </div>
  );
}
