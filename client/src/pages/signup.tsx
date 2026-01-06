import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, CheckCircle2, Shield, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BarakaHeader from '@/components/BarakaHeader';

const gccCountries = [
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966' },
  { code: 'BH', name: 'Bahrain', phoneCode: '+973' },
  { code: 'KW', name: 'Kuwait', phoneCode: '+965' },
  { code: 'OM', name: 'Oman', phoneCode: '+968' },
  { code: 'QA', name: 'Qatar', phoneCode: '+974' },
];

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  countryCode: z.string().min(1, 'Please select your country'),
  phoneNumber: z.string().min(8, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  countryOfResidence: z.string().min(1, 'Please select your country of residence'),
  nationalId: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  shariahInterest: z.boolean(),
  referralCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
  privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
  marketingOptIn: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      countryCode: '+971',
      phoneNumber: '',
      dateOfBirth: '',
      nationality: '',
      countryOfResidence: '',
      nationalId: '',
      password: '',
      confirmPassword: '',
      investmentExperience: 'beginner',
      shariahInterest: false,
      referralCode: '',
      termsAccepted: false,
      privacyAccepted: false,
      marketingOptIn: false,
    },
  });

  const selectedCountry = form.watch('countryOfResidence');
  const phoneCode = gccCountries.find(c => c.code === selectedCountry)?.phoneCode || '+971';

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Signup data:', data);
    setIsSuccess(true);
    setIsSubmitting(false);
    
    toast({
      title: 'Application Submitted!',
      description: 'Your account application has been received. We will review it within 1-3 business days.',
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <main className="container max-w-lg py-16">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8 space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2" data-testid="text-success-title">Application Submitted!</h1>
                <p className="text-muted-foreground">
                  Thank you for applying to join Baraka. Your application is now under review.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Review Time</p>
                    <p className="text-sm text-muted-foreground">1-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Next Steps</p>
                    <p className="text-sm text-muted-foreground">We'll email you once your account is approved</p>
                  </div>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/discover" data-testid="link-explore">
                  Explore Stocks While You Wait
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BarakaHeader />
      
      <main className="container max-w-2xl py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-signup-title">Create Your Account</h1>
          <p className="text-muted-foreground">Join thousands of investors in the GCC region</p>
        </div>

        {/* GCC Notice Banner */}
        <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">GCC Residents Only</p>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Baraka is currently available for residents of UAE, Saudi Arabia, Bahrain, Kuwait, Oman, and Qatar. 
              All accounts are subject to approval.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Fill in your details to apply for a Baraka account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (as on ID)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" data-testid="input-full-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="you@example.com" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" data-testid="input-dob" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Emirati, Saudi" data-testid="input-nationality" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Residency Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Residency Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="countryOfResidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Residence</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-country">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gccCountries.map(country => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <div className="flex gap-2">
                          <div className="w-24 flex items-center justify-center bg-muted rounded-md text-sm font-mono">
                            {phoneCode}
                          </div>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="50 123 4567" className="flex-1" data-testid="input-phone" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emirates ID / National ID (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="For faster approval" data-testid="input-national-id" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Providing your ID number can speed up the approval process</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Account Security</h3>
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Minimum 8 characters" data-testid="input-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Re-enter your password" data-testid="input-confirm-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Investment Profile */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Investment Profile</h3>
                  
                  <FormField
                    control={form.control}
                    name="investmentExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Experience</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="beginner" id="beginner" data-testid="radio-beginner" />
                              <Label htmlFor="beginner" className="font-normal">Beginner - New to investing</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="intermediate" id="intermediate" data-testid="radio-intermediate" />
                              <Label htmlFor="intermediate" className="font-normal">Intermediate - Some experience</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="advanced" id="advanced" data-testid="radio-advanced" />
                              <Label htmlFor="advanced" className="font-normal">Advanced - Experienced investor</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shariahInterest"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-shariah"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I'm interested in Shariah-compliant investing</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            We'll prioritize halal investment options for your portfolio
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Code (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter referral code" data-testid="input-referral" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Both you and your referrer get $30 when you fund your account</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Legal Agreements */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Legal Agreements</h3>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-terms"
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="font-normal">
                            I agree to the <a href="https://getbaraka.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms & Conditions</a>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacyAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-privacy"
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="font-normal">
                            I agree to the <a href="https://getbaraka.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Policy</a>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingOptIn"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-marketing"
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="font-normal text-muted-foreground">
                            Send me updates about new features, investment tips, and promotions
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Approval Notice */}
                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your application will be reviewed within 1-3 business days. We'll notify you by email once your account is approved.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account? <a href="https://app.getbaraka.com/login" className="text-primary underline">Sign in</a>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Risk Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Capital at risk. The value of investments can go down as well as up. You may get back less than you invest. This is not investment advice.
          </p>
        </div>
      </main>
    </div>
  );
}
