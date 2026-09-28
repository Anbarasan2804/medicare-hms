import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Beds() {
  return <CrudPage config={MODULES['beds']} />;
}
