import React, { useEffect, useState } from "react";
import { loginGoogle } from "../services/apiAuth";
import { useNavigate } from "react-router";
import supabase from "../services/supabase";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import { getTMDBMovieLists } from "../services/apiTmdb";
import ThemeController from "../ui/ThemeController";
import LogoIcon from "../ui/LogoIcon";

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(function () {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.role === "authenticated") {
        navigate("/home", { replace: true });
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.role === "authenticated") {
        navigate("/home", { replace: true });
      }
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  function login() {
    setIsLoading(true);
    loginGoogle();
    setIsLoading(false);
  }
  if (isLoading) return <FullscreenSpinner />;
  return <LoginPage login={login}>{LoginWithGoogle}</LoginPage>;
}

function LoginPage({ children, login }) {
  const [movies, setMovies] = useState([]);
  const [curMovieIndex, setCurMovieIndex] = useState(0);
  const [userClick, setUserClick] = useState(false);

  function nextMovie() {
    setCurMovieIndex((i) => {
      if (i === movies.length - 1) return 0;
      return (i += 1);
    });
  }

  function handleUserClick() {
    nextMovie();
    setUserClick(true);
  }

  useEffect(() => {
    const userTimeOut = setTimeout(() => {
      setUserClick(false);
    }, 5000);
    return () => clearTimeout(userTimeOut);
  }, [userClick]);
  useEffect(() => {
    let interval = setInterval(() => {
      if (!userClick) nextMovie();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [movies.length, userClick]);

  useEffect(function () {
    async function getMovieData() {
      //
      let data = await getTMDBMovieLists({ type: "top_rated", region: "in" });
      let popularMovies = data.results
        .sort((a, b) => Math.random() - 0.5)
        .map((movie) => {
          return {
            ...movie,
            backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          };
        });
      setMovies(popularMovies);
      console.table(popularMovies);
    }
    getMovieData();
  }, []);
  console.log(children);
  return (
    <div>
      {movies.map((movie) => {
        return (
          <img
            key={movie.id}
            src={
              movies.length > 0
                ? movie.backdrop_path
                : `https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp`
            }
            alt={movie.title}
            className={`fixed h-dvh w-full object-cover transition-opacity duration-300 ${movies[curMovieIndex].id === movie.id ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}

      <div className="bg-base-200/60 fixed flex h-dvh w-full backdrop-blur-lg sm:bg-black/40"></div>
      <div className="navbar bg-neutral/30 border-neutral/40 relative flex border-b-2 md:px-12 lg:px-36">
        <div className="flex-1">
          <a className="text-neutral-content flex w-fit cursor-default items-center justify-center text-lg font-bold uppercase md:text-2xl">
            <LogoIcon className="fill-neutral-content h-9 w-9" />
            Share List
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal text-md px-1">
            <li>
              <ThemeController
                themes={[
                  "light",
                  "dark",
                  "abyss",
                  "autumn",
                  "black",
                  "bumblebee",
                  "coffee",
                  "cyberpunk",
                  "dim",
                  "forest",
                  "halloween",
                  "lofi",
                  "retro",
                  "sunset",
                  "valentine",
                  "winter",
                ]}
              />
            </li>
            {/* <li className="px-1">{children({ login: login, children: "" })}</li> */}
          </ul>
        </div>
      </div>
      <div className="hero relative h-dvh bg-transparent">
        <div className="hero-content text-base-content sm:bg-base-100/70 sm:rounded-box w-full flex-col sm:w-fit sm:flex-row">
          <div className="h-60 w-40 lg:h-84 lg:w-56" onClick={handleUserClick}>
            {movies.map((movie) => {
              return (
                <img
                  key={movie.id}
                  src={
                    movies.length > 0
                      ? movie.poster_path
                      : `https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp`
                  }
                  alt={movie.title}
                  className={`rounded-box absolute w-40 max-w-sm shadow-2xl transition-opacity duration-300 lg:w-56 ${movies[curMovieIndex].id === movie.id ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}
          </div>
          <div className="flex flex-col items-center px-3.5 sm:items-start sm:text-left">
            <h1 className="text-3xl font-black lg:text-5xl">
              Friends Know Best!
            </h1>
            {/* <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 21"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 lg:size-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                />
              </svg>
              <h1 className="text-3xl font-bold lg:text-5xl">SHARE LIST</h1>
            </div>
            <h2 className="text-base font-semibold lg:text-2xl">
              Friends Know Best!
            </h2> */}
            <p className="max-w-lg py-6 text-sm font-semibold lg:text-base">
              Recommendations tailored to you.
              <br /> From late-night classics to hidden gems,
              <br />
              explore cinema the better way — <em>with friends.</em>
            </p>
            <div className="flex flex-col gap-3 md:flex-row">
              {children({ login: login, children: "Login with google" })}
              <button className="btn btn-ghost btn-outline">
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginWithGoogle({ login, children }) {
  return (
    <button
      className="btn btn-primary hover:shadow-base/10 w-fit hover:shadow-xl"
      onClick={login}
    >
      <svg
        aria-label="Google logo"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="rounded-full"
      >
        <g>
          <path d="m0 0H512V512H0" fill="white" className=""></path>
          <path
            fill="#34a853"
            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
          ></path>
          <path
            fill="#4285f4"
            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
          ></path>
          <path
            fill="#fbbc02"
            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
          ></path>
          <path
            fill="#ea4335"
            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
          ></path>
        </g>
      </svg>
      {children}
    </button>
  );
}
