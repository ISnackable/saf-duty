import { BottomNav } from '@/components/bottom-nav';
import { Header } from '@/components/header';
import { SideNav } from '@/components/side-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex min-h-screen'>
      <nav>
        <Header />

        <SideNav className='fixed hidden border-r xl:flex' />
      </nav>

      <div className='md:container md:mx-auto mt-12 pb-8 xl:pl-[256px] mb-12 sm:mb-0'>
        {children}
      </div>
      <BottomNav />
    </section>
  );
}
