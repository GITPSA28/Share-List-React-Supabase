import React, { useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import useItemInUsersList from "../features/lists/useItemInUsersList";
import { useUpdateListItems } from "../features/lists/useUpdateUserList";

export default function AddToList({
  movie,
  className,
  children,
  custom = false,
}) {
  return (
    <Modal>
      <Modal.ModalContent className={"text-base-content bg-base-100"}>
        <h3 className="text-lg font-bold">Add {movie.title}</h3>
        <p className="py-4">Select Lists</p>
        <AddToListContent movie={movie} custom={custom} />
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
function AddToListContent({ movie, custom }) {
  const { lists, isLoading } = useItemInUsersList({ item: movie.id, custom });
  if (isLoading) return <Spinner />;
  return <SelectList movie={movie} userList={lists} isLoading={isLoading} />;
}

function SelectList({ movie, userList, isLoading }) {
  const { isUpdating, updateList } = useUpdateListItems({ item: movie.id });
  const [selectedList, setSelectedList] = useState(() => {
    const initLists = userList.map((list) => {
      return {
        checked: list.isExists,
        initChecked: list.isExists,
        list_name: list.list_name,
        list_id: list.list_id,
      };
    });
    return initLists;
  });
  function updateSelectedList(list_id, checked) {
    setSelectedList((lists) => [
      ...lists.map((list) => {
        if (list.list_id !== list_id) return list;
        return { ...list, checked };
      }),
    ]);
  }
  function handleSubmit() {
    updateList({
      value: movie.id,
      type: "movie",
      lists: selectedList.filter((list) => list.initChecked !== list.checked),
    });
  }
  if (isLoading) return <></>;
  if (!selectedList.length) return <>No List found</>;
  return (
    <div>
      <ul>
        {selectedList.map((list) => {
          return (
            <fieldset key={list.list_id} className="fieldset m-2">
              <label className="label text-base-content py-2">
                <input
                  type="checkbox"
                  checked={list.checked}
                  onChange={(e) =>
                    updateSelectedList(list.list_id, e.target.checked)
                  }
                  className="checkbox"
                />
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
          disabled={isUpdating}
          submit={handleSubmit}
          className="btn-primary btn btn-sm sm:btn-md"
        >
          Save
        </Modal.ModalClose>
        {/* )} */}
      </Modal.ModalAction>
    </div>
  );
}
