import React, { useState } from "react";
import { TaskProps } from "./Task.types";
import approve from "../../assets/approve.png";
import edit from "../../assets/pencil.png";
import rubish from "../../assets/rubish.png";
import "../../App.scss";

export const Task: React.FC<TaskProps> = ({
  task,
  onToggleCompleted,
  onUpdateTitle,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleUpdateTitle = () => {
    if (newTitle.trim()) {
      onUpdateTitle(newTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className={`task ${task.completed ? "cross-out" : "not-crossed-out"}`}>
      <input
        type="checkbox"
        className="checked"
        checked={task.completed}
        onChange={onToggleCompleted}
      />
      <div className="block">
        <div className="line"></div>
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle();
            }}
            className="editInput"
          />
        ) : (
          <div className="item">{task.title}</div>
        )} 
      </div>
      <div className="signs">
        {isEditing ? (
          <img
            src={approve}
            alt="approve"
            className="approve"
            onClick={handleUpdateTitle}
          />
        ) : (
          <>
            <img
              src={edit}
              alt="edit"
              className="pencil"
              onClick={() => setIsEditing(true)}
            />
            <img
              src={rubish}
              alt="delete"
              className="rubish"
              onClick={onDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};
