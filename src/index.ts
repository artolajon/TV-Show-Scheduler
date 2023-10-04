import { Functions } from './app/helpers/functions';
import { Service } from './app/service';
import './app/style.scss';

const service = new Service();

service.createPagination();
service.addValidations();

document.getElementById("form-title").addEventListener('submit',(e)=> {
  service.currentData.title = Functions.getDataFromForm(e, "serie-title");
})

document.getElementById("form-episodes").addEventListener('submit',(e)=> {
  service.currentData.episodeNumber = Functions.getDataFromForm(e, "episode-number");
  const viewed: number = Functions.getDataFromForm(e, "episode-number-viewed");
  service.currentData.episodeNumberViewed = Number(viewed);
})

document.getElementById("form-date").addEventListener('submit',(e)=> {
  service.currentData.endDate = new Date(Functions.getDataFromForm(e, "before-date"));
  service.calculateDefault()
})

document.querySelectorAll(".recalculate-trigger").forEach(input=>{

  input.addEventListener('change', (e)=>{
    const inputEL = e.target as HTMLInputElement;
    if (inputEL.name=="velocity"){
      service.currentData.velocity =Number(inputEL.value);
    }else{
      service.currentData.periodicity =inputEL.value;
    }
    service.recalculate()
  });
});
document.getElementById("generate").addEventListener('click',(e)=> {
  service.generateFile()
})


//document.getElementById("form-velocity").addEventListener('submit',(e)=> service.printResult())