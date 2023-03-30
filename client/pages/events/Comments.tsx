import { KeyboardEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

import { Comment, Event, User } from "../../utils/types";
import { fromNow } from "../../utils/dates";
import Link from "next/link";
import UserAvatar from "../../components/UserAvatar";

import styles from "./Comments.module.scss";

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($eventId: Float!, $content: String!) {
    createComment(eventId: $eventId, content: $content) {
      id
      content
      createdAt
      author {
        id
        username
        pictureUrl
      }
    }
  }
`;

type CommentsProps = {
  event: Event;
  comments: Comment[];
  loggedUser: User;
};

const Comments = ({ event, comments, loggedUser }: CommentsProps) => {
  const [comment, setComment] = useState("");

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const submitComment = () => {
    if (comment?.length) {
      createComment({
        variables: { eventId: event.id, content: comment },
        onCompleted: () => setComment(""),
        update: (cache, { data: { createComment } }) => {
          if (createComment) {
            cache.modify({
              id: cache.identify(event),
              fields: {
                comments(cachedComments) {
                  return [...cachedComments, createComment];
                },
              },
            });
          }
        },
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitComment();
    }
  };

  return (
    <div className={styles["comments"]}>
      <div className={styles["comments__container"]}>
        {comments.map(({ id, content, createdAt, author }) => (
          <div
            key={id}
            className={`${styles["comments__comment"]} ${
              author.id === loggedUser.id ? styles.own : ""
            }`}
          >
            <UserAvatar user={loggedUser} />
            <div
              className={`${styles["comments__content"]} ${
                author.id === loggedUser.id ? styles.own : ""
              }`}
            >
              <div className={styles["comments__info"]}>
                <Link href={`/user/${author.id}`}>{author.username}</Link>
                <label>{fromNow(createdAt.toString())}</label>
              </div>
              <div>{content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles["comments__input"]}>
        <UserAvatar user={loggedUser} />
        <TextareaAutosize
          value={comment}
          onKeyDown={handleKeyDown}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          maxRows={5}
        />
        <FontAwesomeIcon icon={faPaperPlane} onClick={submitComment} />
      </div>
    </div>
  );
};

export default Comments;
