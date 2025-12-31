import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Clock, 
  ChevronRight, 
  BookOpen,
  TrendingUp,
  Globe,
  Moon,
  Sun,
  Mail
} from 'lucide-react';
import { mockBlogs, type BlogPost } from '@/lib/mockData';
import { mockBlogHomeSettings, blogCategories } from '@/lib/discoverData';
import { useTheme } from '@/hooks/use-theme';

export default function BlogHome() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  
  const isRTL = language === 'ar';
  const settings = mockBlogHomeSettings;

  const featuredPost = mockBlogs.find(p => p.id === settings.featuredPostId);
  const publishedPosts = mockBlogs.filter(p => p.status === 'published');
  const mostReadPosts = settings.mostReadPostIds
    .map(id => mockBlogs.find(p => p.id === id))
    .filter(Boolean) as BlogPost[];

  const filteredPosts = activeCategory
    ? publishedPosts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())
    : publishedPosts;

  const labels = {
    en: {
      heroTitle: 'Learn & Insights',
      heroSubtitle: 'Expert analysis, educational guides, and market insights',
      searchPlaceholder: 'Search articles...',
      featuredStory: 'Featured Story',
      latestPosts: 'Latest Posts',
      mostRead: 'Most Read',
      topCategories: 'Top Categories',
      readMore: 'Read more',
      minRead: 'min read',
      newsletter: 'Stay Updated',
      newsletterDesc: 'Get the latest insights and analysis delivered to your inbox',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Enter your email',
      privacyNote: 'We respect your privacy. Unsubscribe anytime.',
      disclaimer: 'For informational purposes only. Not investment advice.',
      viewAll: 'View all',
      allPosts: 'All',
    },
    ar: {
      heroTitle: 'تعلم ورؤى',
      heroSubtitle: 'تحليلات الخبراء والأدلة التعليمية ورؤى السوق',
      searchPlaceholder: 'البحث في المقالات...',
      featuredStory: 'القصة المميزة',
      latestPosts: 'أحدث المقالات',
      mostRead: 'الأكثر قراءة',
      topCategories: 'أهم التصنيفات',
      readMore: 'اقرأ المزيد',
      minRead: 'دقيقة قراءة',
      newsletter: 'ابق على اطلاع',
      newsletterDesc: 'احصل على أحدث الرؤى والتحليلات في بريدك الإلكتروني',
      subscribe: 'اشترك',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      privacyNote: 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.',
      disclaimer: 'للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
      viewAll: 'عرض الكل',
      allPosts: 'الكل',
    },
  };
  
  const t = labels[language];

  const PostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <Link href={`/blog/${post.slug}`}>
      <Card className={`hover-elevate cursor-pointer h-full ${featured ? 'md:flex' : ''}`} data-testid={`post-card-${post.id}`}>
        <div className={`${featured ? 'md:w-2/5' : ''} aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-t-lg ${featured ? 'md:rounded-l-lg md:rounded-tr-none' : ''} flex items-center justify-center`}>
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <CardContent className={`p-4 ${featured ? 'md:flex-1 md:flex md:flex-col md:justify-center' : ''}`}>
          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h3 className={`font-semibold ${featured ? 'text-xl md:text-2xl' : 'text-base'} line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
            {post.title[language]}
          </h3>
          <p className={`text-sm text-muted-foreground mt-2 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
            {post.excerpt[language]}
          </p>
          <div className={`flex items-center gap-4 mt-3 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{post.author}</span>
            <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="h-3 w-3" />
              {post.readTime} {t.minRead}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const SidebarPostItem = ({ post, rank }: { post: BlogPost; rank?: number }) => (
    <Link href={`/blog/${post.slug}`}>
      <div 
        className={`flex items-start gap-3 py-3 hover-elevate rounded-lg cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
        data-testid={`sidebar-post-${post.id}`}
      >
        {rank && (
          <span className="text-2xl font-bold text-muted-foreground/30 w-8">{rank}</span>
        )}
        <div className={isRTL ? 'text-right' : ''}>
          <p className="font-medium text-sm line-clamp-2">{post.title[language]}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {post.readTime} {t.minRead}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/discover">
                <span className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">baraka</span>
              </Link>
              <nav className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link href="/stocks">
                  <Button variant="ghost" size="sm" data-testid="nav-stocks">
                    {language === 'en' ? 'Stocks' : 'الأسهم'}
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" size="sm" data-testid="nav-blog">
                    {language === 'en' ? 'Learn' : 'تعلم'}
                  </Button>
                </Link>
              </nav>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-admin">
                  {language === 'en' ? 'Admin' : 'الإدارة'}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                data-testid="button-language-toggle"
              >
                <Globe className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {language === 'en' ? 'AR' : 'EN'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-2xl mx-auto text-center`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="hero-title">
                {t.heroTitle}
              </h1>
              <p className="text-muted-foreground mb-6" data-testid="hero-subtitle">
                {t.heroSubtitle}
              </p>
              
              <div className="relative max-w-md mx-auto">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-11`}
                  data-testid="input-search"
                />
              </div>
              
              <div className={`flex flex-wrap items-center justify-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant={activeCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(null)}
                  data-testid="filter-all"
                >
                  {t.allPosts}
                </Button>
                {blogCategories.slice(0, 5).map(cat => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat.slug)}
                    data-testid={`filter-${cat.id}`}
                  >
                    {cat.name[language]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featuredPost && !activeCategory && (
          <section className="py-8 container mx-auto px-4">
            <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
              {t.featuredStory}
            </h2>
            <PostCard post={featuredPost} featured />
          </section>
        )}

        <Separator />

        <section className="py-8 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className={`text-xl font-semibold ${isRTL ? 'text-right' : ''}`}>
                  {t.latestPosts}
                </h2>
                <Link href="/blog/all">
                  <Button variant="ghost" size="sm">
                    {t.viewAll}
                    <ChevronRight className={`h-4 w-4 ml-1 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {t.mostRead}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {mostReadPosts.map((post, idx) => (
                    <SidebarPostItem key={post.id} post={post} rank={idx + 1} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-base ${isRTL ? 'text-right' : ''}`}>
                    {t.topCategories}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {blogCategories.map(cat => (
                      <Button
                        key={cat.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveCategory(cat.slug)}
                        data-testid={`sidebar-cat-${cat.id}`}
                      >
                        {cat.name[language]}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.newsletter}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.newsletterDesc}</p>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    data-testid="input-newsletter-email"
                  />
                  <Button data-testid="button-subscribe">{t.subscribe}</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{t.privacyNote}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground" data-testid="disclaimer">
            {t.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
