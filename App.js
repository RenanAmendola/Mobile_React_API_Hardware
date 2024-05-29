import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  const handleLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de localização não concedida', 'Por favor conceda permissão de localização');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    setLocation(locationData);
  };

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor insira um título válido');
      return;
    }
    try {
      const apiKey = '1c94619c';
      const apiUrl = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buscar Filme</Text>
      <TextInput
        style={styles.input}
        placeholder='Digite o nome do filme'
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Filme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLocation}>
        <Text style={styles.buttonText}>Ver minha localização atual</Text>
      </TouchableOpacity>

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Sua localização</Text>
          <View style={styles.mapContainer}>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title='Sua localização'
              />
            </MapView>
          </View>
        </View>
      )}

      {movieData && (
        <View style={styles.movieContainer}>
          <Text style={styles.movieTitle}>{movieData.Title}</Text>
          <Text style={styles.movieInfo}>Ano: {movieData.Year}</Text>
          <View style={styles.separator} />
          <Text style={styles.movieInfo}>Gênero: {movieData.Genre}</Text>
          <View style={styles.separator} />
          <Text style={styles.movieInfo}>Diretor: {movieData.Director}</Text>
          <View style={styles.separator} />
          <Text style={styles.movieInfo}>Prêmios: {movieData.Awards}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationContainer: {
    marginVertical: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Only for Android
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapContainer: {
    width: '100%',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  movieContainer: {
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Only for Android
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
});

export default App;
