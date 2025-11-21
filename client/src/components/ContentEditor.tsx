import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface ContentEditorProps {
  stock: StockPage;
  onChange: (stock: StockPage) => void;
}

export default function ContentEditor({ stock, onChange }: ContentEditorProps) {
  const addFaq = (lang: 'en' | 'ar') => {
    onChange({
      ...stock,
      content: {
        ...stock.content,
        [lang]: {
          ...stock.content[lang],
          faqs: [...stock.content[lang].faqs, { question: '', answer: '' }],
        },
      },
    });
  };

  const removeFaq = (lang: 'en' | 'ar', index: number) => {
    onChange({
      ...stock,
      content: {
        ...stock.content,
        [lang]: {
          ...stock.content[lang],
          faqs: stock.content[lang].faqs.filter((_, i) => i !== index),
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Content Blocks</h3>
        <p className="text-muted-foreground">
          Manage long-form content for the stock landing page
        </p>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en" data-testid="tab-content-en">English</TabsTrigger>
          <TabsTrigger value="ar" data-testid="tab-content-ar">Arabic (RTL)</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="overview-en">Company Overview</Label>
            <Textarea
              id="overview-en"
              value={stock.content.en.overview}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, overview: e.target.value },
                  },
                })
              }
              rows={4}
              data-testid="textarea-overview-en"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis-en">Investment Thesis</Label>
            <Textarea
              id="thesis-en"
              value={stock.content.en.thesis}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, thesis: e.target.value },
                  },
                })
              }
              rows={4}
              data-testid="textarea-thesis-en"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risks-en">Risks</Label>
            <Textarea
              id="risks-en"
              value={stock.content.en.risks}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, risks: e.target.value },
                  },
                })
              }
              rows={4}
              data-testid="textarea-risks-en"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights-en">Highlights</Label>
            <Textarea
              id="highlights-en"
              value={stock.content.en.highlights}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, highlights: e.target.value },
                  },
                })
              }
              rows={3}
              data-testid="textarea-highlights-en"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">FAQs</CardTitle>
                <Button size="sm" variant="outline" onClick={() => addFaq('en')} data-testid="button-add-faq-en">
                  <Plus className="h-4 w-4 mr-1" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stock.content.en.faqs.map((faq, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...stock.content.en.faqs];
                          newFaqs[index].question = e.target.value;
                          onChange({
                            ...stock,
                            content: {
                              ...stock.content,
                              en: { ...stock.content.en, faqs: newFaqs },
                            },
                          });
                        }}
                        data-testid={`input-faq-question-en-${index}`}
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...stock.content.en.faqs];
                          newFaqs[index].answer = e.target.value;
                          onChange({
                            ...stock,
                            content: {
                              ...stock.content,
                              en: { ...stock.content.en, faqs: newFaqs },
                            },
                          });
                        }}
                        rows={2}
                        data-testid={`textarea-faq-answer-en-${index}`}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFaq('en', index)}
                      data-testid={`button-remove-faq-en-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {stock.content.en.faqs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No FAQs added yet. Click "Add FAQ" to get started.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="overview-ar">نظرة عامة على الشركة</Label>
            <Textarea
              id="overview-ar"
              value={stock.content.ar.overview}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, overview: e.target.value },
                  },
                })
              }
              rows={4}
              dir="rtl"
              className="text-right"
              data-testid="textarea-overview-ar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis-ar">أطروحة الاستثمار</Label>
            <Textarea
              id="thesis-ar"
              value={stock.content.ar.thesis}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, thesis: e.target.value },
                  },
                })
              }
              rows={4}
              dir="rtl"
              className="text-right"
              data-testid="textarea-thesis-ar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risks-ar">المخاطر</Label>
            <Textarea
              id="risks-ar"
              value={stock.content.ar.risks}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, risks: e.target.value },
                  },
                })
              }
              rows={4}
              dir="rtl"
              className="text-right"
              data-testid="textarea-risks-ar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights-ar">أبرز النقاط</Label>
            <Textarea
              id="highlights-ar"
              value={stock.content.ar.highlights}
              onChange={(e) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, highlights: e.target.value },
                  },
                })
              }
              rows={3}
              dir="rtl"
              className="text-right"
              data-testid="textarea-highlights-ar"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">الأسئلة الشائعة</CardTitle>
                <Button size="sm" variant="outline" onClick={() => addFaq('ar')} data-testid="button-add-faq-ar">
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة سؤال
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stock.content.ar.faqs.map((faq, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg" dir="rtl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="السؤال"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...stock.content.ar.faqs];
                          newFaqs[index].question = e.target.value;
                          onChange({
                            ...stock,
                            content: {
                              ...stock.content,
                              ar: { ...stock.content.ar, faqs: newFaqs },
                            },
                          });
                        }}
                        dir="rtl"
                        className="text-right"
                        data-testid={`input-faq-question-ar-${index}`}
                      />
                      <Textarea
                        placeholder="الإجابة"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...stock.content.ar.faqs];
                          newFaqs[index].answer = e.target.value;
                          onChange({
                            ...stock,
                            content: {
                              ...stock.content,
                              ar: { ...stock.content.ar, faqs: newFaqs },
                            },
                          });
                        }}
                        rows={2}
                        dir="rtl"
                        className="text-right"
                        data-testid={`textarea-faq-answer-ar-${index}`}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFaq('ar', index)}
                      data-testid={`button-remove-faq-ar-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {stock.content.ar.faqs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4" dir="rtl">
                  لم يتم إضافة أسئلة بعد. انقر على "إضافة سؤال" للبدء.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
