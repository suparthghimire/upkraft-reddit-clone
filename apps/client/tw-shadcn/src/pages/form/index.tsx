import { cn } from '@/lib/utils';
import PageSidebar from './_components/page-header';
import FormPageContent from './_components/page-content';
import ThemeProvider, { useThemeContext } from './_providers/theme.provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import StepsProvider from './_providers/step-provider';

function FormInner() {
  console.log('Hello!');
  const { isDarkMode } = useThemeContext();
  return (
    <main
      className={cn(
        'bg-background text-foreground h-dvh w-full grid grid-cols-[auto_1fr]',
        isDarkMode && 'dark',
      )}
    >
      <PageSidebar />
      <ScrollArea viewPortClassName="max-h-[100vh] p-10">
        <FormPageContent />
      </ScrollArea>
    </main>
  );
}

function Form() {
  return (
    <ThemeProvider>
      <StepsProvider>
        <FormInner />
      </StepsProvider>
    </ThemeProvider>
  );
}

export default Form;
