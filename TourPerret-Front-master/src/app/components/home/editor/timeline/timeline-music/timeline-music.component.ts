import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MainService } from '../../../../../services/main.service';
import { saveAs } from 'file-saver';
import { ScenarioService } from '../../../../../services/scenario.service';
import { MatDialog } from '@angular/material';
import { Marker } from '../../../../../models/marker';
import { MarkerDialogComponent } from './marker-dialog/marker-dialog.component';
import { PlayerService } from '../../../../../services/player.service';

@Component({
    selector: 'my-timeline-music',
    templateUrl: './timeline-music.component.html',
    styleUrls: ['./timeline-music.component.scss']
})
export class TimelineMusicComponent {

    public markers: Marker[] = [];
    public markerMovingPos: number;

    public audioFileUrl: string = '';

    @ViewChild('markersContainer') private markersHTMLElement: ElementRef;
    @ViewChild('audioPlayer') private audioHTMLElement: ElementRef;

    constructor(scenarioService: ScenarioService, public mainService: MainService, public dialog: MatDialog, public playerService: PlayerService) {
        this.markers = scenarioService.getScenario().markers;
        if (!this.markers) {
            this.markers = scenarioService.getScenario().markers = [];
        }
    }

    @HostListener('mouseleave')
    leave() {
        this.markerMovingPos = 0;
    }

    openFileMarqueurs(event: Event) {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                reader.result.split('\n').map(m => m.split('\t')).forEach(m => {
                    const mark = new Marker(+m[0] * 1000, m.length > 2 ? m[2] : '');
                    this.markers.push(mark);
                });
            };
            reader.readAsText((event.target as HTMLInputElement).files[0]);
        } catch (e) {
            console.error(e);
        }
    }

    openFileAudio(event: Event = null) {
        if (event) {
            const file: File = (event.target as HTMLInputElement).files[0];
            if (file) {
                this.audioFileUrl = URL.createObjectURL(file);
            } else {
                this.audioFileUrl = '';
            }
        } else {
            this.audioFileUrl = '';
        }
        this.playerService.setAudioPlayer(this.audioHTMLElement.nativeElement, this.audioFileUrl);
    }

    saveFile() {
        const tempTab = this.markers.sort(function (a, b) {
            return a.time - b.time;
        });

        const markerTab = [];

        for (let i = 0; i < tempTab.length; i++) {
            const time = this.limit6Decimal(tempTab[i].time / 1000);
            markerTab.push(time + '\t' + time + '\t' + tempTab[i].name);
        }

        const blob = new Blob([markerTab.join('\r\n')], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'marker.txt');
    }

    onMousemove($event: MouseEvent) {
        this.markerMovingPos = $event.x - this.markersHTMLElement.nativeElement.getBoundingClientRect().left;
    }

    public isEmpty(): boolean {
        return !this.markers || (this.markers && this.markers.length === 0);
    }

    public addMarker($event: MouseEvent) {
        const marker = new Marker(this.limit6Decimal(this.mainService.getValue($event.x - this.markersHTMLElement.nativeElement.getBoundingClientRect().left)), '');
        this.markers.push(marker);
    }

    public deleteMarker(marker) {
        const index = this.markers.indexOf(marker);
        this.markers.splice(index, 1);
    }

    openDialog(marker: Marker): void {
        const dialogRef = this.dialog.open(MarkerDialogComponent, {
            width: '300px',
            data: marker,
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) {
                this.deleteMarker(marker);
            }
        });
    }

    limit6Decimal(number: number): number {
        return Math.round(number * 100) / 100;
    }
}
