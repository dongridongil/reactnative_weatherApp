
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const API_KEY = "74a356c9372cb999981239671eb41b82"

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}
export default function App() {
  const [city, setCity] = useState("")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  /* 유저에게 앱사용을 허락맡고 위치정보 가져오는 api */
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false)
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({
      accuracy: 5
    })

    /* 위치 정보 */
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude }
      , { useGoogleMaps: false });
    setCity(location[0].street)
    console.log(city)

    /* 날씨 api 요청*/
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();

    setDays(
      json.list
    );

  }

  /* app 컴포넌트가 마운트 될떄 앱사용 허락맡기  */
  useEffect(() => {
    getWeather()
  }, [])


  return (
    <View style={styles.container}>

      <View style={styles.city} >
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}

        contentContainerStyle={styles.weather}>

        {days.length === 0 ?

          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View> :
          (days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Text style={styles.ondo} >°C</Text>
                <Fontisto name={icons[day.weather[0].main]} size={78} color="white" style={{ marginLeft: 40 }} />

              </View>

              <Text style={styles.description}>{day.weather[0].main} </Text>
              <Text style={styles.tinyText}>{day.weather[0].description} </Text>
              <Text style={styles.date} >{day.dt_txt.toString().substring(5, 16)}</Text>
            </View>
          ))
        }

      </ScrollView >


    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",

  },
  city: {
    flex: 1.2,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    color: "white",
    fontSize: 50,
    fontWeight: "600",
    marginTop: 100

  },
  weather: {


  },
  day: {
    width: windowWidth,

  },

  temp: {
    marginLeft: 25,
    fontWeight: "600",
    marginTop: 120,
    fontSize: 90,
    color: "white",

  },
  description: {
    marginLeft: 30,
    color: "white",
    fontWeight: "500",
    marginTop: -10,
    fontSize: 30
  },
  tinyText: {
    marginLeft: 30,
    color: "white",
    fontSize: 20
  },
  date: {
    marginLeft: 30,
    fontSize: 24,
    color: "white"
  },
  ondo: {

    fontWeight: "600",
    marginTop: 40,
    fontSize: 25,
    color: "white",
  }
})