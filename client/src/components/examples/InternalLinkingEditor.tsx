import { useState } from 'react';
import InternalLinkingEditor from '@/components/InternalLinkingEditor';
import { mockStocks } from '@/lib/mockData';

export default function InternalLinkingEditorExample() {
  const [stock, setStock] = useState(mockStocks[0]);

  return (
    <div className="p-8 max-w-4xl">
      <InternalLinkingEditor stock={stock} onChange={setStock} />
    </div>
  );
}
