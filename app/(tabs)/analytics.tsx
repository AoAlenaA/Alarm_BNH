import { Text, View,  StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>verra</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#1A293C',
    fontFamily: "Inter",
    fontWeight: "bold"
  },
});
