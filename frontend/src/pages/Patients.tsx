import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Patients() {
  return <CrudPage config={MODULES['patients']} />;
}
