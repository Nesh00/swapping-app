import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import Logo from '../Home/Logo';
import Button from '../Reusable/Button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, upload } from '../../firebase';
import { formatErrorMsg } from '../Error';

const { width } = Dimensions.get('screen');

const onTermsOfUsePressed = () => {
  console.warn("Terms of Use");
};

const onPrivacyPolicyPressed = () => {
  console.warn("Privacy Policy");
};

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [signupDetails, setSignupDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((result) => {
      if (!result.cancelled) {
        setImage(result.uri);
      }
    });
  };

  const submitHandler = () => {
    if (password2 !== password) {
      console.log("Passwords do not match");
    } else {
      setSignupDetails({
        email: email,
        username: username,
        password: password,
      });
    }
  };

  useEffect(() => {
    signupDetails &&
      createUserWithEmailAndPassword(
        auth,
        signupDetails.email,
        signupDetails.password
      )
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: signupDetails.username,
          });
          image && upload(image, auth.currentUser, setIsLoading);
        })
        .then(() => {
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log(err);
        });
  }, [signupDetails, image]);

  return (
    <KeyboardAvoidingView style={styles.registerContainer} behavior="height">
    <SafeAreaView >
      <ScrollView KeyboardDismissMode='interactive' keyboardsHoldPersist='always' >
      <Logo />
      <View style={styles.loginCard}>
        <TextInput
          value={username}
          style={styles.loginInput}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          value={email}
          style={styles.loginInput}
          placeholder="E-mail"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          value={password}
          style={styles.loginInput}
          placeholder="Enter Password"
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          value={password2}
          style={styles.loginInput}
          placeholder="Re-enter Password"
          onChangeText={(text) => setPassword2(text)}
        />
        {image ? (
          <Image style={styles.displayPic} source={{ uri: image }} />
        ) : null}
        <Button
          btnText={!image ? "Pick a display photo" : "Change photo"}
          onSubmit={pickImage}
        />
      {username && email && password && password2 ? (
        <Button btnText={"Submit"} onSubmit={submitHandler} />
      ) : null}
      <Text style={styles.text}>
        By registering, you confirm that you accept our{' '} 
        <Text style={styles.link} onPress={onTermsOfUsePressed}>
          Terms of Use{' '}
        </Text>
        and{' '}
        <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
          Privacy Policy
        </Text>
      </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    backgroundColor: "lightgrey",
  },
  loginCard: {
    alignItems: 'center',
    width: width-35,
    marginTop: 10,
  },
  loginInput: {
    width: '90%',
    marginBottom: 18,
    padding: 9,
    fontSize: 17,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    borderColor: "#ccc9c9",
  },
  text: {
    color: "grey",
    marginVertical: 10,
  },
  link: {
    color: "red",
  },
  displayPic: {
    height: 100,
    width: 100,
    marginBottom: 10,
    borderColor: "blue",
    borderWidth: 2,
    borderRadius: 50,
  },
});
