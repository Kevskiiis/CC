import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens:
import PrivateScreenTemplate from "../screens/Templates/PrivateScreenTemplate";

// Route Params:
export type PrivateRoutesStackParams = {
  'PrivateScreenTemplates': undefined;
}

// Navigator:
const Stack = createNativeStackNavigator<PrivateRoutesStackParams>(); 

function PrivateRoutes () { 
    return (
        <Stack.Navigator initialRouteName='PrivateScreenTemplates'>
            <Stack.Screen
                name="PrivateScreenTemplates"
                component={PrivateScreenTemplate}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}
export default PrivateRoutes;