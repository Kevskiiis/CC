// import { Appbar, Button, IconButton, TextInput, List, Modal, Portal, ActivityIndicator, MD2Colors, Menu } from "react-native-paper";
// import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { responsive } from "../utils/responsive";
// import * as ImagePicker from 'expo-image-picker';
// import * as SecureStore from 'expo-secure-store';
// import ErrorBox from "./ErrorBox";
// import SuccessBox from "./SuccessBox";
// import { COLORS } from "../themes/colors";

// type post = {
//     communityID: number | null; 
//     communityName: string | null;
//     postTitle: string;
//     postDescription: string;
//     postImage: string | null;
// }

// function PostModal({ isVisible, hideModal }: { isVisible: boolean, hideModal: () => void }) {
//     const [postForm, setPostForm] = useState<post>({
//         communityID: null,
//         communityName: null,
//         postTitle: '',
//         postDescription: '',
//         postImage: null
//     });

//     const [communities, setCommunities] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState({ errorState: false, message: '' });

//     // Menu state
//     const [menuVisible, setMenuVisible] = useState(false);

//     const openMenu = () => setMenuVisible(true);
//     const closeMenu = () => setMenuVisible(false);

//     // Get communities once when modal opens
//     useEffect(() => {
//         if (isVisible) getCommunities();
//     }, [isVisible]);

//     const pickImage = async () => {
//         const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!permission.granted) return;

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setPostForm(prev => ({ ...prev, postImage: result.assets[0].uri }));
//         }
//     }

//     const getCommunities = async () => {
//         try {
//             setIsLoading(true);
//             setError({ errorState: false, message: '' });

//             const accessToken = await SecureStore.getItemAsync('access_token');
//             const result = await axios.get('https://ccbackend-production-5adb.up.railway.app/get-user-communities', {
//                 headers: { Authorization: accessToken }
//             });

//             const data = result.data;

//             if (data.success) {
//                 setCommunities(data.communities || []);
//             } else {
//                 setCommunities([]);
//                 setError({ errorState: true, message: data.message });
//             }

//             setIsLoading(false);
//         } catch (err: any) {
//             setIsLoading(false);
//             setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
//         }
//     }

//     const createPost = async () => {
//         try {
//             setIsLoading(true);
//             setError({ errorState: false, message: '' });
//             const accessToken = await SecureStore.getItemAsync('access_token');

//             const formData = new FormData();

//             // Append text fields
//             formData.append("firstName", registerForm.firstName);
//             formData.append("lastName", registerForm.lastName);
//             formData.append("email", registerForm.email);
//             formData.append("password", registerForm.password);

//             // Append avatar if it exists
//             if (registerForm.avatar) {
//                 const fileName = registerForm.avatar.split("/").pop(); // Extract filename
//                 const match = /\.(\w+)$/.exec(fileName ?? "");
//                 const type = match ? `image/${match[1]}` : `image`;

//                 formData.append("avatarImage", {
//                     uri: registerForm.avatar,
//                     name: fileName,
//                     type: type,
//                 } as any); // `as any` to satisfy TypeScript
//             }

