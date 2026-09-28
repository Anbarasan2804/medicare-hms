import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function MedicalRecords() {
  return <CrudPage config={MODULES['medical-records']} />;
}
