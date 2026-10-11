import { setDirection, setState, stepKey } from '../state/store';
import { useLab } from '../state/useLab';
import { Seg } from './ui';

export function KeyControls() {
  const { s, t } = useLab();
  return (
    <div className="controls">
      <Seg label={t.keyBar.direction} value={s.dir} onChange={setDirection} options={[{ v: 'cw', label: t.cw }, { v: 'ccw', label: t.ccw }]} />
      <div className="row">
        <div className="nav grow">
          <button type="button" onClick={() => stepKey(-1)}>{t.prev}</button>
          <button type="button" onClick={() => stepKey(1)}>{t.next}</button>
        </div>
        <Seg label={t.keyBar.notation} value={s.nt} onChange={(nt) => setState({ nt })} options={[{ v: 'en', label: 'C D E' }, { v: 'pt', label: 'Dó Ré Mi' }]} />
      </div>
    </div>
  );
}
