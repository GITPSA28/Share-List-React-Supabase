import React from "react";
import useUsersList from "../features/lists/useUsersList";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

export default function AddToList({ movie, className, children }) {
  return (
    <Modal>
      <Modal.ModalContent className={"text-base-content bg-base-100"}>
        <h3 className="text-lg font-bold">Add {movie.title}</h3>
        <p className="py-4">Select Lists</p>
        <AddToListContent movie={movie} />
      </Modal.ModalContent>
      <Modal.OpenModel
        className={className ? className : "btn btn-sm btn-ghost"}
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
              className="lucide lucide-info-icon lucide-info"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add
          </>
        )}
      </Modal.OpenModel>
    </Modal>
  );
}
function AddToListContent({ movie }) {
  const { lists, isLoading } = useUsersList();
  if (isLoading) return <Spinner />;
  return <SelectList movie={movie} userList={lists} isLoading={isLoading} />;
}

function SelectList({ movie, userList }) {
  if (!userList.length) return <>No List found</>;
  return (
    <div>
      <ul>
        {userList.map((list) => {
          return (
            <fieldset className="fieldset m-2">
              <label className="label text-base-content py-2">
                <input type="checkbox" className="checkbox" />
                {list.list_name}
              </label>
            </fieldset>
          );
        })}
      </ul>
      <Modal.ModalAction>
        <Modal.ModalClose className={"btn btn-sm sm:btn-md"} />
        {/* {selectedFriends.length > 0 && ( */}
        <Modal.ModalClose
          //   submit={handleSend}
          className="btn-primary btn btn-sm sm:btn-md"
        >
          Save
        </Modal.ModalClose>
        {/* )} */}
      </Modal.ModalAction>
    </div>
  );
}
