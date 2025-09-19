import React, { useState } from "react";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";
import useFriendList from "../features/friends/useFriendList";
import { useSession } from "../contexts/SessionContext";
import { useSendItemsToFriends } from "../features/friends/useSendItemsToFreinds";
import Spinner from "../ui/Spinner";

export default function SendMovie({ movie, className, children }) {
  return (
    <Modal>
      <Modal.ModalContent className={"text-base-content bg-base-100"}>
        <h3 className="text-lg font-bold">Send {movie.title}</h3>
        <p className="py-4">Select friends</p>
        <SendMovieContent movie={movie} />
      </Modal.ModalContent>
      {/* <> */}

      <Modal.OpenModel
        className={
          className ? className : "btn glass text-neutral-content btn-sm"
        }
      >
        {children ? (
          children
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className=""
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
            Send
          </>
        )}
      </Modal.OpenModel>

      {/* </> */}
    </Modal>
  );
}
function SendMovieContent({ movie }) {
  const { friendList, isLoading } = useFriendList();
  return (
    <SelectFriends
      movie={movie}
      friendList={friendList}
      isLoading={isLoading}
    />
  );
}
function SelectFriends({ movie, friendList, isLoading }) {
  const [selectedFriends, setSelectedFreinds] = useState([]);
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const { isSending, sendItemsToFriendIds } = useSendItemsToFriends();

  function addFriendId(id) {
    setSelectedFreinds((ids) => [...ids, id]);
  }
  function removeFriendId(id) {
    setSelectedFreinds((ids) => [...ids.filter((el) => el != id)]);
  }
  function handleSend() {
    sendItemsToFriendIds({
      value: movie.id,
      type: "movie",
      friendIds: selectedFriends,
    });
  }
  if (isLoading || isSending) return <Spinner />;
  if (!friendList && !isLoading) return <p>No friends</p>;
  return (
    <>
      <form>
        <div className="flex flex-wrap gap-3">
          {friendList?.map((friend) => {
            return (
              <label
                className="text-center"
                key={friend.id}
                htmlFor={friend.id}
              >
                <div className="relative">
                  <input
                    className="checkbox checkbox-primary absolute right-0 bottom-0 z-20 border-0"
                    type="checkbox"
                    name="friend"
                    id={friend.id}
                    onChange={(e) => {
                      if (e.target.checked) addFriendId(friend.id);
                      else removeFriendId(friend.id);
                    }}
                  ></input>

                  <Avatar className={"w-16 rounded-full"} user={friend} />
                </div>
                {friend.username}
              </label>
            );
          })}
        </div>

        <Modal.ModalAction>
          <Modal.ModalClose className={"btn btn-sm sm:btn-md"} />
          {selectedFriends.length > 0 && (
            <Modal.ModalClose
              submit={handleSend}
              className="btn-primary btn btn-sm sm:btn-md"
            >
              send
            </Modal.ModalClose>
          )}
        </Modal.ModalAction>
      </form>
    </>
  );
}
