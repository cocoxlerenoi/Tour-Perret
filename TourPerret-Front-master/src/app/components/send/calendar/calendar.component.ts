import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from '../../../services/utils.class';

@Component({
    selector: 'my-calendar',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.scss']
})

export class CalendarComponent implements OnInit {

    readonly moisNom: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    readonly joursNom: string[] = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    readonly daysInMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    @Input() year: number = null;
    @Input() month: number = null;
    @Input() min: Date = null;
    @Input() max: Date = null;

    @Output() onDateClicked: EventEmitter<Date> = new EventEmitter();
    @Output() onCalendarChanged: EventEmitter<number[]> = new EventEmitter();

    private weekStartsOn: number = 1;
    days: Date[] = [];
    start: Date;
    private selected: Date = null;

    constructor() { }

    ngOnInit() {
        const today: Date = Utils.getOnlyDate(new Date());

        if (this.min != null) {
            this.click(this.min);
        } else if (this.max == null || this.isDateInf(today, this.max)) {
            this.click(today);
        }

        this.initCalendar();
    }

    click(dateClicked: Date): void {
        this.selected = dateClicked;
        this.onDateClicked.emit(new Date(dateClicked));
    }

    private initCalendar(year: number = null, month: number = null): void {
        const today: Date = Utils.getOnlyDate(new Date());

        if (year === null) {
            this.year = today.getFullYear();
        } else {
            this.year = year;
        }

        if (month === null) {
            this.month = today.getMonth();
        } else {
            this.month = month;
        }

        this.onCalendarChanged.emit([this.year, this.month]);

        let monthLength = this.daysInMonth[this.month];

        // Figure out if is a leap year.
        if (this.month === 1) {
            if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0) {
                monthLength = 29;
            }
        }

        this.start = new Date(this.year, this.month, 1);

        const date = new Date(this.start);
        if ( date.getDate() === 1) {
            while ( date.getDay() !== this.weekStartsOn) {
                date.setDate(date.getDate() - 1);
                monthLength++;
            }
        }

        // Last day of calendar month.
        while (monthLength % 7 !== 0) {
            monthLength++;
        }

        this.days = [];
        for (let i = 0; i < monthLength; ++i) {
            this.days.push(new Date(date));

            date.setDate(date.getDate() + 1);
        }
    }

    next(): void {
        if (this.max == null || this.max > this.start) {
            if (this.start.getMonth() < 11) {
                this.initCalendar(this.start.getFullYear(), this.start.getMonth() + 1);
            } else {
                this.initCalendar(this.start.getFullYear() + 1, 0);
            }
        }
    }

    prev(): void {
        if (this.min == null || this.min < this.start) {
            if (this.start.getMonth() > 0) {
                this.initCalendar(this.start.getFullYear(), this.start.getMonth() - 1);
            } else {
                this.initCalendar(this.start.getFullYear() - 1, 11);
            }
        }
    }

    isDateEqual(date: Date, dateOther: Date, day: boolean = false): boolean {
        return Utils.isDateEqual(date, dateOther, day);
    }

    isDateInf(date: Date, dateOther: Date): boolean {
        return Utils.isDateInf(date, dateOther);
    }

    isDateSup(date: Date, dateOther: Date): boolean {
        return Utils.isDateSup(date, dateOther);
    }
}
