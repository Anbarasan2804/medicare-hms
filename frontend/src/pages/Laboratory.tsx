import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Laboratory() {
  return <CrudPage config={MODULES['laboratory']} />;
}
