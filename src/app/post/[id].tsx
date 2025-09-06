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
import { useLocalSearchParams, router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Sample post details data
const postDetails = {
  // Following feed posts
  '1': {
    id: '1',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'ef... zjemzjnezjnezjp ejenjb zjebnjz es zenjbc zjeb vjzbe vjz\n\nJuste quelques mots pour tester la fonctionnalité de publication. Parfois il faut juste écrire quelque chose pour voir comment ça rend !',
    likes: 3100,
    comments: 22,
    shares: 5,
    timestamp: '2h',
    location: 'New York, USA',
    tags: ['#design', '#test', '#nyc']
  },
  '2': {
    id: '2',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Man, you\'re my new guru! Viewing the lessons for a second time. Thoroughly pleased. And impressed that you draw from scientific literature in telling memorable...\n\nContinuing to learn and grow every day. The journey of knowledge never ends, and I\'m grateful for all the inspiring content creators out there sharing their wisdom.',
    likes: 3100,
    comments: 22,
    shares: 8,
    timestamp: '4h',
    location: 'New York, USA',
    tags: ['#learning', '#inspiration', '#growth', '#wisdom']
  },
  '3': {
    id: '3',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Ma nouvelle création à partager en famille !!\n\nJ\'ai passé des heures à travailler sur ce projet, et je suis vraiment fier du résultat. C\'est incroyable ce qu\'on peut accomplir avec de la passion et de la persévérance.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    likes: 3100,
    comments: 22,
    shares: 15,
    timestamp: '6h',
    location: 'New York, USA',
    tags: ['#création', '#famille', '#art', '#passion'],
    price: '30 €'
  },
  
  // Explorer feed posts
  'e1': {
    id: 'e1',
    user: {
      id: 'c3',
      name: 'Travel Explorer',
      handle: '@travelexplorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: '🌍 Découvrez les merveilles cachées de l\'Islande ! Ces paysages à couper le souffle vous laisseront sans voix.\n\nCette photo a été prise au lever du soleil près du lac Jökulsárlón. Un moment magique que je n\'oublierai jamais !',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    likes: 8200,
    comments: 156,
    shares: 89,
    timestamp: '1h',
    location: 'Jökulsárlón, Islande',
    tags: ['#islande', '#voyage', '#paysage', '#aurore']
  },
  'e2': {
    id: 'e2',
    user: {
      id: 'c2',
      name: 'Food Lover',
      handle: '@foodlover',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Recette du jour : Tarte aux pommes traditionnelle française 🥧 Parfaite pour les soirées d\'automne !\n\nUne recette transmise de génération en génération dans ma famille. Le secret ? Des pommes bien mûres et une pâte brisée maison.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop',
    likes: 2400,
    comments: 89,
    shares: 34,
    timestamp: '3h',
    location: 'Paris, France',
    tags: ['#cuisine', '#tarte', '#pommes', '#tradition'],
    price: '25 €'
  },
  'e3': {
    id: 'e3',
    user: {
      id: 'c4',
      name: 'Tech Guru',
      handle: '@techguru',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'Les nouvelles tendances en IA révolutionnent notre façon de travailler. Voici 5 outils que tout développeur devrait connaître en 2024 💻\n\n1. GitHub Copilot\n2. ChatGPT\n3. Midjourney\n4. Claude\n5. Stable Diffusion\n\nQuel est votre préféré ?',
    likes: 5600,
    comments: 234,
    shares: 78,
    timestamp: '5h',
    location: 'San Francisco, USA',
    tags: ['#IA', '#technologie', '#développement', '#2024']
  },
  'e4': {
    id: 'e4',
    user: {
      id: 'c1',
      name: 'Art Studio',
      handle: '@artstudio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Nouvelle œuvre terminée ! Peinture à l\'huile sur toile, inspirée des couchers de soleil méditerranéens 🎨\n\nCette pièce représente 3 mois de travail intensif. Chaque coup de pinceau raconte une histoire, chaque couleur évoque une émotion.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    likes: 1800,
    comments: 67,
    shares: 23,
    timestamp: '8h',
    location: 'Nice, France',
    tags: ['#art', '#peinture', '#méditerranée', '#coucher_de_soleil'],
    price: '450 €'
  },
  'e5': {
    id: 'e5',
    user: {
      id: 'c4',
      name: 'Fitness Coach',
      handle: '@fitnesscoach',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: '💪 Séance du matin terminée ! 45 minutes d\'entraînement intense. Qui me rejoint demain à 7h pour une session de groupe ?\n\nRien de mieux qu\'un bon workout pour commencer la journée avec énergie. Le sport, c\'est la santé !',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    likes: 920,
    comments: 43,
    shares: 12,
    timestamp: '10h',
    location: 'Los Angeles, USA',
    tags: ['#fitness', '#sport', '#motivation', '#santé']
  },

  // Legacy post IDs for backward compatibility
  'p1': {
    id: 'p1',
    user: {
      id: 'c1',
      name: 'Marie Dubois',
      handle: '@mariedubois',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'Magnifique coucher de soleil aujourd\'hui ! La nature nous offre toujours les plus beaux spectacles. 🌅\n\nJ\'ai pris cette photo lors de mon voyage en Islande le mois dernier. Les couleurs étaient absolument incroyables !',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    likes: 1250,
    comments: 34,
    shares: 12,
    timestamp: '8h',
    location: 'Reykjavik, Islande',
    tags: ['#islande', '#coucher_de_soleil', '#voyage', '#nature']
  },
  'p2': {
    id: 'p2',
    user: {
      id: 'c2',
      name: 'Chef Antoine',
      handle: '@chefantoine',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Risotto aux champignons et truffe noire 🍄\n\nRecette traditionnelle de ma grand-mère avec une touche moderne. Le secret ? Laisser mijoter doucement et ajouter le bouillon petit à petit.\n\nDisponible ce soir uniquement au restaurant !',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
    likes: 2400,
    comments: 89,
    shares: 45,
    timestamp: '4h',
    location: 'Lyon, France',
    tags: ['#cuisine', '#risotto', '#truffe', '#restaurant']
  }
};

const sampleComments = [
  {
    id: 'c1',
    user: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    content: 'Magnifique photo ! 😍',
    timestamp: '2h',
    likes: 5
  },
  {
    id: 'c2',
    user: {
      name: 'Pierre Durand',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    content: 'J\'aimerais tellement visiter l\'Islande un jour !',
    timestamp: '1h',
    likes: 3
  },
  {
    id: 'c3',
    user: {
      name: 'Emma Leclerc',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    },
    content: 'Quels réglages as-tu utilisé pour cette photo ?',
    timestamp: '45min',
    likes: 1
  }
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(sampleComments);

  const post = postDetails[id as string];

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
    setLikeCount(post.likes);
  }, [post.likes]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: `c${comments.length + 1}`,
        user: {
          name: 'Vous',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
        },
        content: comment.trim(),
        timestamp: 'maintenant',
        likes: 0
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication</Text>
        <TouchableOpacity style={styles.moreIcon}>
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
                <Text style={styles.postTimestamp}>{post.timestamp} • {post.location}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Suivre</Text>
            </TouchableOpacity>
          </View>

          {/* Post Image */}
          {post.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
            </View>
          )}

          {/* Post Content */}
          <View style={[
            styles.postContent,
            !post.image && styles.postContentNoImage
          ]}>
            <Text style={styles.postText}>{post.content}</Text>
            
            {/* Tags */}
            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <FontAwesome 
                  name={isLiked ? "heart" : "heart-o"} 
                  size={24} 
                  color={isLiked ? "#FF4444" : "#8B7355"} 
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
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' }} 
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
            <FontAwesome name="send" size={16} color={comment.trim() ? "#FF8C42" : "#8B7355"} />
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
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  moreIcon: {
    padding: 8,
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
