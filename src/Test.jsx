import { useState, useEffect } from "react";
import supabase from "./services/supabase.js";
import { useUser } from "./features/authentication/useUser.js";
import Logout from "./features/authentication/Logout.jsx";
import MovieCard from "./ui/MovieCard.jsx";
import { useSession } from "./contexts/SessionContext.jsx";
import { Link } from "react-router";
import Avatar from "./ui/Avatar.jsx";

function Test() {
  const [lists, setLists] = useState([]);
  const {
    session: { user },
  } = useSession();

  useEffect(() => {
    async function getMovies() {
      // let { data: listsResult, error } = await supabase
      //   .from("lists")
      //   .select(`*,items (*)`)
      //   .eq("items.type", "movie")
      //   .or(
      //     `and(owner_id.eq.${user.id},recommended_to.is.null),recommended_to.eq.${user.id}`,
      //   );
      // `user.id` is the authenticated user’s UUID
      const { data: listsResult, error } = await supabase
        .from("lists")
        .select(
          `
        *,
        items(*),
        owner_profile:profiles!lists_owner_id_fkey1(*)
      `,
        )
        .eq("items.type", "movie")
        .or(
          `and(owner_id.eq.${user.id},recommended_to.is.null),recommended_to.eq.${user.id}`,
        )
        .order("created_at", { ascending: false })
        .order("created_at", { foreignTable: "items", ascending: false });
      if (error) throw error;
      // let filteredList = listsResult
      //   .filter((list) => list.items.length > 0)
      //   .sort(
      //     (a, b) =>
      //       new Date(b.items[0].created_at).getTime -
      //       new Date(a.items[0].created_at).getTime,
      //   );
      console.log(listsResult);
      setLists(listsResult);
    }

    getMovies();
  }, []);

  // if (isLoading) return <div>Loading..</div>;
  // if (!isLoading && !isAuthenticated) return <div>No Access</div>;

  return (
    <div className="bg-base-100">
      <div className="flex flex-col gap-10">
        {lists.length > 0 &&
          lists.map((list) => <MovieList list={list} key={list.id} />)}
      </div>
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

{
  /* 
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
          */
}
function MovieList({ list }) {
  const [movies, setMovies] = useState([]);
  const { items } = list;
  useEffect(() => {
    async function getMovies() {
      let movieDetailsReq = items.map(async (movie) => {
        let res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.value}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
        );
        return res.json();
      });
      let movieDetailsRes = await Promise.allSettled(movieDetailsReq);
      let movieDetails = movieDetailsRes
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value);
      if (movieDetails.length > 0) {
        setMovies(movieDetails);
      }
    }
    getMovies();
  }, []);
  if (!movies.length) return;
  return (
    <div>
      <h2 className="flex gap-3 pl-4 font-bold tracking-wide uppercase">
        <Link
          className="flex items-center gap-1"
          to={`/profile/${list?.owner_profile?.username}`}
        >
          <Avatar
            user={list?.owner_profile}
            className={"size-6 rounded-full"}
          />
          {`${list?.owner_profile?.username}'s `}
        </Link>

        <em>
          <Link
            className="link-hover text-sm opacity-70"
            to={`/list/${list.list_id}`}
          >
            {list.list_name}
          </Link>
        </em>
      </h2>
      <ul
        className={`bg-base-100 no-scrollbar mt-3 flex justify-start gap-3 overflow-x-auto pl-4`}
      >
        {movies.map((movie) => (
          <div className="w-96 shrink-0">
            <MovieCard
              key={movie.id}
              movie={movie}
              showOverView={false}
            ></MovieCard>
          </div>
        ))}
      </ul>
    </div>
  );
}

// <li className="list-row my-2 items-center" key={movie.id}>
//   <div className="flex items-center justify-center">
//     {/* <img
//       className="rounded-box absolute w-18 opacity-80 blur"
//       src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//     /> */}
//     <img
//       className="rounded-box z-10 w-16"
//       src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//     />
//   </div>
//   <div>
//     <div className="text-xs font-semibold uppercase opacity-60">
//       {movie.title}
//     </div>
//     <div className="flex items-center gap-2 text-base">
//       {Math.round(movie.vote_average * 5) / 10}
//       <Rating value={movie.vote_average} />
//     </div>
//   </div>
//   <button className="btn btn-square btn-ghost">
//     <svg
//       className="size-[1.2em]"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//     >
//       <g
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         strokeWidth="2"
//         fill="none"
//         stroke="currentColor"
//       >
//         <path d="M6 3L20 12 6 21 6 3z"></path>
//       </g>
//     </svg>
//   </button>
//   <button className="btn btn-square btn-ghost">
//     <svg
//       className="size-[1.2em]"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//     >
//       <g
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         strokeWidth="2"
//         fill="currentColor"
//         stroke="currentColor"
//       >
//         <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
//       </g>
//     </svg>
//   </button>
// </li>
