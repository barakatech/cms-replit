import DynamicDataDisplay from '@/components/DynamicDataDisplay';
import { mockStocks } from '@/lib/mockData';

export default function DynamicDataDisplayExample() {
  return (
    <div className="p-8 max-w-4xl">
      <DynamicDataDisplay stock={mockStocks[0]} />
    </div>
  );
}
