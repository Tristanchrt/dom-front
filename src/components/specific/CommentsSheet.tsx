import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Comment } from '@domain/models/Comment';
import { User } from '@domain/models/User';
import { commentsUseCases } from '@data/container';

type CommentWithChildren = Comment & { children: CommentWithChildren[] };

const buildCommentTree = (comments: Comment[]): CommentWithChildren[] => {
  const commentsById: { [key: string]: CommentWithChildren } = {};
  comments.forEach((comment) => {
    commentsById[comment.id] = { ...comment, children: [] };
  });

  const tree: CommentWithChildren[] = [];
  comments.forEach((comment) => {
    if (comment.parentCommentId && commentsById[comment.parentCommentId]) {
      commentsById[comment.parentCommentId].children.push(commentsById[comment.id]);
    } else {
      tree.push(commentsById[comment.id]);
    }
  });
  return tree;
};

const CommentItem = ({ comment, onReply }: { comment: Comment; onReply: (comment: Comment) => void }) => (
  <View style={styles.commentContainer}>
    <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{comment.user.name}</Text>
        <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleTimeString()}</Text>
      </View>
      {comment.replyTo && <Text style={styles.replyTo}>reply to @{comment.replyTo.name}</Text>}
      <Text>{comment.content}</Text>
      <TouchableOpacity onPress={() => onReply(comment)}>
        <Text style={styles.replyButton}>Reply</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RecursiveComment = ({
  comment,
  onReply,
  level,
}: {
  comment: CommentWithChildren;
  onReply: (comment: Comment) => void;
  level: number;
}) => {
  return (
    <View style={{ marginLeft: level * 20 }}>
      <CommentItem comment={comment} onReply={onReply} />
      {comment.children.map((child) => (
        <RecursiveComment key={child.id} comment={child} onReply={onReply} level={level + 1} />
      ))}
    </View>
  );
};

export const CommentsSheet = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Pick<User, 'id' | 'name'>>();
  const [parentCommentId, setParentCommentId] = useState<string>();

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  React.useEffect(() => {
    commentsUseCases.list(postId).then(setComments);
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      commentsUseCases.add(postId, newComment, replyTo, parentCommentId).then((comment) => {
        setComments((prev) => [...prev, comment]);
        setNewComment('');
        setReplyTo(undefined);
        setParentCommentId(undefined);
      });
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyTo(comment.user);
    setParentCommentId(comment.id);
  };

  const cancelReply = () => {
    setReplyTo(undefined);
    setParentCommentId(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>
      <ScrollView>
        {commentTree.map((comment) => (
          <RecursiveComment key={comment.id} comment={comment} onReply={handleReply} level={0} />
        ))}
      </ScrollView>
      <View style={styles.inputOuterContainer}>
        {replyTo && (
          <View style={styles.replyingContainer}>
            <Text>Replying to @{replyTo.name}</Text>
            <TouchableOpacity onPress={cancelReply}>
              <FontAwesome name="close" size={16} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder={replyTo ? `Reply to ${replyTo.name}` : 'Post your comment'}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
            <FontAwesome name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentDate: {
    color: 'gray',
  },
  replyTo: {
    fontStyle: 'italic',
    color: 'gray',
    fontSize: 12,
  },
  replyButton: {
    color: '#007BFF',
    marginTop: 4,
    fontWeight: '500',
  },
  inputOuterContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  replyingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
});
