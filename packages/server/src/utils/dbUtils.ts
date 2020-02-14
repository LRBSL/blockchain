export class DbDate {
    private _date: string = null;

    constructor(date: Date) {
        this._date = this.dateConversion(date);
    }

    public getDate(): string {
        return this._date;
    }

    public setDate(date: Date): void {
        this._date = this.dateConversion(date);
    }

    private dateConversion(date: Date): string {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}