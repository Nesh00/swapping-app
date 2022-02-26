import { removeAssetsFromAlbumAsync } from 'expo-media-library';
import { deleteDoc, doc } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { useState } from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { database } from '../firebase'; 

const deleteItem = ({id}) => {
    const docRef = doc(database, 'items', id);
    deleteDoc(docRef)
      .then(() => { 
      })
      .catch((err) => {
        console.log(err);
      });
}

export default deleteItem; 