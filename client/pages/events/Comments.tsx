import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faTrash,
  faPenToSquare,
  faCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

import { Comment, Event, User } from "../../utils/types";
import { fromNow } from "../../utils/dates";
import UserAvatar from "../../components/UserAvatar";
import IconButton, {
  IconButtonKind,
  IconButtonSize,
} from "../../components/IconButton";
import Modal from "../../components/Modal";

import styles from "./Comments.module.scss";
import Button, { ButtonKind } from "../../components/Button";

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
        color
      }
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: Float!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      id
      content
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($commentId: Float!) {
    deleteComment(commentId: $commentId)
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

  const [updating, setUpdating] = useState<number | null>(null);
  const [commentUpdate, setCommentUpdate] = useState<string | null>(null);
  const [updateComment] = useMutation(UPDATE_COMMENT, {
    onError: (error) => console.error(error),
    onCompleted: () => {
      setUpdating(null);
      setCommentUpdate(null);
    },
  });

  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { commentId: deleting },
    onCompleted: () => setDeleting(null),
    update: (cache) => {
      cache.modify({
        id: cache.identify(event),
        fields: {
          comments(cachedComments, { readField }) {
            return cachedComments.filter(
              (commentRef) => deleting !== readField("id", commentRef)
            );
          },
        },
      });

      const normalizedId = cache.identify({ deleting, __typename: "Comment" });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitComment();
    }
  };

  return (
    <div className={styles.comments}>
      <div className={styles.comments__container}>
        {comments.map(({ id, content, createdAt, author }) => (
          <div
            key={id}
            className={`${styles.comment} ${
              author.id === loggedUser.id ? styles.own : ""
            }`}
          >
            <div
              className={`${styles.comment__container} ${
                author.id === loggedUser.id ? styles.own : ""
              }`}
            >
              <UserAvatar user={author} />
              <div
                className={`${styles.comment__content} ${
                  author.id === loggedUser.id ? styles.own : ""
                }`}
              >
                <div className={styles.comment__info}>
                  <label
                    className={author.color ? styles.colored : ""}
                    style={author.color ? { color: author.color } : {}}
                  >
                    <Link href={`/user/${author.id}`}>{author.username}</Link>
                  </label>
                  <label>{fromNow(createdAt.toString())}</label>
                </div>
                <div>
                  {updating === id ? (
                    <TextareaAutosize
                      value={commentUpdate}
                      onChange={(e) => setCommentUpdate(e.target.value)}
                      maxRows={2}
                      className={styles.textarea}
                    />
                  ) : (
                    content
                  )}
                </div>
              </div>
            </div>
            {loggedUser.id === author.id && !updating && (
              <div className={styles.comment__actions}>
                <IconButton
                  icon={faTrash}
                  kind={IconButtonKind.danger}
                  size={IconButtonSize.small}
                  onClick={() => setDeleting(id)}
                />
                <IconButton
                  icon={faPenToSquare}
                  size={IconButtonSize.small}
                  onClick={() => {
                    setUpdating(id);
                    setCommentUpdate(content);
                  }}
                />
              </div>
            )}
            {updating === id && (
              <div
                className={styles.comment__actions}
                style={{ visibility: "visible" }}
              >
                <IconButton
                  icon={faBan}
                  kind={IconButtonKind.danger}
                  size={IconButtonSize.small}
                  onClick={() => setUpdating(null)}
                />
                <IconButton
                  icon={faCheck}
                  size={IconButtonSize.small}
                  onClick={() =>
                    updateComment({
                      variables: { commentId: id, content: commentUpdate },
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.comments__input}>
        <UserAvatar user={loggedUser} />
        <TextareaAutosize
          value={comment}
          onKeyDown={handleKeyDown}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          maxRows={5}
          className={styles.textarea}
        />
        <FontAwesomeIcon icon={faPaperPlane} onClick={submitComment} />
      </div>
      <Modal visible={!!deleting} onClose={() => setDeleting(null)}>
        <div className={styles["comments__modal"]}>
          <div>Delete comment</div>
          <div>
            Are you sure you want to delete this comment ? This action is
            irreversible !
          </div>
          <div className={styles["comments__modal__actions"]}>
            <Button
              kind={ButtonKind.secondary}
              onClick={() => setDeleting(null)}
              label="Cancel"
            />
            <Button
              kind={ButtonKind.danger}
              onClick={deleteComment}
              label="Confirm"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Comments;
