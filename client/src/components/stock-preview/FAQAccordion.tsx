import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type StockPage } from '@/lib/mockData';

interface FAQAccordionProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

export function FAQAccordion({ stock, language }: FAQAccordionProps) {
  const isRTL = language === 'ar';
  const faqs = stock.content[language].faqs;

  if (faqs.length === 0) return null;

  return (
    <div data-testid="faq-accordion" id="faq">
      <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
        {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`}
            className="border rounded-lg px-4"
            data-testid={`faq-item-${index}`}
          >
            <AccordionTrigger className={`text-left ${isRTL ? 'text-right flex-row-reverse' : ''}`}>
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
