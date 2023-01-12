import {Decimal} from 'decimal.js';
import {createEvents, EventAttributes} from 'ics';
import { Functions } from './helpers/functions';
import { MarathonData } from './models/marathon-data';

export class Service {

  currentData:MarathonData = new MarathonData(); 

  createPagination(){
    let forms = document.querySelectorAll("form");
    for (let i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit", (e) => {
            e.preventDefault();
            forms[i].classList.remove("active");
            if (forms[i+1]){
              forms[i+1].classList.add("active");
            }
        });
    }
    let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", (e) => {
      forms[forms.length-1].classList.remove("active");
      forms[0].classList.add("active");

      this.currentData = new MarathonData(); 
      this.printData();
    });

  }

  async calculateDefault(){
    let availableDays = this.getAvailableDays(this.currentData.endDate);
    
    let defaultPeriodicity = availableDays > 14 ? 7:1;
    let episodeNumber= this.currentData.episodeNumber - this.currentData.episodeNumberViewed;

    let velocity=1;
    let duration, extra, startDate;
    do{

      duration = Math.floor(new Decimal(episodeNumber).div(velocity).toNumber());
      extra = new Decimal(episodeNumber).mod(velocity).toNumber();
      let requiredDays = new Decimal(duration).mul(defaultPeriodicity).toNumber();
      let temporalStartDate = new Date(this.currentData.endDate);
      temporalStartDate.setDate(temporalStartDate.getDate() - Math.ceil(requiredDays));

      if (temporalStartDate>new Date()){
        startDate = temporalStartDate;
      }else{
        velocity++;
      }

      if (velocity>100){
        throw "Couldn't calculate";
      }
    }while(startDate == null);

    this.currentData.periodicity = defaultPeriodicity == 7?"week":"day";
    this.currentData.startDate = startDate;
    this.currentData.velocity = velocity;
    this.currentData.duration = duration;
    this.currentData.extra = extra;

    this.printData();
  }

  recalculate(){
    let periodicity = this.currentData.periodicity == "week" ? 7:1;
    let beforeDate = this.currentData.endDate;
    let velocity= this.currentData.velocity;
    let episodeNumber= this.currentData.episodeNumber - this.currentData.episodeNumberViewed;
    let duration = Math.floor(new Decimal(episodeNumber).div(velocity).toNumber());
    let extra = new Decimal(episodeNumber).mod(velocity).toNumber();

    let requiredDays = new Decimal(duration).mul(periodicity).toNumber();
    
    let temporalStartDate = new Date(beforeDate);
    temporalStartDate.setDate(temporalStartDate.getDate() - Math.ceil(requiredDays));

    let startDate = temporalStartDate;
   
    this.currentData.startDate = startDate;
    this.currentData.duration = duration;
    this.currentData.extra = extra;

    this.printData();
  }


  printData(){
    let data = this.currentData;

    let inputs = {
        "serie-title":data.title,
        "episode-number":data.episodeNumber,
        "episode-number-viewed":data.episodeNumberViewed,
        "before-date":Functions.parseDateForInput(data.endDate),
        velocity: data.velocity?.toString(),
        periodicity: data.periodicity
    };

    let texts = {
      "result-title": data.title,
      "result-episodes": `${data.episodeNumber} episodes (${data.episodeNumberViewed} viewed)`,
      "result-marathon-dates": `Marathon between ${Functions.parseDate(data.startDate)} and ${Functions.parseDate(data.endDate)}`,
      "result-velocity": `${data.velocity} episodes per ${data.periodicity} for ${data.duration} ${data.periodicity}s`,
      "result-extra": `(${data.extra} episodes left)`,
    };

    Object.keys(inputs).forEach(key=>{
      let input = document.getElementById(key) as HTMLInputElement;
      input.value = inputs[key];
    });

    Object.keys(texts).forEach(key=>{
      let span = document.getElementById(key);
      span.innerText = texts[key];
    });

  }

  getAvailableDays(endDate: Date) {
    let date1 = new Date();
    let difference = endDate.getTime() - date1.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  generateFile(){
    let data = this.currentData;

    let events =[];
    let currentDay = data.endDate;
    for(let i = data.episodeNumber; i>data.episodeNumberViewed;i--){
      let end = new Date(currentDay);
      end.setDate(end.getDate() + 1);
      events.unshift({
        title: `${data.title} ${i}`,
        start: Functions.parseDateToArray(currentDay),
        end: Functions.parseDateToArray(end)
      })

      currentDay.setDate(currentDay.getDate() - (data.periodicity == "week" ? 7:1));
    }


    const { error, value } = createEvents(events as EventAttributes[]);

    this.downloadFile({
      mimeType: 'text/calendar',
      fileContents: value,
      fileName: data.title+'.ics',
  })
  }

  downloadFile(config: { fileContents: any; fileName: string; mimeType: string }) {
    const { mimeType, fileContents, fileName } = config
    const blob = new Blob([fileContents], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

}