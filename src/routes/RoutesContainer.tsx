// Routes:
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

// Nav Container:
import { NavigationContainer } from "@react-navigation/native";

// React Native Paper:
import { ActivityIndicator } from "react-native-paper";

// Contexts:
import {useAuth} from "../contexts/AuthContext";

function RoutesContainer () {
    const {isAuthenticated} = useAuth(); 

    return (
        <NavigationContainer>
            {/* Add an isLoading state inside the AuthContext*/}
            {!isAuthenticated && <PublicRoutes/>}
            {isAuthenticated && <PrivateRoutes/>}
        </NavigationContainer>
    );
}
export default RoutesContainer;
