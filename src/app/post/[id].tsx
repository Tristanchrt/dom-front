import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { useLocalSearchParams, router } from 'expo-router';
import { postsUseCases } from '@/data/container';
import { postDetails, sampleComments } from '@/data/fixtures/posts';

const { width: screenWidth } = Dimensions.get('window');

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(sampleComments);

  const post = postDetails[id as keyof typeof postDetails];
  const hasImage = (p: typeof post): p is typeof post & { image: string } =>
    !!p &&
    Object.prototype.hasOwnProperty.call(p as any, 'image') &&
    typeof (p as any).image === 'string';
  const postHasImage = hasImage(post);

  console.log('Post ID requested:', id);
  console.log('Post found:', !!post);
  console.log('Available post IDs:', Object.keys(postDetails));

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="image" size={48} color="#E0E0E0" />
          <Text style={styles.errorTitle}>Publication non trouvée</Text>
          <Text style={styles.errorSubtitle}>ID: {id}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const postFromRepo = id ? await postsUseCases.getById(String(id)) : null;
      if (!mounted) return;
      if (postFromRepo) {
        setIsLiked(postFromRepo.isLiked);
        setLikeCount(postFromRepo.likesCount);
      } else {
        setLikeCount(post.likes);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleLike = () => {
    const wasLiked = isLiked;
    if (wasLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    const postId = id ? String(id) : null;
    if (postId) {
      postsUseCases.toggleLike(postId, wasLiked).catch(() => {});
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: `c${comments.length + 1}`,
        user: {
          name: 'Vous',
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
        },
        content: comment.trim(),
        timestamp: 'maintenant',
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  const renderComment = (commentItem: any) => (
    <View key={commentItem.id} style={styles.commentItem}>
      <Image source={{ uri: commentItem.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{commentItem.user.name}</Text>
          <Text style={styles.commentTimestamp}>{commentItem.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{commentItem.content}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentLike}>
            <FontAwesome name="heart-o" size={12} color="#8B7355" />
            <Text style={styles.commentLikeText}>{commentItem.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.commentReply}>Répondre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication</Text>
        <TouchableOpacity style={styles.headerIcon} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <FontAwesome name="ellipsis-v" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* User Header */}
          <View style={styles.userHeader}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => router.push(`/profile/${post.user.id}`)}
            >
              <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  {post.user.verified && (
                    <FontAwesome name="check-circle" size={16} color="#FF8C42" />
                  )}
                </View>
                <Text style={styles.userHandle}>{post.user.handle}</Text>
                <Text style={styles.postTimestamp}>
                  {post.timestamp} • {post.location}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Suivre</Text>
            </TouchableOpacity>
          </View>

          {/* Post Image */}
          {postHasImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: (post as any).image }} style={styles.postImage} />
            </View>
          )}

          {/* Post Content */}
          <View style={[styles.postContent, !postHasImage && styles.postContentNoImage]}>
            <Text style={styles.postText}>{post.content}</Text>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {post.tags.map((tag: string, index: number) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <FontAwesome
                  name={isLiked ? 'heart' : 'heart-o'}
                  size={24}
                  color={isLiked ? '#FF4444' : '#8B7355'}
                />
                <Text style={[styles.actionText, isLiked && styles.likedText]}>
                  {formatNumber(likeCount)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="comment-o" size={24} color="#8B7355" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="share" size={24} color="#8B7355" />
                <Text style={styles.actionText}>{post.shares}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Commentaires</Text>
            {comments.map(renderComment)}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
            }}
            style={styles.currentUserAvatar}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Ajouter un commentaire..."
            placeholderTextColor="#8B7355"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, comment.trim() && styles.sendButtonActive]}
            onPress={handleAddComment}
            disabled={!comment.trim()}
          >
            <FontAwesome name="send" size={16} color={comment.trim() ? '#FF8C42' : '#8B7355'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerIcon: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginRight: 6,
  },
  userHandle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 2,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#8B7355',
  },
  followButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  postContentNoImage: {
    paddingTop: 24,
    marginTop: 8,
  },
  postText: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '500',
  },
  likedText: {
    color: '#FF4444',
    fontWeight: '600',
  },
  commentsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for comment input
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginRight: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#8B7355',
  },
  commentText: {
    fontSize: 14,
    color: '#2C1810',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentLikeText: {
    fontSize: 12,
    color: '#8B7355',
    marginLeft: 4,
  },
  commentReply: {
    fontSize: 12,
    color: '#FF8C42',
    fontWeight: '600',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  currentUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: '#FFF4E6',
    borderRadius: 20,
  },
});
