import {useNavigation as _useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootStackParamList';

export const useNavigation = () =>
  _useNavigation<NativeStackNavigationProp<RootStackParamList>>();