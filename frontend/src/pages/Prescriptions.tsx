import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Prescriptions() {
  return <CrudPage config={MODULES['prescriptions']} />;
}
