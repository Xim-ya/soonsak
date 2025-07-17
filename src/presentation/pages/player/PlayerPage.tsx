import { View, Text, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../shared/navigation/types';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type PlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

interface PlayerScreenProps {
  route: PlayerScreenRouteProp;
}

export default function PlayerPage({ route }: PlayerScreenProps) {
  const { id } = route.params;
  const navigation = useNavigation<PlayerScreenNavigationProp>();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Screen</Text>
      <Text style={styles.contentId}>Content ID: {id}</Text>

      <Button title="뒤로 가기" onPress={goBack} />

      {/* 여기에 실제 플레이어 컴포넌트가 들어갈 예정 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentId: {
    fontSize: 16,
    marginBottom: 40,
  },
});
