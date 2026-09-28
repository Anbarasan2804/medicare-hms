import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Doctors() {
  return <CrudPage config={MODULES['doctors']} />;
}
