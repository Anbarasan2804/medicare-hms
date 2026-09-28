import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Appointments() {
  return <CrudPage config={MODULES['appointments']} />;
}
