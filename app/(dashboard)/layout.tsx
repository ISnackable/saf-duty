import { BottomNav } from '@/components/bottom-nav';
import { Header } from '@/components/header';
import { SideNav } from '@/components/side-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section>
        <nav className='flex'>
          <Header />

          <SideNav className='fixed hidden border-r xl:flex' />
        </nav>

        <div className='mb-12 mt-16 pb-8 md:container sm:mb-0 md:mx-auto xl:pl-[256px]'>
          {children}
        </div>
        <BottomNav />
      </section>
    </>
  );
}
