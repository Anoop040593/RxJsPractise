import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject,Subscription, ReplaySubject,map,filter } from 'rxjs';

const SNOWMAN_IMAGE = '..\\assets\\icons\\snowman image.jpg';
const SUN_IMAGE = '..\\assets\\icons\\sun.jpg';

interface Weather {
  day: string;
  temperature: number
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inputTemperature = 0;
  originalTemperature = 0;
  displayTemperatureText = "";
  displayWeather: Weather[] = [];
  temperatureDataList: any[] = [];
  imageSrc = SUN_IMAGE;
  isCelsius = false;
  selectedDay = 'Monday'
  weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  private weatherData = [
    {
      day: 'Monday',
      temperature: 61
    },
    {
      day: 'Tuesday',
      temperature: 72
    },
    {
      day: 'Wednesday',
      temperature: 76
    },
    {
      day: 'Thursday',
      temperature: 49
    },
    {
      day: 'Friday',
      temperature: 53
    },
    {
      day: 'Saturday',
      temperature: 62
    },
    {
      day: 'Sunday',
      temperature: 77
    },
  ]
  weatherOutput: any

  temparatureSubject$ = new BehaviorSubject<number>(72); 
  newTemperatureSubject$ = new Subject<number>(); //no need to initialzie like above
  newReplayTemperatureSubject$ = new ReplaySubject<number>();
  weatherSubject$ = new Subject<Weather>();
  newWeatherSubject = new Subject<Weather>();
  replaySubscription: Subscription|undefined;


  ngOnInit() {
    this.temparatureSubject$.subscribe((temperature) => {
      if(temperature>=40) {
        this.imageSrc = SUN_IMAGE
      } else {
        this.imageSrc = SNOWMAN_IMAGE;
      }
    });

    this.newTemperatureSubject$.subscribe((temperature) => {
      if(this.isCelsius) {
        this.displayTemperatureText = temperature + "C";
      } else {
        this.displayTemperatureText = temperature + "F";
      }
    })

    this.weatherSubject$.pipe(
    map((weather) => {
      return {
        temperature: Math.ceil(weather.temperature),
        day: weather.day
        
      }
    })).
    subscribe((weather) => {
      this.weatherOutput = weather
    });

    this.newWeatherSubject.pipe(
      filter((weather: any) => {
        return weather.temperature >= 77
      })).subscribe(weather => {
        this.displayWeather.push(weather);
      })
    
  }

  setTemperature() {
    this.temparatureSubject$.next(this.inputTemperature);
    this.originalTemperature = this.inputTemperature;
    this.newTemperatureSubject$.next(this.originalTemperature);
    let temp = this.inputTemperature;
    this.newReplayTemperatureSubject$.next(temp);
    this.weatherSubject$.next({
      temperature: this.inputTemperature,
      day: this.selectedDay
    })
  }

  convertToCelsius() {
    this.isCelsius = true;
    const celsiusTemp = ((this.inputTemperature - 32)*5)/9;
    this.newTemperatureSubject$.next(celsiusTemp);
  }

  convertToFahrenheit() {
    this.isCelsius = false;
    const fahrenTemp = ((this.inputTemperature * 9)/5) + 32;
    this.newTemperatureSubject$.next(fahrenTemp);
  }

  setInputTemperature(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.inputTemperature = parseInt(input);
  }

  addSubscription() {
    if(this.replaySubscription) {
      return;
    }
    this.temperatureDataList = [];
    this.replaySubscription = this.newReplayTemperatureSubject$.subscribe((temperature: any) => {
      this.temperatureDataList.push(temperature)
    })
  }

  removeSubscription() {
    this.temperatureDataList = [];
    this.replaySubscription?.unsubscribe();
    this.replaySubscription = undefined;
  }

  getWeatherData() {
    for(const weather of this.weatherData) {
      this.newWeatherSubject.next(weather);
    }
  }
}
