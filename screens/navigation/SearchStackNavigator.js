import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../search/SearchScreen';
import KeywordList from '../search/KeywordList';

const SearchStack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
};

export default SearchStackNavigator;