//             // Send to backend
//             const response = await fetch("https://ccbackend-production-5adb.up.railway.app/create-post", {
//                 method: "POST",
//                 body: formData,
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             if (data.success) {                
//                 // Set error back to false if it was set:
//                 if (error.errorState === true) {
//                     setError({
//                         errorState: false,
//                         message: ""
//                     })
//                 }

//                 // Display success message:
//                 setIsLoading(false)

//                 // Handle success & pause for two seconds:
//                 setTimeout(()=> {
//                     navigation.replace("LoginScreen");
//                 }, 3000)
//             }
//             else {
//                 // Handle Error Case:
//                 setIsLoading(false); 
//                 setError({
//                     errorState: true,
//                     message: data.message
//                 })
//             }
//         }   
//         catch (err: any) {
//             setIsLoading(false);
//             setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
//         }
//     }
    
//     const handleCommunitySelect = (community: any) => {
//         setPostForm(prev => ({
//             ...prev,
//             communityID: community.community_id,
//             communityName: community.community_name
//         }));
//         closeMenu();
//     }

//     const handleChange = (inputName: string, newText: string) => {
//         setPostForm(prev => ({ ...prev, [inputName]: newText }));
//     }
    
//     return (
//         <Portal>
//             <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={postModalStyles.modal}>
//                 <ScrollView  contentContainerStyle={{ paddingBottom: responsive.number(20) }} showsVerticalScrollIndicator>
//                     {error.errorState && <ErrorBox message={error.message} width={297}/>}
//                     {isLoading && <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size={responsive.number(60)}/>}

//                     {/* Community Dropdown */}
//                     <Menu
//                         visible={menuVisible}
//                         onDismiss={closeMenu}
//                         anchor={
//                             <Button mode="outlined" onPress={openMenu} style={{ marginBottom: responsive.number(10) }}>
//                                 {postForm.communityName || "Select Community"}
//                             </Button>
//                         }
//                     >
//                         {communities.length > 0 ? communities.map((community) => (
//                             <Menu.Item
//                                 key={community.community_id}
//                                 onPress={() => handleCommunitySelect(community)}
//                                 title={community.community_name}
//                             />
//                         )) : <Text style={{ padding: 10 }}>No communities found</Text>}
//                     </Menu>

//                     {/* Post title -> user input */}
//                     <TextInput
//                         label="Post Title"
//                         value={postForm.postTitle}
//                         onChangeText={text => handleChange('postTitle', text)}
//                         style={{ marginBottom: responsive.number(10) }}
//                     />

//                     {/* Post Description -> user input */}
//                     <TextInput
//                         label="Post Description"
//                         value={postForm.postDescription}
//                         onChangeText={text => handleChange('postDescription', text)}
//                         multiline
//                         numberOfLines={4}
//                         style={{ marginBottom: responsive.number(10) }}
//                     />

//                     {/* Post Image -> optional */}
//                     {postForm.postImage && (
//                         <Image
//                             source={{ uri: postForm.postImage }}
//                             style={{ width: responsive.number(297), height: responsive.number(120), marginBottom: 10 }}
//                         />
//                     )}

//                     <TouchableOpacity
//                         style={{
//                             padding: responsive.number(10),
//                             backgroundColor: '#ddd',
//                             alignItems: 'center',
//                             borderRadius: responsive.number(5),
//                             marginBottom: responsive.number(10)
//                         }}
//                         onPress={pickImage}
//                     >
//                         <Text>Select Image</Text>
//                     </TouchableOpacity>

//                     <Button textColor={COLORS.primaryText} style={{backgroundColor: COLORS.primary}} mode="contained" onPress={() => console.log(postForm)}>
//                         Submit Post
//                     </Button>
//                 </ScrollView>
//             </Modal>
//         </Portal>
//     )
// }

// export default PostModal;

// const postModalStyles = StyleSheet.create({
//     modal: {
//         borderRadius: responsive.number(15),
//         padding: responsive.number(15),
//         width: responsive.number(320),
//         maxHeight: responsive.number(520),
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         alignSelf: 'center'
//     },
// });


import { Button, IconButton, TextInput, Modal, Portal, ActivityIndicator, MD2Colors, Menu, Text } from "react-native-paper";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { responsive } from "../utils/responsive";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";
import { COLORS } from "../themes/colors";

type post = {
  communityID: number | null; 
  communityName: string | null;
  postTitle: string;
  postDescription: string;
  postImage: string | null;
}

function PostModal({ isVisible, hideModal }: { isVisible: boolean, hideModal: () => void }) {
  const [postForm, setPostForm] = useState<post>({
    communityID: null,
    communityName: null,
    postTitle: '',
    postDescription: '',
    postImage: null
  });

  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState({ errorState: false, message: '' });
  const [success, setSuccess] = useState({ successState: false, message: '' });

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Fetch communities when modal opens
  useEffect(() => {
    if (isVisible) getCommunities();
  }, [isVisible]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPostForm(prev => ({ ...prev, postImage: result.assets[0].uri }));
    }
  }

  const getCommunities = async () => {
    try {
      setIsLoading(true);
      setError({ errorState: false, message: '' });

      const accessToken = await SecureStore.getItemAsync('access_token');
      const result = await axios.get('https://ccbackend-production-5adb.up.railway.app/get-user-communities', {
        headers: { Authorization: accessToken }
      });

      const data = result.data;

      if (data.success) setCommunities(data.communities || []);
      else setError({ errorState: true, message: data.message });

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
    }
  }

  const handleCommunitySelect = (community: any) => {
    setPostForm(prev => ({
      ...prev,
      communityID: community.community_id,
      communityName: community.community_name
    }));
    closeMenu();
  }

  const handleChange = (inputName: string, newText: string) => {
    setPostForm(prev => ({ ...prev, [inputName]: newText }));
  }

  const createPost = async () => {
    if (!postForm.communityID || !postForm.postTitle || !postForm.postDescription) {
      setError({ errorState: true, message: 'Please fill all required fields' });
      return;
    }

    try {
      setIsLoading(true);
      setError({ errorState: false, message: '' });
      setSuccess({ successState: false, message: '' });

      const accessToken = await SecureStore.getItemAsync('access_token');
      const formData = new FormData();

      formData.append("communityID", String(postForm.communityID));
      formData.append("communityName", String(postForm.communityName));
      formData.append("postTitle", postForm.postTitle);
      formData.append("postDescription", postForm.postDescription);

      if (postForm.postImage) {
        const fileName = postForm.postImage.split("/").pop();
        const match = /\.(\w+)$/.exec(fileName ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("postImage", {
          uri: postForm.postImage,
          name: fileName,
          type: type,
        } as any);
      }

      const response = await fetch("https://ccbackend-production-5adb.up.railway.app/create-post", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: String(accessToken)
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsLoading(false);
        setSuccess({ successState: true, message: "Post created successfully!" });
        // Reset form after success
        setPostForm({
          communityID: null,
          communityName: null,
          postTitle: '',
          postDescription: '',
          postImage: null
        });
      } else {
        setIsLoading(false);
        setError({ errorState: true, message: data.message });
      }
    } catch (err: any) {
      setIsLoading(false);
      setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
    }
  }

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={postModalStyles.modal}>
        <ScrollView contentContainerStyle={{ paddingBottom: responsive.number(20) }} showsVerticalScrollIndicator>
          {error.errorState && <ErrorBox message={error.message} width={297}/>}
          {success.successState && <SuccessBox message={success.message} width={297}/>}
          {isLoading && <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size={responsive.number(60)}/>}

          {/* Community Dropdown */}
          <View style={{ marginBottom: responsive.number(10) }}>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <Button mode="outlined" onPress={() => setMenuVisible(prev => !prev)}>
                  {postForm.communityName || "Select Community"}
                </Button>
              }
            >
              {communities.length > 0 ? communities.map((community) => (
                <Menu.Item
                  key={community.community_id}
                  onPress={() => handleCommunitySelect(community)}
                  title={community.community_name}
                />
              )) : <Text style={{ padding: 10 }}>No communities found</Text>}
            </Menu>
          </View>

          {/* Post Title */}
          <TextInput
            label="Post Title"
            value={postForm.postTitle}
            onChangeText={text => handleChange('postTitle', text)}
            style={{ marginBottom: responsive.number(10) }}
          />

          {/* Post Description */}
          <TextInput
            label="Post Description"
            value={postForm.postDescription}
            onChangeText={text => handleChange('postDescription', text)}
            multiline
            numberOfLines={4}
            style={{ marginBottom: responsive.number(10) }}
          />

          {/* Post Image */}
          {postForm.postImage && (
            <Image
              source={{ uri: postForm.postImage }}
              style={{ width: responsive.number(297), height: responsive.number(120), marginBottom: 10 }}
            />
          )}

          <TouchableOpacity
            style={{
              padding: responsive.number(10),
              backgroundColor: '#ddd',
              alignItems: 'center',
              borderRadius: responsive.number(5),
              marginBottom: responsive.number(10)
            }}
            onPress={pickImage}
          >
            <Text>Select Image</Text>
          </TouchableOpacity>

          <Button textColor={COLORS.primaryText} style={{backgroundColor: COLORS.primary}} mode="contained" onPress={createPost}>
            Submit Post
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  )
}

export default PostModal;

const postModalStyles = StyleSheet.create({
  modal: {
    borderRadius: responsive.number(15),
    padding: responsive.number(15),
    width: responsive.number(320),
    maxHeight: responsive.number(520),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignSelf: 'center'
  },
});
