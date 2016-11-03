import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';

import { WonderActions } from '../../actions/wonder/wonder.actions';
import { WonderService } from '../../services/wonder/wonder.service';
import { ClockService } from '../../services/clock/clock.service';
import { SocketService } from '../../services/socketio/socketio.service';
import { CloudActions } from '../../actions/cloud/cloud.actions';

declare let TweenMax: any;
declare let TimelineMax: any;
declare let Power0: any;

@Component({
  selector: 'cloud-generator',
  providers: [WonderActions, CloudActions],
  templateUrl: './cloud-generator.component.html',
  styleUrls: ['./cloud-generator.component.scss']
})

export class CloudGeneratorComponent {
  @select('cloudStyle') cloudStyle$: Observable<any>;
  @select('animaArray') animaArray$: Observable<any>;
  @select('wonder') wonder$: Observable<any>;
  private animaArray: any;
  private width: number;

  @ViewChild('wonderSky') wonderSky;

  constructor(
    private wonderActions: WonderActions,
    private wonderService: WonderService,
    private cloudActions: CloudActions,
    private socket: SocketService,
    private clockService: ClockService) { }

  ngOnInit() {
    this.width = window.innerWidth;
    this.clockService.currentTime.subscribe(time => this.timeOfDayCss());
    this.animaArray$.subscribe(anima => this.animaArray = anima);
    this.wonderService.getWonders()
      .subscribe(wonders => {
        // initialize store wonders
        this.wonderActions.initWonders(wonders);
        // initialize store cloudStyle
        wonders.forEach((item, index) => this.cloudType(item.name.length, index));
        // initialize socketio listener with backCall and delay till callback
        this.socket.syncUpdates('Wonder', wonders, ['CHANGE_WONDERS'], null, (item, index) => {

          TweenMax.to(this.wonderSky.nativeElement.children[index], 1, {
            opacity: 0,
            callbackScope: this,
            onComplete: this.cloudType,
            onCompleteParams: [item.name.length, index, true]
          });

        }, 1000);
      });
  }

  ngOnDestroy() {
    // detach socket listening when component is destroyed
    this.socket.unsyncUpdates('Wonder');
  }

  private loopAnima(index: number): void {
    this.animaArray.get(index).restart();
  }

  cloudAnima(value: string, el: ElementRef, object: any, index: number): string {
    if (this.animaArray.size === 10)
      this.animaArray.get(index).kill();

    const anima = new TimelineMax({
      callbackScope: this,
      onComplete: this.loopAnima,
      onCompleteParams: [index]
    });

    // TODO: find a way to get the initial element position to subtract from innerWidth
    anima.to(el, 0, { ease: Power0.easeNone, left: '-350px', x: '0', y: '0' })
      .to(el, this.rndInt(30, 85), { ease: Power0.easeNone, x: this.width + 350, y: this.rndInt(-200, 200) });

    // Push new gsap timeline to animaArray List
    this.cloudActions.changeAnima(anima, index);
    return value;
  }

  cloudType(wonderLength: number, index: number): void {
    let randomInt = this.rndInt(1, 3);

    if (wonderLength <= 4) {
      switch (randomInt) {
        case 1:
          this.cloudActions.changeStyle('smallcloud1', index);
          break;
        case 2:
          this.cloudActions.changeStyle('smallcloud2', index);
          break;
        case 3:
          this.cloudActions.changeStyle('smallcloud3', index);
          break;
      }
    }
    else if (wonderLength > 4 && wonderLength <= 15) {
      switch (randomInt) {
        case 1:
          this.cloudActions.changeStyle('mediumcloud1', index);
          break;
        case 2:
          this.cloudActions.changeStyle('mediumcloud2', index);
          break;
        case 3:
          this.cloudActions.changeStyle('mediumcloud3', index);
          break;
      }
    }
    else {
      switch (randomInt) {
        case 1:
          this.cloudActions.changeStyle('largecloud1', index);
          break;
        case 2:
          this.cloudActions.changeStyle('largecloud2', index);
          break;
        case 3:
          this.cloudActions.changeStyle('largecloud3', index);
          break;
      }
    }

  }

  rndInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  timeOfDayCss() {
    if(this.clockService.sunRise) {
      this.wonderSky.nativeElement.style.filter = "brightness(70%)";
    }
    else if(this.clockService.dayTime) {
      this.wonderSky.nativeElement.style.filter = "brightness(100%)";
    }
    else if(this.clockService.sunSet) {
      this.wonderSky.nativeElement.style.filter = "brightness(70%)";
    }
    else if(this.clockService.nightTime) {
      this.wonderSky.nativeElement.style.filter = "brightness(30%)";
    }
    else{
      console.log('time of day not valid check sky.component.ts');
    }
  }

}
