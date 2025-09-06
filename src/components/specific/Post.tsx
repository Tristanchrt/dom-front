import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface PostType {
  id: string;
  user: {
    id?: string;
    name: string;
    avatar: string;
    handle: string;
    verified?: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  price?: string;
}

const { width: screenWidth } = Dimensions.get('window');

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [likeAnimation] = useState(new Animated.Value(1));
  const [lastTap, setLastTap] = useState<number>(0);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleLike = () => {
    // Animate the heart
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle like state and update count
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleComment = () => {
    // For now, show a placeholder alert
    Alert.alert(
      'Commentaires',
      'Fonctionnalité des commentaires bientôt disponible !',
      [
        {
          text: 'OK',
          style: 'default',
        },
        {
          text: 'Simuler un commentaire',
          onPress: () => {
            setCommentCount(prev => prev + 1);
            Alert.alert('Commentaire ajouté !', 'Votre commentaire a été publié.');
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Partager',
      `Partager la publication de ${post.user.name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Copier le lien',
          onPress: () => {
            Alert.alert('Lien copié !', 'Le lien de la publication a été copié dans le presse-papier.');
          },
        },
        {
          text: 'Partager sur...',
          onPress: () => {
            Alert.alert('Partage', 'Fonctionnalité de partage bientôt disponible !');
          },
        },
      ]
    );
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap detected - like the post if not already liked
      if (!isLiked) {
        handleLike();
      }
    } else {
      setLastTap(now);
    }
  };

  const handlePostClick = () => {
    // Navigate to post detail
    console.log('Navigating to post:', post.id);
    try {
      router.push(`/post/${post.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', `Unable to open post ${post.id}`);
    }
  };

  const handleUserClick = () => {
    // Navigate to user profile if user ID is available
    console.log('Navigating to user profile:', post.user.id);
    if (post.user.id) {
      try {
        router.push(`/profile/${post.user.id}`);
      } catch (error) {
        console.error('Profile navigation error:', error);
        Alert.alert('Navigation Error', `Unable to open profile ${post.user.id}`);
      }
    } else {
      Alert.alert('Profile Unavailable', 'This user profile is not available.');
    }
  };

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserClick} activeOpacity={0.7}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{post.user.name}</Text>
            <Text style={styles.timestamp}>{post.timestamp} ago</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={16} color="#8B7355" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <TouchableOpacity activeOpacity={0.9} onPress={handlePostClick}>
        <Text style={styles.content}>{post.content}</Text>
      </TouchableOpacity>

      {/* Post Image */}
      {post.image && (
        <TouchableOpacity 
          style={styles.imageContainer} 
          activeOpacity={0.9} 
          onPress={handlePostClick}
          onLongPress={handleDoubleTap}
        >
          <Image source={{ uri: post.image }} style={styles.postImage} />
          {post.price && (
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{post.price}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <FontAwesome 
              name={isLiked ? "heart" : "heart-o"} 
              size={18} 
              color={isLiked ? "#FF4444" : "#FF8C42"} 
            />
          </Animated.View>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {formatNumber(likeCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <FontAwesome name="comment-o" size={18} color="#8B7355" />
          <Text style={styles.actionText}>{commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <FontAwesome name="share" size={18} color="#8B7355" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 14,
    color: '#8B7355',
  },
  moreButton: {
    padding: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    color: '#2C1810',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FF8C42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 6,
    fontWeight: '500',
  },
  likedText: {
    color: '#FF4444',
    fontWeight: '600',
  },
});
