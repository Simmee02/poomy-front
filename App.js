import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './screens/navigation/AppNavigator';
import Initializer from './Initializer';
import { Toast, toastConfig } from './screens/search/Toast';
import  FavoriteProvider  from './screens/like/FavoriteContext'; 
import  ShopProvider from './screens/shop/ShopContext';
import  SpotProvider  from './screens/keyword/KeywordContext';
import  MoodProvider from './screens/keyword/MoodContext';
import  NewsLetterProvider  from './screens/context/NewsLetterContext';
import SearchProvider from './screens/context/SearchContext';
import { SearchContext } from './screens/context/SearchContext';
import { UserProvider } from './screens/mypage/MypageEditScreen';


export default function App() {
  return (
    <SearchProvider>
    <NewsLetterProvider>
    <MoodProvider>
    <SpotProvider>
    <ShopProvider>
    <FavoriteProvider>
    <NavigationContainer>
      <Initializer />
      <AppNavigator />
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
    </FavoriteProvider>
    </ShopProvider>
    </SpotProvider>
    </MoodProvider>
    </NewsLetterProvider>
    </SearchProvider>
  );
}