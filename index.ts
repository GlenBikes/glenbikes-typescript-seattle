import {SeattleRegion} from './src/seattle';
import {IRegion} from 'glenbikes-typescript-test';

export {SeattleRegion} from './src/seattle';

export function GetRegion(): IRegion {
  return new SeattleRegion();
}

log.info(`Seattle module loaded.`);
