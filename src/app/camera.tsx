import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const canUseCamera = useMemo(() => {
    if (!permission) return false;
    return permission.granted;
  }, [permission]);

  const onTakePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        setPreviewUri(photo.uri);
        // TODO: route back with result if needed
        console.log('Photo captured:', photo.uri);
      }
    } catch (e) {
      console.warn('takePicture error', e);
    }
  };

  const onOpenGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setPreviewUri(res.assets[0].uri);
        console.log('Gallery image:', res.assets[0].uri);
      }
    } catch (e) {
      console.warn('image picker error', e);
    }
  };

  const onFlip = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));

  if (!permission) {
    return <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.permTitle}>Autoriser l'accès à la caméra</Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Autoriser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permButton, { backgroundColor: '#E0E0E0', marginTop: 8 }]} onPress={() => router.back()}>
          <Text style={[styles.permButtonText, { color: '#2C1810' }]}>Annuler</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {previewUri ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: previewUri }} style={{ flex: 1 }} resizeMode="cover" />
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 6), paddingTop: 6}]}> 
            <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#FFFFFF' }]} onPress={() => setPreviewUri(null)}>
              <FontAwesome name="arrow-left" size={18} color="#2C1810" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainButton} onPress={() => { router.back(); }}>
              <Text style={styles.saveText}>Envoyer</Text>
            </TouchableOpacity>
            <View style={styles.smallButtonPlaceholder} />
          </View>
        </View>
      ) : (
        <>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 6), paddingTop: 6 }]}> 
            <TouchableOpacity style={styles.smallButton} onPress={onOpenGallery}>
              <FontAwesome name="image" size={20} color="#2C1810" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={onTakePicture} />
            <TouchableOpacity style={styles.smallButton} onPress={onFlip}>
              <FontAwesome name="refresh" size={20} color="#2C1810" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  smallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonPlaceholder: {
    width: 48,
    height: 48,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FF8C42',
  },
  permTitle: {
    color: '#2C1810',
    fontSize: 16,
    marginBottom: 12,
  },
  permButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  mainButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 24,
  },
  saveText: {
    color: '#FFF',
    fontWeight: '600',
  },
});


