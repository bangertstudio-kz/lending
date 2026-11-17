'use strict';

import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '../src/components/Header';
import { Hero } from '../src/components/Hero';
import { CaseStudies } from '../src/components/CaseStudies';
import { Process } from '../src/components/Process';
import { Services } from '../src/components/Services';
import { Geography } from '../src/components/Geography';
import { Blog } from '../src/components/Blog';
import { Faq } from '../src/components/Faq';
import { ContactForm } from '../src/components/ContactForm';
import { Footer } from '../src/components/Footer';
import { MobileScrollButton } from '../src/components/MobileScrollButton';
import { SectionReveal } from '../src/components/ui/SectionReveal';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getCases, getPosts, REVALIDATE, type Case, type Post } from '@/src/data/content';

export default function Home({ cases, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <SeoHead page="home" path="/" includeFaq={true} />
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative">
          <Hero projectCount={cases.length} />
          <CaseStudies cases={cases} />
          <SectionReveal>
            <Process />
          </SectionReveal>
          <SectionReveal>
            <Services />
          </SectionReveal>
          <SectionReveal>
            <Geography />
          </SectionReveal>
          <SectionReveal>
            <Blog posts={posts} />
          </SectionReveal>
          <SectionReveal>
            <Faq />
          </SectionReveal>
          {/* <CalculatorCTA />
          <DevSolutions /> */}
          <SectionReveal>
            <ContactForm />
          </SectionReveal>
        </main>
        <Footer />
        <MobileScrollButton />
      </div>
    </>
  );
}


export const getStaticProps: GetStaticProps<{ cases: Case[]; posts: Post[] }> = async ({ locale }) => {
  const [cases, posts] = await Promise.all([getCases(locale), getPosts(locale)]);
  return { props: { cases, posts }, revalidate: REVALIDATE };
};