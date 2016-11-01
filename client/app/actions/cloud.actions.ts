import { Injectable, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../store';
import { WonderActions } from './wonder.actions';

declare let TweenMax: any;
declare let TimelineMax: any;
declare let Power0: any;

@Injectable()
export class CloudActions {
  @select('animaArray') animaArray$: Observable<any>;

  counter: number = 0;
  animaArray: any;

  constructor(private ngRedux: NgRedux<IAppState>) {
    this.animaArray$.subscribe(anima => {
      this.animaArray = anima;
    });
  }

  static CHANGE_STYLES: string = 'CHANGE_STYLES';
  static CHANGE_ANIMA: string = 'CHANGE_ANIMA';

  private cloudAnimaAfterCB(item: any, index: number, position: string): void {
    this.ngRedux.dispatch({ type: WonderActions.CHANGE_AFTER_WONDERS, payload: { index: index, wonder: item } });
    this.loopAnima(index, position);
  }

  private loopAnima(index: number, position: string): void {
    this.animaArray.get(index).play(position);
  }

  cloudType(wonderLength: number, index: number): void {
    let randomInt = this.rndInt(1, 3);

    if (wonderLength <= 4) {

      switch (randomInt) {
        case 1:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'smallcloud1' } });
          break;
        case 2:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'smallcloud2' } });
          break;
        case 3:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'smallcloud3' } });
          break;
      }

    }
    else if (wonderLength > 4 && wonderLength <= 15) {

      switch (randomInt) {
        case 1:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'mediumcloud1' } });
          break;
        case 2:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'mediumcloud2' } });
          break;
        case 3:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'mediumcloud3' } });
          break;
      }

    }
    else {

      switch (randomInt) {
        case 1:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'largecloud1' } });
          break;
        case 2:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'largecloud2' } });
          break;
        case 3:
          this.ngRedux.dispatch({ type: CloudActions.CHANGE_STYLES, payload: { index: index, asset: 'largecloud3' } });
          break;
      }

    }
  }

  cloudAnima(value: string, el: ElementRef, object: any, index: number): string {

    if (this.counter < 10) {
      let anima = new TimelineMax({
        callbackScope: this,
        onComplete: this.loopAnima,
        onCompleteParams: [index, "loop"]
      });

      // TODO: find a way to get the initial element position to subtract from innerWidth
      anima //.add(() => this.cloudType(object.name.length, index))
        .to(el, this.rndInt(1, 3), { opacity: 1 })
        .to(el, this.rndInt(30, 85), { ease: Power0.easeNone, x: window.innerWidth + 350, y: this.rndInt(-200, 200) }, 0)
        .addLabel('loop', '+=0')
        .to(el, 0, { ease: Power0.easeNone, left: '-350px', x: '0', y: '0' })
        .to(el, 1, { opacity: 1 })
        .to(el, this.rndInt(30, 85), { ease: Power0.easeNone, x: window.innerWidth + 350, y: this.rndInt(-200, 200) });

      this.counter++;
      this.ngRedux.dispatch({ type: CloudActions.CHANGE_ANIMA, payload: anima });
      return value;
    }

    return value;
  }

  cloudAnimaAfter(el: ElementRef, item: any, index: number): void {
    // Make two TweenMax with the same delay
    // The first will take 1 second the change opacity to 0
    TweenMax.to(el, 1, {
      opacity: 0,
      callbackScope: this,
      onComplete: this.cloudType,
      onCompleteParams: [item.name.length, index]
    });
    // The second one will call the afterCB to start the loop
    TweenMax.to(el, 1, {
      callbackScope: this,
      onComplete: this.cloudAnimaAfterCB,
      onCompleteParams: [item, index, 'loop']
    });
  }

  rndInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
