import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { NgRedux } from 'ng2-redux';
import { IAppState } from '../../store';

import * as _ from 'lodash';
import * as io from 'socket.io-client';

// Make Models namespace for dynamic class initialization
import * as Models from '../../models/models.namespace';

@Injectable()
export class SocketService {
  socket;

  constructor(private ngRedux: NgRedux<IAppState>) {
    // socket.io now auto-configures its connection when we ommit a connection url
    this.socket = io.connect({ path: '/socket.io' });
  }

  /**
   * Register listeners to sync an array with updates on a model
   *
   * Takes the array we want to sync, the model name that socket updates are sent from,
   * and an optional callback function after new items are updated.
   */
  syncUpdates(modelName: string, array: Models.Universal[], state: string, cb?) {
    /**
     * Syncs item creation/updates on 'model:save'
     */
    this.socket.on(modelName + ':save', (item) => {
      let oldItem = _.find(array, { _id: item._id });
      let index = array.indexOf(oldItem);
      let event = 'created';

      // replace oldItem if it exists
      // otherwise just add item to the collection
      if (oldItem) {
        // oldItem.replace(item);
        this.ngRedux.dispatch({ type: state, payload: { index: index, wonder: item } });
        event = 'updated';
      } else {
        // Finds the model for the listener
        // and pushes a new object to array
        array.push(new Models[modelName](item));
      }

      return cb ? cb(item, index, array, event) : null;
    });

    /**
     * Syncs removed items on 'model:remove'
     */
    this.socket.on(modelName + ':remove', (item) => {
      let event = 'deleted';
      _.remove(array, { _id: item._id });
      cb(item, array, event);
    });
  }

  /**
   * Removes listeners for a models updates on the socket
   */
  unsyncUpdates(modelName) {
    this.socket.removeListener(modelName + ':save');
    this.socket.removeListener(modelName + ':remove');
  }
}
