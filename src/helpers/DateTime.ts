import { isArray } from "util";

export class DateTime {
  private options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  private date: string = ''
  private time: string = ''
  private fullTime: string = ''
  private today: boolean
  constructor(dateTime: string) {
    if(Array.isArray(dateTime)){
      dateTime = `${dateTime[0]}-${dateTime[1]}-${dateTime[2]}T${dateTime[3]}:${dateTime[4]}:${dateTime[5]}:${dateTime[6]}`
    }
    const dt: string[] = dateTime.split('T');
    this.date = new Date(dt[0]).toLocaleDateString('uk-UA', this.options);
    this.time = dt[1].slice(0, 5);
    this.fullTime = dt[1];
    this.today = new Date(dateTime).getDate() === new Date(Date.now()).getDate();
  }
  get getDate(): string { return this.date; }
  get getFullTime(): string { return this.fullTime; }
  get getTime(): string { return this.time; }
  get isToday(): boolean { return this.today }
}

