import { Dimensions } from 'react-native';
 
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
 
const BaseWidth = 375;
 
const scale = (size: number) => (deviceWidth / BaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor;
 
export const responsive = {
    fontSize: (size: number) => moderateScale(size, 1),
    number: (n: number) => moderateScale(n, 1),
    deviceWidth,
    deviceHeight,
};