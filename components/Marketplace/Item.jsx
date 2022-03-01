import { useContext, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../Reusable/Button';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import deleteItem from '../../utils/deleteItem';
import { UserContext } from '../../contexts/UserContext';
import { dateFormatter } from '../../utils/dateFormatter';

const Item = ({ route }) => {
  const navigation = useNavigation();
  const item = route.params;
  const [id, setId] = useState(item.id);
  const { isLoggedIn } = useContext(UserContext);

  const deleteItemHandler = async () => {
    await deleteItem(id)
      .then(() => {
        navigation.navigate('My List');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToLoginHandler = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.itemContainer}>
      <Image style={styles.itemImage} source={{ uri: item.img }} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <View style={styles.swapContainer}>
        <Text style={styles.itemUsername}>{item.username}</Text>
        <Text>{dateFormatter(item.posted_at)}</Text>
      </View>
      {!isLoggedIn ? (
        <TouchableOpacity onPress={goToLoginHandler}>
          <Text style={styles.register}>
            Please login or register to offer swap
          </Text>
        </TouchableOpacity>
      ) : auth.currentUser.displayName === item.username ? (
        <Button btnText={'Delete Item'} onSubmit={deleteItemHandler} />
      ) : (
        <Button btnText={'Offer Swap'} />
      )}
      <Text style={styles.itemDescription}>{item.description}</Text>
    </SafeAreaView>
  );
};

export default Item;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: '5%',
    backgroundColor: '#fff',
  },
  itemImage: {
    width: '100%',
    height: '35%',
    borderRadius: 5,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc9c9',
  },
  itemTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 28,
  },
  itemCategory: {
    marginBottom: 60,
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  swapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemUsername: {
    fontSize: 20,
  },
  itemDescription: {
    marginTop: 20,
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
  },
  register: {
    marginVertical: 10,
    fontSize: 17,
    textAlign: 'center',
    color: '#0000ff',
  },
});