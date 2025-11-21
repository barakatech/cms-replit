import { useState } from 'react';
import MetadataEditor from '@/components/MetadataEditor';
import { mockStocks } from '@/lib/mockData';

export default function MetadataEditorExample() {
  const [stock, setStock] = useState(mockStocks[0]);

  return (
    <div className="p-8 max-w-4xl">
      <MetadataEditor stock={stock} onChange={setStock} />
    </div>
  );
}
