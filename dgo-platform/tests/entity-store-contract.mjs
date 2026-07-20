import assert from 'node:assert/strict';
import { Entities } from '../core/entity-store.js';
const state={correspondence:[{id:'1',referenceId:'REF-1',subject:'A',department:'DGO',status:'registered'}],tracking:[{id:'T1',referenceId:'REF-1',title:'Task',department:'DGO',status:'assigned'}]};
Entities.hydrateFromState(state);
const rows=Entities.all('correspondence',{profile:{persona:'admin'}}); assert.equal(Object.isFrozen(rows),true); assert.equal(rows.length,1); assert.equal(rows[0].__ref,'REF-1');
const b=Entities.byReference('REF-1',{profile:{persona:'admin'}}); assert.ok(b.correspondence.length); assert.equal(Object.isFrozen(b),true);
console.log('entity-store-contract passed');
