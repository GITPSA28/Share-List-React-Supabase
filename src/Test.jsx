import { useState, useEffect } from "react";
import supabase from "./services/supabase.js";
import { logOut, loginGoogle } from "./services/apiAuth.js";

function Test() {
  const [movies, setMovies] = useState([]);
  const [movieIds, setMovieIds] = useState([]);
  const [theme, setTheme] = useState("black");
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function getMovies() {
      let { data: list_movies, error } = await supabase
        .from("list_movies")
        .select("*");
      console.log(list_movies);

      let movieDetailsReq = list_movies.map(async (movie) => {
        let res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
        );
        return res.json();
      });
      let movieDetails = await Promise.all(movieDetailsReq);
      console.log(movieDetails);
      //   let movieDetails = JSON.parse(movieDetailsRes.data);
      if (list_movies.length > 1) {
        setMovieIds(list_movies);
      }
      if (movieDetails.length > 1) {
        setMovies(movieDetails);
      }
    }

    getMovies();
  }, []);

  if (!session)
    return (
      <>
        <button
          className="btn border-[#e5e5e5] bg-white text-black"
          onClick={loginGoogle}
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
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
          Login with Google
        </button>
      </>
    );
  console.log(session);
  return (
    <div className="" data-theme={theme}>
      <h1>welcome {session?.user?.user_metadata?.name}</h1>
      <button className="btn btn-primary" onClick={logOut}>
        Log out
      </button>
      {/* <select onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Default</option>
        <option value="dark">Dark</option>
        <option value="pink">Pink</option>
      </select> */}
      <ThemeController theme={theme} setTheme={setTheme} />
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
          Fav Movies
        </li>
        {/* 
              adult:false
              backdrop_path:"/6MmYsaK6poR8f4R8jsBnJBU5tfd.jpg"
              belongs_to_collection:null
              budget:7000000
              genres:(2) [{…}, {…}]
              homepage:"https://www.filmnation.com/library/gifted"
              id:400928
              imdb_id:"tt4481414"
              origin_country:['US']
              original_language:"en"
              original_title:"Gifted"
              overview:"Frank, a single man raising his child prodigy niece Mary, is drawn into a custody battle with his mother."
              popularity:4.0583
              poster_path:"/9Ts7Vc4wLlpI9oox9mkVUE1tBHy.jpg"
              production_companies:(3) [{…}, {…}, {…}]
              production_countries:(2) [{…}, {…}]
              release_date:"2017-04-07"
              revenue:40300000
              runtime:101
              spoken_languages:[{…}]
              status:"Released"
              tagline:""
              title:"Gifted"
              video:false
              vote_average:8.004
              vote_count:5731
          */}
        {movies.map((movie) => (
          <li className="list-row my-2 items-center" key={movie.id}>
            <div className="flex items-center justify-center">
              {/* <img
                className="rounded-box absolute w-18 opacity-80 blur"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              /> */}
              <img
                className="rounded-box z-10 w-16"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase opacity-60">
                {movie.title}
              </div>
              <div className="flex items-center gap-2 text-base">
                {Math.round(movie.vote_average * 5) / 10}
                <Rating value={movie.vote_average} />
              </div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>
        ))}

        <li className="list-row">
          <div>
            <img
              className="rounded-box size-10"
              src="https://img.daisyui.com/images/profile/demo/4@94.webp"
            />
          </div>
          <div>
            <div>Ellie Beilish</div>
            <div className="text-xs font-semibold uppercase opacity-60">
              Bears of a fever
            </div>
          </div>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </g>
            </svg>
          </button>
        </li>

        <li className="list-row">
          <div>
            <img
              className="rounded-box size-10"
              src="https://img.daisyui.com/images/profile/demo/3@94.webp"
            />
          </div>
          <div>
            <div>Sabrino Gardener</div>
            <div className="text-xs font-semibold uppercase opacity-60">
              Cappuccino
            </div>
          </div>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </g>
            </svg>
          </button>
        </li>
      </ul>

      {movieIds.map((movie) => (
        <li className="text-white" key={movie.id}>
          {movie.movie_id}
        </li>
      ))}
      {movies.map((movie) => (
        <li className="text-white" key={movie.id}>
          {movie.title}
        </li>
      ))}
    </div>
  );
}
export default Test;

function Rating({ value }) {
  const rating = Math.round(value) / 2 || 0.5;
  return (
    <div className="rating rating-sm rating-half">
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="0.5 star"
        aaria-current={`${rating === 0.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="1 star"
        aria-current={`${rating === 1}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="1.5 star"
        aria-current={`${rating === 1.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="2 star"
        aria-current={`${rating === 2}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="2.5 star"
        aria-current={`${rating === 2.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="3 star"
        aria-current={`${rating === 3}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="3.5 star"
        aria-current={`${rating === 3.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="4 star"
        aria-current={`${rating === 4}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="4.5 star"
        aria-current={`${rating === 4.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="5 star"
        aria-current={`${rating === 5}`}
      ></div>
    </div>
  );
}

function ThemeController({ theme, setTheme }) {
  const handleChange = (e) => {
    setTheme(e.target.value);
  };
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
      >
        {[
          "abyss",
          "acid",
          "aqua",
          "autumn",
          "black",
          "bumblebee",
          "business",
          "caramellatte",
          "cmyk",
          "coffee",
          "corporate",
          "cupcake",
          "cyberpunk",
          "dark",
          "dim",
          "dracula",
          "emerald",
          "fantasy",
          "forest",
          "garden",
          "halloween",
          "lemonade",
          "light",
          "lofi",
          "luxury",
          "night",
          "nord",
          "pastel",
          "retro",
          "silk",
          "sunset",
          "synthwave",
          "valentine",
          "winter",
          "wireframe",
        ].map((th) => (
          <li key={th}>
            <input
              type="radio"
              name="theme-dropdown"
              className={`theme-controller ${theme === th ? "btn-primary" : "btn-ghost"} btn btn-sm btn-block w-full justify-start`}
              aria-label={th.charAt(0).toUpperCase() + th.slice(1)}
              value={th}
              checked={theme === th}
              onChange={handleChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
