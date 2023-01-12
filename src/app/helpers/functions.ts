export class Functions {

    static getDataFromForm<T>(e: SubmitEvent, name:string): T{
        let formData = new FormData(e.target as HTMLFormElement); 
        return formData.get(name) as T;
    }

    static parseDate(date: Date): string{
        if (date){
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();

            let result =`${day < 10 ? '0'+day:day}/${month < 10 ? '0'+month:month}`;
            if (year != new Date().getFullYear()){
                result += `/${year}`;
            }

            return result;
        }
        return null;
    }

    static parseDateForInput(date: Date): string{
        if (date){
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();

            let result =`${year}-${month < 10 ? '0'+month:month}-${day < 10 ? '0'+day:day}`;

            return result;
        }
        return null;
    }
    static parseDateToArray(date: Date, isEnd = false): number[]{
        if (date){
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();

            
            if (isEnd){
                return [year, month, day, 23,0];
            }else{
                return [year, month, day, 22,0];
            }
            
        }
        return null;
    }
}