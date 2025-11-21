import { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit } from 'lucide-react';
import { mockStocks, type StockPage } from '@/lib/mockData';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: StockPage['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 hover-elevate';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800 hover-elevate';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover-elevate';
    }
  };

  const getStatusText = (status: StockPage['status']) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'in_review':
        return 'In Review';
      case 'draft':
        return 'Draft';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Stock Pages</h1>
          <p className="text-muted-foreground mt-1">Manage stock landing pages and content</p>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ticker or company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Ticker</TableHead>
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Languages</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks.map((stock) => (
              <TableRow key={stock.id} className="hover-elevate" data-testid={`row-stock-${stock.ticker}`}>
                <TableCell>
                  <span className="font-mono font-semibold" data-testid={`text-ticker-${stock.ticker}`}>
                    {stock.ticker}
                  </span>
                </TableCell>
                <TableCell data-testid={`text-company-${stock.ticker}`}>{stock.companyName}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {stock.languages.includes('en') && (
                      <Badge variant="outline" className="text-xs no-default-hover-elevate">
                        EN
                      </Badge>
                    )}
                    {stock.languages.includes('ar') && (
                      <Badge variant="outline" className="text-xs no-default-hover-elevate">
                        AR
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(stock.status)} no-default-hover-elevate`} data-testid={`badge-status-${stock.ticker}`}>
                    {getStatusText(stock.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{stock.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation(`/editor/${stock.ticker}`)}
                    data-testid={`button-edit-${stock.ticker}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No stocks found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
