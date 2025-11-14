'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

export default function FAQPage() {
  const t = useTranslations('faq');
  const tCta = useTranslations('cta');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setOpenItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const faqItems = [
    {
      key: 'whatIs',
      question: t('questions.whatIs.question'),
      answer: t('questions.whatIs.answer'),
    },
    {
      key: 'howLong',
      question: t('questions.howLong.question'),
      answer: t('questions.howLong.answer'),
    },
    {
      key: 'needRegistration',
      question: t('questions.needRegistration.question'),
      answer: t('questions.needRegistration.answer'),
    },
    {
      key: 'accuracy',
      question: t('questions.accuracy.question'),
      answer: t('questions.accuracy.answer'),
    },
    {
      key: 'dataPrivacy',
      question: t('questions.dataPrivacy.question'),
      answer: t('questions.dataPrivacy.answer'),
    },
    {
      key: 'preparation',
      question: t('questions.preparation.question'),
      answer: t('questions.preparation.answer'),
    },
    {
      key: 'retake',
      question: t('questions.retake.question'),
      answer: t('questions.retake.answer'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <Badge className="mb-4">
              <HelpCircle className="mr-2 h-3 w-3" />
              FAQ
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="pointer-events-none absolute inset-x-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4">
              {faqItems.map((item) => {
                const isOpen = openItems.includes(item.key);
                return (
                  <Card
                    key={item.key}
                    className="relative overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader 
                      className="cursor-pointer pb-4"
                      onClick={() => toggleItem(item.key)}
                    >
                      <CardTitle className="flex items-center justify-between text-left">
                        <span className="text-base font-semibold">{item.question}</span>
                        <div className="ml-4 flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </CardContent>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              {tCta('title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {tCta('description')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/#comenzar">{tCta('startTest')}</Link>
              </Button>
              <Button variant="secondary" asChild size="lg">
                <Link href="/">{t('backToHome')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
