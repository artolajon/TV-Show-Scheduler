export class Functions {

    static getDataFromForm<T>(e: SubmitEvent, name:string): T{
        let formData = new FormData(e.target as HTMLFormElement); 
        return formData.get(name) as T;
    }

    static parseDate(date: Date): string{
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();

        let result =`${day < 10 ? '0'+day:day}/${month < 10 ? '0'+month:month}`;
        if (year != new Date().getFullYear()){
            result += `/${year}`;
        }

        return result;
    }
    static parseDateToArray(date: Date): number[]{
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        

        return [year, month, day, 0,0];
    }
}