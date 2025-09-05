# DÖM - Social Commerce Platform

A modern mobile social network application that combines social media features with e-commerce functionality, built with React Native and Expo.

## 🌟 Features

### Social Media
- **Feed System**: Browse posts from followed users and discover new content through the Explorer feed
- **Content Creation**: Create rich posts with text, images, videos, product listings, and polls
- **Interactions**: Like, comment, and share posts with smooth animations
- **User Profiles**: View and navigate to user profiles
- **Real-time Messaging**: Chat system with message notifications

### E-Commerce Integration
- **Product Posts**: Share products directly in social feed with pricing
- **Shopping Cart**: Browse and purchase items
- **Order Management**: Track and manage orders through settings
- **Product Management**: Sellers can manage their products

### User Experience
- **Authentication**: Email and social login (Google, Facebook)
- **Onboarding**: Smooth user setup flow for new accounts
- **Search**: Discover users and content
- **Notifications**: Stay updated with app activities
- **Settings**: Comprehensive user preferences and account management

## 🚀 Tech Stack

- **Framework**: React Native with Expo (~53.0.22)
- **Language**: TypeScript (~5.8.3)
- **Navigation**: Expo Router (~5.1.5) with file-based routing
- **Styling**: StyleSheet API with custom color system
- **Icons**: FontAwesome icons (@expo/vector-icons)
- **Testing**: Jest with @testing-library/react-native
- **Package Manager**: PNPM (10.15.1+)
- **Code Formatting**: Prettier


### Key Components
- **Post.tsx**: Interactive post component with like/comment/share functionality
- **Themed Components**: Dark/light theme support
- **Color System**: Consistent warm color palette with orange (#FF8C42) accent

## 🛠 Installation & Setup

### Prerequisites
- Node.js (18+ recommended)
- PNPM package manager
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dom-front
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm start
   ```

### Platform-specific Development

- **iOS**: `pnpm ios`
- **Android**: `pnpm android`  
- **Web**: `pnpm web`

## 🧪 Testing

Run the test suite:
```bash
# Watch mode (development)
pnpm test

# CI mode (one-time run)
pnpm test:ci
```

## 📝 Code Quality

**Formatting**:
```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

The project uses Prettier for consistent code formatting across the codebase.

## 🎨 Design System

### Color Palette
- **Primary**: #FF8C42 (Orange accent)
- **Background Light**: #F5F0E8 (Warm beige)
- **Background Dark**: #2C1810 (Dark brown)
- **Text Primary**: #2C1810 / #F5F0E8 (theme dependent)
- **Text Secondary**: #8B7355 (Muted brown)

### Typography
- **Primary Font**: System default with SpaceMono for special cases
- **Sizing**: Responsive text scaling for mobile devices

## 🌍 Internationalization

The app currently features a **French interface** with:
- French UI labels and placeholders
- Localized content creation flows
- French social interaction terms

## 📦 Key Dependencies

### Production
- **expo**: ~53.0.22 (Core framework)
- **react**: 19.0.0 (UI library)
- **react-native**: 0.79.6 (Mobile platform)
- **expo-router**: ~5.1.5 (Navigation)
- **react-native-reanimated**: ~3.17.4 (Animations)

### Development
- **typescript**: ~5.8.3 (Type checking)
- **jest**: ^29.2.1 (Testing framework)
- **prettier**: ^3.6.2 (Code formatting)
- **@testing-library/react-native**: ^13.3.3 (Testing utilities)

## 🔧 Configuration

### App Configuration (`app.json`)
- **Name**: Dom
- **Slug**: dom-social-network
- **Scheme**: domfront
- **New Architecture**: Enabled
- **Platform Support**: iOS, Android, Web

### TypeScript Configuration
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` for root imports
- **Expo Types**: Included

## 🚦 Development Workflow

1. **Development**: Use `pnpm start` and select your preferred platform
2. **Feature Development**: Create components in `components/` directory
3. **New Screens**: Add to appropriate directory under `app/`
4. **Testing**: Write tests in `__tests__/` directories or `.test.tsx` files
5. **Code Quality**: Run `pnpm format` before commits

## 📱 Platform Compatibility

- **iOS**: Full support with tablet compatibility
- **Android**: Edge-to-edge design support
- **Web**: Progressive Web App capabilities with Metro bundler

## 🎯 Future Enhancements

Based on the current codebase structure, planned features may include:
- Enhanced e-commerce checkout flow
- Advanced messaging features
- Extended social features (stories, groups)
- Analytics and insights
- Advanced notification system

---

**Built with ❤️ using React Native and Expo**

For more information about the Expo framework, visit [expo.dev](https://expo.dev).
