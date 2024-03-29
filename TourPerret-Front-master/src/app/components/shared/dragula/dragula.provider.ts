import { dragula } from './dragula.class';
import { EventEmitter, Injectable } from '@angular/core';
import { Utils } from '../../../services/utils.class';

@Injectable()
export class DragulaService {
  public cancel: EventEmitter<any> = new EventEmitter();
  public cloned: EventEmitter<any> = new EventEmitter();
  public drag: EventEmitter<any> = new EventEmitter();
  public dragend: EventEmitter<any> = new EventEmitter();
  public drop: EventEmitter<any> = new EventEmitter();
  public out: EventEmitter<any> = new EventEmitter();
  public over: EventEmitter<any> = new EventEmitter();
  public remove: EventEmitter<any> = new EventEmitter();
  public shadow: EventEmitter<any> = new EventEmitter();
  public dropModel: EventEmitter<any> = new EventEmitter();
  public removeModel: EventEmitter<any> = new EventEmitter();
  private events: string[] = [
    'cancel', 'cloned', 'drag', 'dragend', 'drop', 'out', 'over',
    'remove', 'shadow', 'dropModel', 'removeModel'
  ];
  private bags: any[] = [];

  public add(name: string, drake: any): any {
      let bag = this.find(name);
    if (bag) {
      throw new Error('Bag named: ' + name + ' already exists.');
    }
    bag = {name, drake};
    this.bags.push(bag);
    if (drake.models) { // models to sync with (must have same structure as containers)
      this.handleModels(name, drake);
    }
    if (!bag.initEvents) {
      this.setupEvents(bag);
    }
    return bag;
  }

  public find(name: string): any {
    for (const bag of this.bags) {
      if (bag.name === name) {
        return bag;
      }
    }
  }

  public destroy(name: string): void {
    const bag = this.find(name);
    const i = this.bags.indexOf(bag);
    this.bags.splice(i, 1);
    bag.drake.destroy();
  }

  public setOptions(name: string, options: any): void {
    const bag = this.add(name, dragula(options));
    this.handleModels(name, bag.drake);
  }

  private handleModels(name: string, drake: any): void {
      let dragElm: any;
      let dragIndex: number;
      let dropIndex: number;
      let sourceModel: any;
    drake.on('remove', (el: any, source: any) => {
      if (!drake.models) {
        return;
      }
      sourceModel = drake.models[drake.containers.indexOf(source)];
      sourceModel.splice(dragIndex, 1);
      // console.log('REMOVE');
      // console.log(sourceModel);
      this.removeModel.emit([name, el, source]);
    });
    drake.on('drag', (el: any, source: any) => {
      dragElm = el;
      dragIndex = this.domIndexOf(el, source);
    });
    drake.on('drop', (dropElm: any, target: any, source: any) => {
      if (!drake.models || !target) {
        return;
      }
      dropIndex = this.domIndexOf(dropElm, target);
      sourceModel = drake.models[drake.containers.indexOf(source)];
      // console.log('DROP');
      // console.log(sourceModel);
        let dropElmModel = sourceModel[dragIndex];
      if (target === source) {
        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
      } else {
        const notCopy = dragElm === dropElm;
        const targetModel = drake.models[drake.containers.indexOf(target)];

        dropElmModel = notCopy ? sourceModel[dragIndex] : Utils.clone(sourceModel[dragIndex], false);

        if (notCopy) {
          sourceModel.splice(dragIndex, 1);
        }
        targetModel.splice(dropIndex, 0, dropElmModel);
        target.removeChild(dropElm); // element must be removed for ngFor to apply correctly
      }
        this.dropModel.emit([name, dropElm, target, source, dropElmModel, dragIndex, dropIndex]);
    });
  }

  private setupEvents(bag: any): void {
    bag.initEvents = true;
    const that: any = this;
    const emitter = (type: any) => {
      function replicate(): void {
        const args = Array.prototype.slice.call(arguments);
        that[type].emit([bag.name].concat(args));
      }

      bag.drake.on(type, replicate);
    };
    this.events.forEach(emitter);
  }

  private domIndexOf(child: any, parent: any): any {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
