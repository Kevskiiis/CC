// Routes:
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

// Nav Container:
import { NavigationContainer } from "@react-navigation/native";

// Contexts:
import {useAuth} from "../contexts/AuthContext";

function RoutesContainer () {
    const {isAuthenticated} = useAuth(); 

    return (
        <NavigationContainer>
            {!isAuthenticated && <PublicRoutes/>}
            {isAuthenticated && <PrivateRoutes/>}
        </NavigationContainer>
    );
}
export default RoutesContainer;
