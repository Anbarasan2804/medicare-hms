import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Staff() {
  return <CrudPage config={MODULES['staff']} />;
}
