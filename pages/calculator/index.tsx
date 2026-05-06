import { useRouter } from 'next/router';
import { Header } from '@/app/components/Header';
import CostCalculator from '@/app/components/Calculator/CostCalculator';

export default function CalculatorPage() {
  const router = useRouter();
  const description = typeof router.query.description === 'string' ? router.query.description : '';

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <div className="pt-20">
        <CostCalculator isOpen inline projectDescription={description} />
      </div>
    </div>
  );
}
