import { CrudPage } from '../components/CrudPage';
import { MODULES } from '../config/modules';

export default function Billing() {
  return <CrudPage config={MODULES['billing']} />;
}
