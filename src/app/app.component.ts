import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject,Subscription, ReplaySubject } from 'rxjs';

const SNOWMAN_IMAGE = '..\\assets\\icons\\snowman image.jpg';
const SUN_IMAGE = '..\\assets\\icons\\sun.jpg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inputTemperature = 0;
  originalTemperature = 0;
  displayTemperatureText = "";
  temperatureDataList: any[] = [];
  imageSrc = SUN_IMAGE;
  isCelsius = false;
  temparatureSubject$ = new BehaviorSubject<number>(72); 
  newTemperatureSubject$ = new Subject<number>(); //no need to initialzie like above
  newReplayTemperatureSubject$ = new ReplaySubject<number>();
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
  }

  setTemperature() {
    this.temparatureSubject$.next(this.inputTemperature);
    this.originalTemperature = this.inputTemperature;
    this.newTemperatureSubject$.next(this.originalTemperature);
    let temp = this.inputTemperature;
    this.newReplayTemperatureSubject$.next(temp);
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
}
