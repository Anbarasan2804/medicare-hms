import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Departments() {
  return <CrudPage config={MODULES['departments']} />;
}
