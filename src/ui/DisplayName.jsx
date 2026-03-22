import { useState } from "react";
import { updateUserProfile } from "../services/apiProfile";
import Spinner from "./Spinner";

export default function DisplayName({ setDisplayName }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState({ status: "initial", value: "" });
  const [isLoading, setIsLoading] = useState(false);
  async function handleCheck(e) {
    console.log(e);
    setIsLoading(true);
    e.preventDefault();
    const updatedData = await updateUserProfile({ full_name: value });
    if (updatedData) {
      setDisplayName(value);
      setResult({
        status: "success",
        value: "Display name updated successfully",
      });
    } else {
      setResult({
        status: "error",
        value: "Error while updating the Display name",
      });
    }
    console.log(updatedData);
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
              onChange={(e) => setValue(e.target.value)}
              required
              placeholder="Display Name"
              minLength="3"
              maxLength="30"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn join-item w-[70px]"
          >
            {isLoading ? <Spinner /> : "Update"}
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
