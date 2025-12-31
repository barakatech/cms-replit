import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';
import { RichTextEditor } from '@/components/RichTextEditor';

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
            <Label>Company Overview</Label>
            <RichTextEditor
              content={stock.content.en.overview}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, overview: value },
                  },
                })
              }
              placeholder="Write company overview..."
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>Investment Thesis</Label>
            <RichTextEditor
              content={stock.content.en.thesis}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, thesis: value },
                  },
                })
              }
              placeholder="Write investment thesis..."
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>Risks</Label>
            <RichTextEditor
              content={stock.content.en.risks}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, risks: value },
                  },
                })
              }
              placeholder="Write about risks..."
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>Highlights</Label>
            <RichTextEditor
              content={stock.content.en.highlights}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    en: { ...stock.content.en, highlights: value },
                  },
                })
              }
              placeholder="Write highlights..."
              dir="ltr"
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

        <TabsContent value="ar" className="space-y-6 mt-6" dir="rtl">
          <div className="space-y-2">
            <Label>نظرة عامة على الشركة</Label>
            <RichTextEditor
              content={stock.content.ar.overview}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, overview: value },
                  },
                })
              }
              placeholder="اكتب نظرة عامة على الشركة..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label>أطروحة الاستثمار</Label>
            <RichTextEditor
              content={stock.content.ar.thesis}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, thesis: value },
                  },
                })
              }
              placeholder="اكتب أطروحة الاستثمار..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label>المخاطر</Label>
            <RichTextEditor
              content={stock.content.ar.risks}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, risks: value },
                  },
                })
              }
              placeholder="اكتب عن المخاطر..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label>أبرز النقاط</Label>
            <RichTextEditor
              content={stock.content.ar.highlights}
              onChange={(value) =>
                onChange({
                  ...stock,
                  content: {
                    ...stock.content,
                    ar: { ...stock.content.ar, highlights: value },
                  },
                })
              }
              placeholder="اكتب أبرز النقاط..."
              dir="rtl"
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
