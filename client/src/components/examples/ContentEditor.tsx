import { useState } from 'react';
import ContentEditor from '@/components/ContentEditor';
import { mockStocks } from '@/lib/mockData';

export default function ContentEditorExample() {
  const [stock, setStock] = useState(mockStocks[0]);

  return (
    <div className="p-8 max-w-4xl">
      <ContentEditor stock={stock} onChange={setStock} />
    </div>
  );
}
